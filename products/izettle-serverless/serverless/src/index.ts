import express from "express"
import { config } from "dotenv";
import auth from "./auth/auth"
import * as serverless from 'serverless-http';
import transform from './transform'
import fetch from 'node-fetch'

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
  } | null
}

export type Product = {
  id: string;
  name: string;
  imageUrl: string | null
  price: {
    value: number,
    currency: string
  }
}

config()

if (
  process.env.IZETTLE_AUTH_URI === undefined ||
  process.env.IZETTLE_PRODUCTS_URI === undefined ||
  process.env.IZETTLE_API_KEY === undefined
) {
  throw new Error("environment variables not set up");
}

const app = express()
app.use(auth({
  auth: {
    accessTokenUrl: process.env.IZETTLE_AUTH_URI,
    apiKey: process.env.IZETTLE_API_KEY
  },
  key: "token"
}))

app.get('/:id', async (req, res) => {
  const productsResult = await fetch(
    `${process.env.IZETTLE_PRODUCTS_URI}/organizations/self/products/${req.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${req.token}`
      }
    }
  );
  if (!productsResult.ok) {
    throw new Error(await productsResult.text());
  }
  const result = transform((await productsResult.json() as IzettleProduct))
  res.json(result)
})

app.get('/', async (req, res) => {
  const productsResult = await fetch(
    `${process.env.IZETTLE_PRODUCTS_URI}/organizations/self/products/v2/`,
    {
      headers: {
        Authorization: `Bearer ${req.token}`
      }
    }
  );
  if (!productsResult.ok) {
    throw new Error(await productsResult.text());
  }
  const result = (await productsResult.json() as IzettleProduct[])
    .map(transform)
    .filter((product) => product != null) as Product[];

  res.json(result)
})

export default serverless(app);
