import fetch from "node-fetch";
import transform from '@/resolvers/transform'
import { Product, IzettleProduct } from '@/index'

export async function resolver(
  _parent: unknown,
  args: { id: string },
  context: Request & { token: string },
  _info: any
): Promise<Product | null> {

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

  return transform(await res.json() as IzettleProduct)
}
