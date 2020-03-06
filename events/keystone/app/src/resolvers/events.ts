import {
  Operation,
  WrapQuery,
  MergeInfo
} from "apollo-server";
import { GraphQLSchema, Kind, SelectionSetNode, GraphQLResolveInfo } from "graphql";

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
      args,
      fieldName: "allEvents",
      info,
      operation:
        (info.operation.name?.value as Operation | undefined) ??
        "query"
    });
  }
}

