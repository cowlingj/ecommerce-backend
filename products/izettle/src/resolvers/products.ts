import fetch from "node-fetch";
import transform from '@/resolvers/transform'
import { IzettleProduct, Product } from '@/index';

export async function resolver(
  _parent: unknown,
  _args: {},
  context: Request & { token: string },
  _info: any
): Promise<(Product)[]> {

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
  return (await res.json() as IzettleProduct[])
    .map(transform)
    .filter((product) => product != null) as Product[];
}
