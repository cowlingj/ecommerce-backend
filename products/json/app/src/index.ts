import { ApolloServer, mergeSchemas } from "apollo-server";
import { config } from "dotenv";
import { schema as productsSchema } from "@cowlingj/products-api";
import { buildClientSchema } from "graphql";
import { readFileSync } from "fs";
import { transform } from "./from-json";

config();

const products: Product[] = transform(
  JSON.parse(readFileSync(process.env.PRODUCTS_FILE as string, "utf-8"))
    .products as JSONProduct[]
);

export type Product = {
  id: string;
  name: string;
  imageUrl: string | null;
  price: {
    value: number;
    currency: string;
  };
};

export type JSONProduct = {
  id: string;
  name: string;
  image_url: string | null; // eslint-disable-line @typescript-eslint/camelcase
  price: {
    value: number;
    currency: string;
  };
};

const schema = mergeSchemas({
  schemas: [buildClientSchema(productsSchema)],
  resolvers: {
    Query: {
      products: (): Product[] => products,
      product: (_parent: unknown, { id }: { id: string }): Product | undefined =>
        products.filter((product: Product) => product.id === id)[0]
    }
  }
});

export const server = new ApolloServer({
  schema,
  playground: process.env.NODE_ENV === "development"
});

server
  .listen(process.env.PORT)
  .then(({ url }) => {
    console.log(`listening at ${url}`);
  })

