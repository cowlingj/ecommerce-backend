import authMiddleware from './auth'
import fetch from 'node-fetch'
import { promisify } from 'util'

describe("auth middleware", () => {

  const defaultAuthOptions = {
    accessTokenUrl: "accessTokenUrl",
    refreshTokenUrl: "refreshTokenUrl",
    credentials: {
      username: "username",
      password: "password",
      clientId: "client_id",
      clientSecret: "client_secret"
    }
  }

  const defaultTokenRequest = [
    defaultAuthOptions.accessTokenUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: `client_id=${
        defaultAuthOptions.credentials.clientId
      }&client_secret=${
        defaultAuthOptions.credentials.clientSecret
      }&username=${
        defaultAuthOptions.credentials.username
      }&password=${
        defaultAuthOptions.credentials.password
      }&grant_type=password`
    }
  ]

  const defaultRefreshRequest = (refreshToken: string): any[] => ([
    defaultAuthOptions.refreshTokenUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: `client_id=${
        defaultAuthOptions.credentials.clientId
      }&client_secret=${
        defaultAuthOptions.credentials.clientSecret
      }&refresh_token=${
        refreshToken
      }&grant_type=refresh_token`
    }
  ])

  it("authenticates on first call", async () => {

    const accessToken = "accessToken"

    const mockDate = jest.spyOn(global.Date, 'now')

    const mockFetch = jest.fn() as typeof fetch & jest.Mock
    mockDate.mockReturnValueOnce(0)
    mockFetch.mockReturnValueOnce({
        json: () => ({
          access_token: accessToken,
          expires_in: 1001,
          refresh_token: null
        })
    })

    mockDate.mockReturnValueOnce(1_000_000)

    const key = 'token'
    const req: { [key]?: string } = {}

    const promiseAuth = promisify(authMiddleware({
      fetch: mockFetch,
      auth: defaultAuthOptions,
      key: 'token'
    }))

    await promiseAuth(req, {})
    expect(mockFetch.mock.calls).toEqual([
      defaultTokenRequest
    ])
    expect(req[key]).toBe(accessToken)
  })

  it("doesn't reauthenticate valid token", async () => {

    const accessToken = "accessToken"

    const mockDate = jest.spyOn(global.Date, 'now')

    const mockFetch = jest.fn() as typeof fetch & jest.Mock
    mockDate.mockReturnValueOnce(0)
    mockFetch.mockReturnValueOnce({
      json: () => ({
        access_token: accessToken,
        expires_in: 1001,
        refresh_token: null
      })
    })
    mockDate.mockReturnValueOnce(1_000_000)

    mockDate.mockReturnValueOnce(1_000_999)

    const key = 'token'
    const req: { [key]?: string } = {}

    const promiseAuth = promisify(authMiddleware({
      fetch: mockFetch,
      auth: defaultAuthOptions,
      key: 'token'
    }))

    await promiseAuth(req, {})
    expect(mockFetch.mock.calls).toEqual([
      defaultTokenRequest
    ])
    expect(req[key]).toBe(accessToken)

    mockFetch.mockClear()
    await promiseAuth({}, {})
    expect(mockFetch.mock.calls.length).toBe(0)
  })

  it("reauthenticates expired tokens", async () => {
    const accessToken1 = "accessToken1"
    const accessToken2 = "accessToken2"
    const refreshToken1 = "refreshToken1"

    const mockDate = jest.spyOn(global.Date, 'now')

    const mockFetch = jest.fn() as typeof fetch & jest.Mock
    mockDate.mockReturnValueOnce(0)
    mockFetch.mockReturnValueOnce({
        json: () => ({
          access_token: accessToken1,
          expires_in: 1000,
          refresh_token: refreshToken1
        })
    })

    mockDate.mockReturnValueOnce(1_000_000)
    mockFetch.mockReturnValueOnce({
        json: () => ({
          access_token: accessToken2,
          expires_in: 0,
          refreshToken2: null
        })
    })

    const key = 'token'
    const req: { [key]?: string } = {}

    await promisify(authMiddleware({
      fetch: mockFetch,
      auth: defaultAuthOptions,
      key
    }))(req, {})

    expect(mockFetch.mock.calls).toEqual([
      defaultTokenRequest,
      defaultRefreshRequest(refreshToken1)
    ])

    expect(req[key]).toBe(accessToken2)
  })

  it("reauthenticates expired token with new refresh token", async () => {
    const accessToken1 = "accessToken1"
    const accessToken2 = "accessToken2"
    const accessToken3 = "accessToken3"
    const refreshToken1 = "refreshToken1"
    const refreshToken2 = "refreshToken2"

    const mockDate = jest.spyOn(global.Date, 'now')

    const mockFetch = jest.fn() as typeof fetch & jest.Mock
    mockDate.mockReturnValueOnce(0)
    mockFetch.mockReturnValueOnce({
        json: () => ({
          access_token: accessToken1,
          expires_in: 1000,
          refresh_token: refreshToken1
        })
    })

    mockDate.mockReturnValueOnce(1_000_000)
    mockFetch.mockReturnValueOnce({
        json: () => ({
          access_token: accessToken2,
          expires_in: 1000,
          refresh_token: refreshToken2
        })
    })

    mockDate.mockReturnValueOnce(2_000_000)
    mockFetch.mockReturnValueOnce({
        json: () => ({
          access_token: accessToken3,
          expires_in: 0,
          refresh_token: null
        })
    })

    const key = 'token'
    const req1: { [key]?: string } = {}

    const promiseAuth = promisify(authMiddleware({
      fetch: mockFetch,
      auth: defaultAuthOptions,
      key
    }))

    await promiseAuth(req1, {})

    expect(mockFetch.mock.calls).toEqual([
      defaultTokenRequest,
      defaultRefreshRequest(refreshToken1)
    ])

    expect(req1[key]).toBe(accessToken2)

    mockFetch.mockClear()
    const req2: { [key]?: string } = {}

    await promiseAuth(req2, {})

    expect(mockFetch.mock.calls).toEqual([
      defaultRefreshRequest(refreshToken2)
    ])

    expect(req2[key]).toBe(accessToken3)
  })

  it("default request key \"token\"", async () => {

    const accessToken = "accessToken"

    const mockDate = jest.spyOn(global.Date, 'now')

    const mockFetch = jest.fn() as typeof fetch & jest.Mock
    mockDate.mockReturnValueOnce(0)
    mockFetch.mockReturnValueOnce({
        json: () => ({
          access_token: accessToken,
          expires_in: 1001,
          refresh_token: null
        })
    })

    mockDate.mockReturnValueOnce(1_000_000)

    const req: { token?: string } = {}

    const promiseAuth = promisify(authMiddleware({
      fetch: mockFetch,
      auth: defaultAuthOptions,
    }))

    await promiseAuth(req, {})
    expect(mockFetch.mock.calls).toEqual([
      defaultTokenRequest
    ])
    expect(req.token).toBe(accessToken)
  })

  it("default refreshTokenUrl to authTokenUrl", async () => {

    const accessToken1 = "accessToken1"
    const accessToken2 = "accessToken2"
    const refreshToken = "refreshToken1"

    const mockDate = jest.spyOn(global.Date, 'now')

    const mockFetch = jest.fn() as typeof fetch & jest.Mock
    mockDate.mockReturnValueOnce(0)
    mockFetch.mockReturnValueOnce({
        json: () => ({
          access_token: accessToken1,
          expires_in: 1000,
          refresh_token: refreshToken
        })
    })

    mockDate.mockReturnValueOnce(1_000_000)
    mockFetch.mockReturnValueOnce({
        json: () => ({
          access_token: accessToken2,
          expires_in: 0,
          refreshToken2: null
        })
    })

    const key = 'token'
    const req: { [key]?: string } = {}

    const url = "accessTokenUrl"

    await promisify(authMiddleware({
      fetch: mockFetch,
      auth: {
        accessTokenUrl: url,
        refreshTokenUrl: undefined,
        credentials: {
          username: "username",
          password: "password",
          clientId: "client_id",
          clientSecret: "client_secret"
        }
      },
      key
    }))(req, {})

    expect(mockFetch.mock.calls).toEqual([
      defaultTokenRequest,
      [
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
          },
          body: `client_id=${
            defaultAuthOptions.credentials.clientId
          }&client_secret=${
            defaultAuthOptions.credentials.clientSecret
          }&refresh_token=${
            refreshToken
          }&grant_type=refresh_token`
        }
      ]
    ])

    expect(req[key]).toBe(accessToken2)
  })
})
