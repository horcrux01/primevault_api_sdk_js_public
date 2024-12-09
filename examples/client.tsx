import {APIClient, Config} from "../src"; // import the APIClient and Config from the SDK @primevault/js-api-sdk

const createClientFromPrivateKey = () => {
    const apiKey = "509bc039-65b5-4200-ac56-4827acc5a1ee" // replace this with the API user's key
    const apiUrl = "https://app.primevault.com"

    const privateKey = "..."
    Config.set("SIGNATURE_SERVICE", "PRIVATE_KEY")

    return new APIClient(apiKey, apiUrl, privateKey)
}

const createClientFromAWSKMS = () => {
    const apiKey = "509bc039-65b5-4200-ac56-4827acc5a1ee" // replace this with the API user's key
    const apiUrl = "https://app.primevault.com"
    const keyId = '..'  // AWS KMS key Id from Key's detail page

    Config.set("SIGNATURE_SERVICE", "AWS_KMS")
    Config.set("AWS_REGION", "us-east-1")  // replace this with your region

    return new APIClient(apiKey, apiUrl, undefined, keyId)
}
