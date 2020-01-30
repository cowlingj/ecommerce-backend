import filterTypeDefinitions from './filter/filter.gql'
import sortTypeDefinitions from './sort/sort.gql'
import { FilterDirectiveVisitor as FilterDirective } from './filter/filter'
import { SortDirectiveVisitor as SortDirective} from './sort/sort'

export const typeDefs = [filterTypeDefinitions, sortTypeDefinitions]

export {
  FilterDirective,
  SortDirective
}
