import {
  Operation,
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
    args: { count?: number, order?: { field: string, reverse?: boolean } },
    context: any,
    info: GraphQLResolveInfo & { mergeInfo: MergeInfo }
  ): Promise<any> => {

    const { count, order, ...rest } = args
    const delegatedArgs = { ...rest }

    if (count) {
      Object.assign(delegatedArgs, {first: count})
    }

    const orderBy = order
      ? `${order?.field}_${order?.reverse ? 'ASC' : 'DESC'}`
      : null
    if (orderBy) {
      Object.assign(delegatedArgs, {orderBy})
    }

    return await info.mergeInfo.delegateToSchema({
      schema,
      context,
      args: delegatedArgs,
      fieldName: "allEvents",
      info,
      operation:
        (info.operation.name?.value as Operation | undefined) ??
        "query"
    });
  }
}

