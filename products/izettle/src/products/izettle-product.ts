export type IzettleProduct = {
  uuid: string,
  name: string,
  presentation: { imageUrl: string | null } | null,
  variants: IzettleVariant[]
}

export type IzettleVariant = {
  price: {
    amount: number,
    currencyId: string
  }
}
