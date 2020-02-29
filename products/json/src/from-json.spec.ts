import { transform } from "@/from-json";

test("from-json converts list correctly", () => {
  expect(
    transform(
      /* eslint-disable @typescript-eslint/camelcase */
      [
        {
          id: "0",
          name: "my-product",
          image_url: null,
          price: {
            value: 100,
            currency: "gbp"
          }
        },
        {
          id: "1",
          name: "my-product-1",
          image_url: "url",
          price: {
            value: 101,
            currency: "gbp"
          }
        }
      ]
      /* eslint-enable @typescript-eslint/camelcase */
    )
  ).toEqual([
    {
      id: "0",
      name: "my-product",
      imageUrl: null,
      price: {
        value: 100,
        currency: "gbp"
      }
    },
    {
      id: "1",
      name: "my-product-1",
      imageUrl: "url",
      price: {
        value: 101,
        currency: "gbp"
      }
    }
  ]);
});
