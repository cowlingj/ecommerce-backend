import { SchemaDirectiveVisitor } from 'graphql-tools'
import isSubset from 'is-subset'
import { defaultFieldResolver } from 'graphql'

export class FilterDirectiveVisitor extends SchemaDirectiveVisitor {

  visitFieldDefinition(field: any, _details: any) {
    super.visitFieldDefinition

    /* istanbul ignore next */
    const { resolve = defaultFieldResolver } = field

    const likeKey: string = this.args.likeKey

    field.resolve = async function (obj, variables, ...rest) {

      let result = await resolve.apply(this, obj, variables, ...rest)
      if (result === undefined) {
        result = obj[field.name]
      }
      if (!Array.isArray(result)) {
        throw new TypeError("directive can only be applied List types")
      }

      const like = variables[likeKey]
      if (like == null) {
        return result
      }

      if (Array.isArray(like)) {
        return result.filter(resultItem => like.some(likeItem => isSubset(resultItem, likeItem)))
      } else {
        return result.filter(resultItem => isSubset(resultItem, like))
      }
    }
  }
}
