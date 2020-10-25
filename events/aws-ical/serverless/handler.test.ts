
const mockAwsSdk = {
  s3: jest.fn()
}
jest.mock('aws-sdk', () => mockAwsSdk)

describe('handler', () => {
    it('returns an empty list of events', async () => {
      process.env.BUCKET = 'test-bucket'
      const mockListObject = jest.fn()
      const mockGetObject = jest.fn()
      const mockGetObjectPromise = jest.fn()
      
      mockGetObjectPromise.mockResolvedValue({

      })
      mockGetObject.mockReturnValue({ promise: mockGetObjectPromise })
      mockAwsSdk.s3.mockReturnValue({
        listObjectsV2: mockListObject,
        getObject: mockGetObject
      })
      const { all } = require('./handler')
      await all(null, null, null)
    })
    it('returns a list of events', () => {})
    it('returns a 503 if the connection to the bucket fails', () => {})
})