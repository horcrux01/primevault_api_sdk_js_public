import {APIClient} from "./apiClient";


describe('APIClient', () => {
    const apiKey = process.env.API_KEY!;
    const apiUrl = process.env.API_URL!;
    const privateKey = process.env.ACCESS_PRIVATE_KEY!;
    const apiClient = new APIClient(apiKey, apiUrl, privateKey)

    test('getAssetsData', async () => {
        const assetsData = await apiClient.getAssetsData();
        expect(assetsData).toBeDefined()
        expect(assetsData).toBeInstanceOf(Array)
        expect(assetsData.length).toBe(64)
    })

    test('getVaults', async () => {
        const vaultsResponse = await apiClient.getVaults({'vaultName': 'core-vault-1'});
        const vaults = vaultsResponse.results;
        expect(vaults).toBeDefined()
        expect(vaults).toBeInstanceOf(Array)
        expect(vaults.length).toBe(1)
        expect(vaults[0].vaultName).toBe('core-vault-1')
        expect(vaults[0].wallets).toBeDefined()
        expect(vaults[0].wallets.length).toBe(8)
        expect(vaults[0].signers).toBeDefined()
        expect(vaults[0].signers.length).toBe(8)
        expect(vaults[0].viewers.length).toBe(0)

        const blockchains = vaults[0].wallets.map((wallet : any) => wallet.blockchain).sort();
        expect(blockchains).toEqual(["ETHEREUM", "POLYGON", "SOLANA", "NEAR", "APTOS", "ARBITRUM", "OPTIMISM", "MOONBEAM"].sort())
    })

    test('getBalances', async () => {
        let vaultsResponse = await apiClient.getVaults({'vaultName': 'core-vault-1'});
        // all balances are 0
        const balances = await apiClient.getBalances(vaultsResponse.results[0].id);
        expect(balances).toBeDefined()
        expect(balances).toBeInstanceOf(Object)
        expect(balances).toStrictEqual({})

        // non-zero balances
        vaultsResponse = await apiClient.getVaults({'vaultName': 'Ethereum Vault'});
        const balances2 = await apiClient.getBalances(vaultsResponse.results[0].id);
        expect(balances2).toBeDefined()
        expect(balances2).toBeInstanceOf(Object)
        expect(Object.keys(balances2).length).toBe(3)
        expect(balances2['ETH']).toBeDefined()
        expect(balances2['ETH']).toBeInstanceOf(Object)
        expect(Object.keys(balances2['ETH']).length).toBe(2)
        expect(balances2['ETH']).toStrictEqual({ ETHEREUM: 1, OPTIMISM: 2 })

        expect(balances2['MATIC']).toBeDefined()
        expect(balances2['MATIC']).toBeInstanceOf(Object)
        expect(Object.keys(balances2['MATIC']).length).toBe(1)
        expect(balances2['MATIC']).toStrictEqual({ POLYGON: 30.2322 })
    })

    test('getContacts', async () => {
        const contactResponse = await apiClient.getContacts({'name': 'Lynn Bell'});
        const contacts = contactResponse.results;
        expect(contacts).toBeDefined()
        expect(contacts).toBeInstanceOf(Array)
        expect(contacts.length).toBe(1)
        expect(contacts[0].name).toBe('Lynn Bell')
        expect(contacts[0].blockChain).toBe('SOLANA')
        expect(contacts[0].address).toBe('CEzN7mqP9xoxn2HdyW6fjEJ73t7qaX9Rp2zyS6hb3iEu')
        expect(contacts[0].status).toBe('APPROVED')
    })
})
