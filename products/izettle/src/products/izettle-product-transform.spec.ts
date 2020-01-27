import transform from "./transform"

describe("transform function", () => {
  it("correctly transforms a product with no null fields", () => {
    expect(
      transform({
        uuid: "id",
        name: "name",
        presentation: {
          imageUrl: "imageUrl"
        }
      })
    ).toEqual({
      id: "id",
      name: "name",
      imageUrl: "imageUrl"
    })
  })

  it("correctly transforms a product with null presentation", () => {
    expect(
      transform({
        uuid: "id",
        name: "name",
        presentation: null
      })
    ).toEqual({
      id: "id",
      name: "name",
      imageUrl: null
    })
  })
})
