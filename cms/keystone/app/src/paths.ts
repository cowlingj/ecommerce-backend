import path from "path";

export const basePath = process.env.BASE_PATH ?? "";
export const apiPath = path.join(basePath, "/graphql");
export const graphiqlPath = path.join(basePath, "/playground");
export const adminPath = path.join(basePath, "/admin");
