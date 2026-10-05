import { SubOrg, SubOrgControlMode } from "../src";
import { createMockClient } from "./helpers";

const subOrg: SubOrg = {
  id: "sub-org-id",
  orgId: "org-id",
  name: "Acme & Sons",
  controlMode: SubOrgControlMode.MANAGED,
  createdAt: "2026-09-14T10:00:00Z",
  updatedAt: "2026-09-14T10:00:00Z",
  isDeleted: false,
  version: 1,
};

describe("SubOrg APIs", () => {
  test("creates a managed SubOrg using only its name", async () => {
    const { client, post } = createMockClient();
    const request = { name: subOrg.name };
    post.mockResolvedValue(subOrg);

    const created = await client.createSubOrg(request);

    expect(post).toHaveBeenCalledWith("/api/external/sub_orgs/", {
      name: subOrg.name,
    });
    expect(created).toEqual(subOrg);
  });

  test("encodes filters and cursors and preserves nullable response fields", async () => {
    const { client, get } = createMockClient();
    get
      .mockResolvedValueOnce({
        results: [subOrg],
        nextCursor: "cursor+/=",
        hasNext: true,
      })
      .mockResolvedValueOnce({
        results: [
          { ...subOrg, id: "legacy-id", controlMode: null, version: null },
        ],
        nextCursor: null,
        hasNext: false,
      });

    const first = await client.getSubOrgs();
    const second = await client.getSubOrgs(
      { name: subOrg.name },
      1,
      first.nextCursor,
    );

    expect(get).toHaveBeenNthCalledWith(
      1,
      "/api/external/sub_orgs/?limit=20&cursor=",
    );
    expect(get).toHaveBeenNthCalledWith(
      2,
      "/api/external/sub_orgs/?limit=1&cursor=cursor%2B%2F%3D&name=Acme+%26+Sons",
    );
    expect(first.hasNext).toBe(true);
    expect(second.results[0].controlMode).toBeNull();
    expect(second.results[0].version).toBeNull();
    expect(second.nextCursor).toBeNull();
    expect(second.hasNext).toBe(false);
  });
});
