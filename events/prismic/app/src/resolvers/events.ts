import {
  Operation,
  WrapQuery,
  MergeInfo
} from "apollo-server";
import { GraphQLSchema, Kind, SelectionSetNode, GraphQLResolveInfo } from "graphql";

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
      args,
      fieldName: queryName,
      info,
      operation:
        (info.operation.name?.value as Operation | undefined) ??
        "query",
      transforms: [
        new WrapQuery(
          [queryName],
          (subtree: SelectionSetNode) => {
            return {
              kind: Kind.FIELD,
              name: {
                kind: Kind.NAME,
                value: "edges"
              },
              selectionSet: {
                kind: Kind.SELECTION_SET,
                selections: [
                  {
                    kind: Kind.FIELD,
                    name: {
                      kind: Kind.NAME,
                      value: "node"
                    },
                    selectionSet: transformEventsToPrismic(subtree)
                  }
                ]
              }
            };
          },
          (result: any) => {
            return result.edges.map((edge: any) => {
              return transformEventsFromPrismic(edge.node);
            });
          }
        )
      ]
    });
  }
}

