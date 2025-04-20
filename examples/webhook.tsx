/**
 * Sorts the keys of an object recursively. 
 * 
 * @param {any} obj The object (or value) to sort.
 * @returns {any} The object with keys sorted alphabetically, or the original value if not an object.
 */
function sortObjectKeysRecursively(obj: any) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }

  const sortedKeys = Object.keys(obj).sort();
  const sortedObj = {};

  for (const key of sortedKeys) {
    sortedObj[key] = sortObjectKeysRecursively(obj[key]); // Recurse for nested objects
  }

  return sortedObj;
}


/**
 * Validates the signature of an incoming webhook request (Node.js).
 *
 * @param {object} headers - An object containing the request headers (e.g., req.headers). 
 *                           Expected to contain 'x-signature' and 'x-timestamp' (case-insensitive).
 * @param {string} body - The raw request body as a string.
 * @param {string} verificationKey - The secret key used for signing the webhook.
 * @returns {boolean} True if the signature is valid, False otherwise.
 */
function validateWebhookSignature(headers: Record<string, string>, body: string, verificationKey: string) {
  try {
    const receivedSignature = headers['x-signature'];
    const receivedTimestampStr = headers['x-timestamp'];

    if (!receivedSignature || !receivedTimestampStr) {
      return false;
    }

    const receivedTimestamp = parseInt(receivedTimestampStr, 10); 
    if (isNaN(receivedTimestamp)) {
        console.error("Error: Invalid X-Timestamp header value");
        return false;
    }

    let message;
    try {
      let data = JSON.parse(body);
      const sortedObj = sortObjectKeysRecursively(data);
      message = JSON.stringify(sortedObj);
    } catch (e) {
      // If body is not JSON, use the raw body string directly
      if (e instanceof SyntaxError) {
          message = body;
      } else {
          throw e;
      }
    }
    
    const messageTimestampConcat = `${message}${receivedTimestamp}`;

    // Calculate the expected signature using Node.js crypto
    const keyBuffer = Buffer.from(verificationKey, 'utf-8');
    const expectedSignature = crypto
      .createHmac('sha256', keyBuffer)
      .update(messageTimestampConcat)
      .digest('hex');

    // Compare signatures securely using crypto.timingSafeEqual
    const receivedSigBuffer = Buffer.from(receivedSignature, 'hex');
    const expectedSigBuffer = Buffer.from(expectedSignature, 'hex');
    if (receivedSigBuffer.length !== expectedSigBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(receivedSigBuffer, expectedSigBuffer);

  } catch (error) {
    return false;
  }
}
