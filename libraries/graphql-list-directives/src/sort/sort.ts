import { SchemaDirectiveVisitor } from "graphql-tools"
import { defaultFieldResolver } from "graphql"

export class SortDirectiveVisitor extends SchemaDirectiveVisitor {

  private walk(target: unknown, path: string | string[], position: number = 0) {
    if (position >= path.length || target == null) {
      return target
    }

    if (typeof path === 'string') {
      return target[path]
    }

    return this.walk(target[path[position]], path, position + 1)
  }

  visitFieldDefinition(field: any, _details: any) {
    super.visitFieldDefinition

    /* istanbul ignore next */
    const { resolve = defaultFieldResolver } = field

    const pathKey: string = this.args.pathKey

    const visitor = this

    field.resolve = async function (obj, variables, ...rest) {

      let result: any[] = await resolve.apply(this, obj, variables, ...rest)
      if (result === undefined) {
        result = obj[field.name]
      }
      if (!Array.isArray(result)) {
        throw new TypeError("directive can only be applied List types")
      }

      const path = variables[pathKey]
      if (path == null) {
        return result
      }

      const partitioned = result
        .slice()
        .reduce((acc, cur) => {
          if(visitor.walk(cur, path) != null) {
            acc[0].push(cur)
          } else {
            acc[1].push(cur)
          }
          return acc
        }, [[],[]])

      partitioned[0].sort((a, b) => {
        let aTest = visitor.walk(a, path)
        let bTest = visitor.walk(b, path)

        if (bTest < aTest) {
          return 1
        } else if (aTest < bTest) {
          return -1
        }
        return 0
      })

      return partitioned.flat()
    }
  }
}
