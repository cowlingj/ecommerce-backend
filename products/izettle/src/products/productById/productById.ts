import fetch from "node-fetch";
import transform from '@/products/transform'
import { Product } from "../product";

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

  return transform(await res.json())
}
