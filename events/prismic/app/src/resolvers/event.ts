import {
  Operation,
  WrapQuery,
  MergeInfo
} from "apollo-server";
import { GraphQLSchema, SelectionSetNode, GraphQLResolveInfo } from "graphql";

import {transformEventsFromPrismic, transformEventsToPrismic} from '../transform'

export function resolver (schema: GraphQLSchema, queryName: string):
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
        uid: args.id,
        lang: "en-gb"
      },
      fieldName: queryName,
      info,
      operation:
        (info.operation.name?.value as Operation | undefined) ??
        "query",
      transforms: [
        new WrapQuery(
          [queryName],
          (subtree: SelectionSetNode) => {
            return transformEventsToPrismic(subtree);
          },
          (result: any) => {
            return transformEventsFromPrismic(result);
          }
        )
      ]
    });
  }
}