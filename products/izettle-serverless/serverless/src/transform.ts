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

  const value = izettleProduct.variants[0].price.currencyId === 'GBP'
    ? izettleProduct.variants[0].price.amount / 100
    : izettleProduct.variants[0].price.amount 

  return {
    id: izettleProduct.uuid,
    name: izettleProduct.name,
    imageUrl: imageUrl,
    price: {
      value,
      currency: izettleProduct.variants[0].price.currencyId
    }
  }
}
