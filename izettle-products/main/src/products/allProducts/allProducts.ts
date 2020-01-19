import fetch from "node-fetch";

type Product = {
  id: string;
  name: string;
}

export default async function(
  _parent: unknown,
  _args: {},
  context: Request & { token: string },
  _info: any
): Promise<Product[]> {

  const token = context.token

  const res = await fetch(
    `${process.env.IZETTLE_PRODUCTS_URI}/organizations/self/products/v2/`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!res.ok) {
    throw new Error(`get all products failed (status: ${res.status})`);
  }
  return (await res.json()).map(
    (izettleProduct: { uuid: string; name: string }) => {
      return {
        id: izettleProduct.uuid,
        name: izettleProduct.name
      };
    }
  );
}
