import jwt from 'jsonwebtoken'
import form from 'form-urlencoded'
import fetch from 'node-fetch'

async function getToken(url: string, key: string) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: form({
      'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      'client_id': jwt.decode(key)['client_id'],
      'assertion': key
    })
  })
  if (!res.ok) {
    throw new Error(await res.text())
  }
  return (await res.json())['access_token']
}

function isExpired(token: string) {
  return Date.now() / 1000 <= parseInt(jwt.decode(token)['exp'])
}

export default function ({
      auth,
      key = "token"
  }: {
    auth: {
      accessTokenUrl: string
      apiKey: string
    }
    key?: string
}): (req: any, res: any, next: (err?: any) => void) => void {

  let token: string | undefined;

  return async (req, _res, next) => {
    if (!token || isExpired(token)) {
      token = await getToken(auth.accessTokenUrl, auth.apiKey)
    }

    req[key] = token

    next()
  }
}
