import allProducts from "./allProducts";
import fetch from "node-fetch";
import { IzettleProduct } from "../izettle-product";

jest.mock("node-fetch", () => {
  return jest.fn();
});

describe("allProducts", () => {
  it("omits products without price", async () => {
    ((fetch as unknown) as jest.Mock).mockImplementation(() => {
      return {
        ok: true,
        async json() {
          return [
            {
              name: "1",
              presentation: null,
              uuid: "1",
              variants: [
                {
                  price: {
                    amount: 100,
                    currencyId: "gbp"
                  }
                }
              ]
            },
            {
              name: "2",
              presentation: null,
              uuid: "2",
              variants: [
                {
                  price: null
                }
              ]
            }
          ] as IzettleProduct[];
        }
      };
    });
    expect(
      await allProducts(
        null,
        {},
        ({ token: "token" } as unknown) as Request & { token: string },
        null
      )
    ).toEqual([
      {
        id: "1",
        imageUrl: null,
        name: "1",
        price: {
          currency: "gbp",
          value: 100
        }
      }
    ]);
  });
});
