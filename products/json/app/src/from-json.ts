import { JSONProduct, Product } from ".";

export function transform(products: JSONProduct[]): Product[] {
  return products.map(product => {
    /* eslint-disable @typescript-eslint/camelcase */
    const { image_url, ...productPrototype } = product;
    /* eslint-ebable @typescript-eslint/camelcase */
    return Object.assign({}, productPrototype, { imageUrl: image_url });
  });
}
