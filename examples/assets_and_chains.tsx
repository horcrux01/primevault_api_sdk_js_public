import {APIClient, Asset, ChainData} from "../src";

const getSupportedChains = async (apiClient: APIClient) => {
    const chains: ChainData[] = await apiClient.getSupportedChains()
    console.log(chains)
}

const getAssetsData = async (apiClient: APIClient) => {
    const assets: Asset[] = await apiClient.getAssetsData()
    console.log(assets)
}
