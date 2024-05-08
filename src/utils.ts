import base64url from 'base64url'

export function pemToHex(pem: string) {
  const base64String = pem
    .replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '')
  const buffer = Buffer.from(base64String, 'base64')
  return buffer.toString('hex')
}

export function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key: string) => {
        result[key] = sortObjectKeys(obj[key as keyof typeof obj])
        return result
      }, {})
  }
  return obj
}

export function encodeBase64(data: string) {
  return base64url.encode(data)
}
