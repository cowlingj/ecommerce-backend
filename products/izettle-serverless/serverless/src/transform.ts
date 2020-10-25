import { IzettleProduct, Product } from './index'

export default function (izettleProduct: IzettleProduct): Product | null {
  let imageUrl: string | null

  if (!izettleProduct.presentation) {
    imageUrl = null
  } else {
    imageUrl = izettleProduct.presentation.imageUrl
  }

  if (!izettleProduct.variants[0].price) {
    return null
  }

  return {
    id: izettleProduct.uuid,
    name: izettleProduct.name,
    imageUrl: imageUrl,
    price: {
      value: izettleProduct.variants[0].price.amount,
      currency: izettleProduct.variants[0].price.currencyId
    }
  }
}
