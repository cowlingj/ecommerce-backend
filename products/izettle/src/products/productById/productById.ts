import fetch from "node-fetch";

type Product = {
  id: string;
  name: string;
}

export default async function(
  _parent: unknown,
  args: { id: string },
  context: Request & { token: string },
  _info: any
): Promise<Product> {

  const token = context.token

  const res = await fetch(
    `${process.env.IZETTLE_PRODUCTS_URI}/organizations/self/products/${args.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!res.ok) {
    throw new Error(`get all products failed (status: ${res.status})`);
  }

  const izettleProduct = await res.json()

  return {
    id: izettleProduct.uuid,
    name: izettleProduct.name
  }
}
