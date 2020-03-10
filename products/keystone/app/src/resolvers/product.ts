import {
  Operation,
  MergeInfo,
  ExtractField,
  Transform,
  Request,
  RenameTypes,
  WrapQuery
} from "apollo-server";
import { GraphQLSchema, GraphQLResolveInfo, SelectionNode, FieldNode, Kind } from "graphql";

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
      fieldName: "Product",
      info,
      operation: info.operation.operation,
      transforms: [
        new WrapQuery(
          ['Product'],
          (subtree) => {
            const seperatedPrice = subtree.selections.reduce((
                acc: [SelectionNode[], FieldNode | undefined],
                cur: SelectionNode
              ) => {
                if (cur.kind !== Kind.FIELD || cur.name.value != 'price') {
                  acc[0].push(cur)
                } else {
                  acc[1] = cur
                }
                return acc
            }, [[], undefined])

             const selections = seperatedPrice[0].concat(
               seperatedPrice[1]?.selectionSet?.selections
                .filter(node => node.kind !== Kind.FIELD || node.name.value !== '__typename')
                .map((node): SelectionNode => {
                  if (node.kind !== Kind.FIELD || node.name.value !== 'value') {
                    return node
                  } else {
                    return {
                      kind: node.kind,
                      name: {
                        kind: node.name.kind,
                        value: 'price',
                        loc: node.loc
                      }
                    }
                  }
                }) ?? [])

            return {
              kind: Kind.SELECTION_SET,
              selections
            }
          },
          (result) => {
            if (!result) { return null }
            else {
              const { price, currency, ...rest} = result
              return {
                ...rest,
                price: {
                  value: price,
                  currency
                } 
              }
            }
          }
        )
      ]
    });
  }
}