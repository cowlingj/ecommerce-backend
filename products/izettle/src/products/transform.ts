import { IzettleProduct } from '@/products/izettle-product'
import { Product } from '@/products/product'

export default function (izettleProduct: IzettleProduct): Product {
  let imageUrl: string | null

  if (!izettleProduct.presentation) {
    imageUrl = null
  } else {
    imageUrl = izettleProduct.presentation.imageUrl
  }

  return {
    id: izettleProduct.uuid,
    name: izettleProduct.name,
    imageUrl: imageUrl
  }
}
