import transform from "./transform"

describe("transform function", () => {
  it("correctly transforms a product with no null fields", () => {
    expect(
      transform({
        uuid: "id",
        name: "name",
        presentation: {
          imageUrl: "imageUrl"
        },
        variants: [
          {
            price: {
              amount: 1000,
              currencyId: 'gbp'
            }
          },
          {
            price: {
              amount: 1,
              currencyId: 'gbp'
            }
          }
        ],
      })
    ).toEqual({
      id: "id",
      name: "name",
      imageUrl: "imageUrl",
      price: {
        value: 10,
        currency: 'gbp'
      }
    })
  })

  it("correctly transforms a product with null price", () => {
    expect(
      transform({
        uuid: "id",
        name: "name",
        presentation: {
          imageUrl: "imageUrl"
        },
        variants: [
          {
            price: null
          }
        ],
      })
    ).toEqual(null)
  })

  it("correctly transforms a product with null presentation", () => {
    expect(
      transform({
        uuid: "id",
        name: "name",
        presentation: null,
        variants: [
          {
            price: {
              amount: 0,
              currencyId: 'gbp'
            }
          }
        ],
      })
    ).toEqual({
      id: "id",
      name: "name",
      imageUrl: null,
      price: {
        value: 0,
        currency: 'gbp'
      }
    })
  })
})
