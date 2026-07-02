# Error Handling & Transaction-Create Error Codes

This guide explains how the SDK surfaces API errors, the error codes returned when creating a
transaction (`createTransferTransaction`, `createSwapTransaction`, ramp/FX, contract-call, etc.),
and whether a failed request is safe to retry.

> **The two questions that matter most**
>
> 1. **A `400 Bad Request` is safe to retry and cannot cause a double payment.** Every `400` on the
>    create path is raised during _validation_ — before the transaction is persisted and before
>    anything is signed or broadcast on-chain. No funds move on a `400`.
> 2. **The double-payment risk is not the `400` — it is an _ambiguous_ outcome** (network timeout,
>    dropped connection, `5xx`). A single create call can create → auto-approve → broadcast on-chain
>    before the response returns.
> 3. **On any failure, retry the same intent with the same `externalId`.** The per-org uniqueness
>    constraint on `externalId` guarantees at most one payment: the retry either creates the
>    transaction (if the first attempt never landed) or is safely rejected as a duplicate
>    (`A record with the same information already exists`). Never retry the same intent with a new
>    `externalId`, and never resend without one.

## Reading an error

Every non-2xx response is thrown as a typed subclass of `BaseAPIException`
(`BadRequestError` for `400`, `ForbiddenError` for `403`, `TooManyRequestsError` for `429`, and so
on). Each error exposes:

| Field          | Type                | Description                                                        |
| -------------- | ------------------- | ------------------------------------------------------------------ |
| `message`      | `string`            | Human-readable message (from the response body `message`).         |
| `errorCode`    | `string \| undefined` | Machine-readable code (e.g. `"4013"`). See table below.          |
| `status`       | `number`            | HTTP status code.                                                  |
| `responseText` | `any`               | Raw response body.                                                 |

```ts
import { BadRequestError } from "@primevault/js-api-sdk";

try {
  await apiClient.createTransferTransaction({ source, destination, amount, asset, chain });
} catch (error) {
  if (error instanceof BadRequestError) {
    // Branch on the machine-readable code where available:
    switch (error.errorCode) {
      case "4003": /* insufficient balance */ break;
      case "4011": /* compliance / OFAC blocked */ break;
      case "4013": /* invalid transaction parameters */ break;
      default:     /* fall back to error.message */ break;
    }
  }
}
```

## Transaction-create error codes

Codes are returned by the external API on the `code` field and surfaced as `error.errorCode`.
Codes `4011`–`4013` were recently introduced and previously came through as the generic `"400"`.

| `errorCode` | Symbolic name              | Trigger                                                        | Example `message`                                                                 | Safe to retry?                             |
| ----------- | -------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------ |
| `4001`      | `ON_CHAIN_VALIDATION_ERROR`| Chain/RPC rejected the built txn (gas estimation/simulation)  | RPC error text                                                                    | Yes — fix input, resend                    |
| `4002`      | `TXN_MESSAGE_VALIDATION_ERROR` | Invalid EIP-712 / typed data (contract-call, WalletConnect) | validation text                                                                 | Yes                                        |
| `4003`      | `TOKEN_BALANCE_LOW`        | Insufficient asset balance in vault                           | `Vault has insufficient balance to complete the transaction`                      | Yes — after funding                        |
| `4004`      | `GAS_TOKEN_BALANCE_LOW`    | Insufficient native token for gas (source or fee-payer vault) | `Vault has insufficient native token balance to complete the transaction`         | Yes — after funding                        |
| `4005`      | `DESTINATION_ERROR`        | Missing/invalid contact, vault, or address; bad format        | `Invalid destination address: <addr> for chain: <chain>`                          | Yes — after fixing                         |
| `4006`      | `POLICY_CONFLICT`          | Blocked / no matching / ambiguous policy                      | `Transaction blocked by policy.`                                                  | Yes — keeps failing until policy changes   |
| `4010`      | `RAMP_QUOTE_UNAVAILABLE`   | No ramp quote for asset/amount/chain                          | `No ramp quote is available for the requested assets, amount, and chain.`         | Yes — re-quote first                       |
| `4011`      | `COMPLIANCE_BLOCKED`       | OFAC / sanctioned destination address                         | `Cannot add OFAC sanctioned address`                                              | **No** — change the destination            |
| `4012`      | `CHAIN_NOT_ENABLED`        | Chain not enabled for the org                                 | `<chain> transactions are not enabled at this time`                               | Yes — after org config change              |
| `4013`      | `INVALID_TXN_PARAMS`       | Invalid category / unsupported gas param / missing `blockChain` | `Invalid transaction category, should be TRANSFER, SWAP, RAMP, FX or CONTRACT_CALL` | Yes — fix request parameters             |

### Codes without a specific value (match on `message`)

Some validation failures still come through with the generic `errorCode` `"400"` — or `undefined`
for the duplicate-`externalId` case — so branch on `error.message` for these:

| `errorCode`  | `message` (example)                                    | Meaning                              | Safe to retry?                            |
| ------------ | ------------------------------------------------------ | ------------------------------------ | ----------------------------------------- |
| `undefined`  | `A record with the same information already exists`    | Duplicate `externalId` (same org)    | **No** — already created; look it up      |
| `"400"`      | `quoteId has already been used`                        | Quote reuse (RAMP/FX/TRADE)          | **No** — reconcile with existing txn      |
| `"400"`      | `Invalid or expired quoteId`                           | Quote expired                        | Yes — re-quote                            |
| `"400"`      | `source id is required for transfer`                   | Bad/missing source                   | Yes — fix payload                         |
| `"400"`      | `Contact is required` / `<field> is required`          | Missing required field               | Yes — fix payload                         |
| `"400"` (`TxnKnownError`) | `Trade on <exchange> failed` / `Withdrawal from <exchange> failed…` | Exchange/provider rejected _after_ the row was created (SWAP/RAMP/FX/CONTRACT_CALL) | **Caution** — a row may exist and funds may have moved; reconcile |

> **Note:** Permission failures are `403` (`ForbiddenError`), not `400`.

## Retry & double-payment guidance

- **Safe to retry (same payload):** any `400` raised during validation (balance, invalid
  destination, chain not enabled, invalid parameters, policy block). Nothing was created.
- **Do not blindly retry:**
  - **Timeouts / `5xx`** — the request may have succeeded. Reconcile first.
  - **Duplicate `externalId`** (`A record with the same information already exists`) — the payment
    already exists; fetch it, don't resend.
  - **`quoteId has already been used`** — reconcile against the existing transaction.

### Use a stable `externalId` per logical payment

`externalId` has a uniqueness constraint per org, so a duplicate is **rejected** instead of creating
a second payment. It is dedup-by-rejection, **not** idempotent replay — the API returns a `400`, it
does not return the original transaction, so you must look it up.

```ts
async function createPaymentIdempotently(apiClient, request) {
  try {
    return await apiClient.createTransferTransaction(request); // request.externalId is a stable UUID
  } catch (error) {
    // Ambiguous outcome (timeout, 5xx) or duplicate externalId → reconcile, don't blindly resend.
    const existing = await apiClient.getTransactions({ externalId: request.externalId });
    if (existing.results.length > 0) {
      return existing.results[0]; // Already created — reuse it.
    }
    throw error; // Genuinely not created — safe to retry with the SAME externalId.
  }
}
```

Codes are only emitted on the external API (the `api_user` / SDK path).
