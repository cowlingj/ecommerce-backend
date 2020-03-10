import {
  Operation,
  WrapQuery,
  MergeInfo
} from "apollo-server";
import { GraphQLSchema, GraphQLResolveInfo } from "graphql";

export function resolver (schema: GraphQLSchema):
  (
    parent: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo & { mergeInfo: MergeInfo }
  ) => Promise<any>
{
  return async (
    _parent: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo & { mergeInfo: MergeInfo }
  ): Promise<any> => {
    return await info.mergeInfo.delegateToSchema({
      schema,
      context,
      args: {
        where: { id: args.id },
      },
      fieldName: "Event",
      info,
      operation: info.operation.operation,
    });
  }
}