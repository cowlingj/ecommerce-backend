import form from "form-urlencoded";
import nodeFetch from 'node-fetch'

export default function ({
      fetch,
      auth,
      key = "token"
  }: {
    fetch: typeof nodeFetch
    auth: {
      accessTokenUrl: string
      refreshTokenUrl?: string
      credentials: {
        username: string,
        password: string,
        clientId: string,
        clientSecret: string
      }
    }
    key?: string
}): (req: any, res: any, next: (err?: any) => void) => void {

  let token: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  } | undefined;

  return async (req, _res, next) => {
    if (!token) {
      const getTokenTime = Math.floor(Date.now() / 1000)
      const tokenResponse = await fetch(auth.accessTokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
        body: form({
          client_id: auth.credentials.clientId,
          client_secret: auth.credentials.clientSecret,
          username: auth.credentials.username,
          password: auth.credentials.password,
          grant_type: "password"
        })
      })

      const json =  await tokenResponse.json()

      token = {
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
        expiresAt: json.expires_in + getTokenTime
      }
    }

    const checkExpirytime = Math.floor(Date.now() / 1000)
    if (checkExpirytime >= token.expiresAt) {
      const url = auth.refreshTokenUrl ? auth.refreshTokenUrl : auth.accessTokenUrl;
      const refreshResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
        body: form({
          client_id: auth.credentials.clientId,
          client_secret: auth.credentials.clientSecret,
          refresh_token: token.refreshToken,
          grant_type: "refresh_token"
        })
      })

      const json = await refreshResponse.json()

      token = {
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
        expiresAt: json.expires_in + checkExpirytime
      }
    }

    req[key] = token.accessToken

    next()
  }
}


