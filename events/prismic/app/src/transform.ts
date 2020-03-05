import { Kind, SelectionSetNode, SelectionNode } from "graphql";
import { PrismicEvent, Event } from ".";

export function transformEventsToPrismic(
  selectionSet: SelectionSetNode
): SelectionSetNode {
  const selections = selectionSet.selections.map(
    (selection): SelectionNode => {
      if (selection.kind === Kind.FIELD && selection.name.value === "ical") {
        return {
          kind: selection.kind,
          name: selection.name,
          selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: [
              {
                kind: Kind.FIELD,
                name: {
                  kind: Kind.NAME,
                  value: "__typename"
                }
              },
              {
                kind: Kind.INLINE_FRAGMENT,
                typeCondition: {
                  kind: Kind.NAMED_TYPE,
                  name: {
                    kind: Kind.NAME,
                    value: "_ExternalLink"
                  }
                },
                selectionSet: {
                  kind: Kind.SELECTION_SET,
                  selections: [
                    {
                      kind: Kind.FIELD,
                      name: {
                        kind: Kind.NAME,
                        value: "url"
                      }
                    }
                  ]
                }
              }
            ]
          }
        };
      } else if (
        selection.kind === Kind.FIELD &&
        selection.name.value === "id"
      ) {
        return {
          kind: selection.kind,
          name: {
            kind: Kind.NAME,
            value: "_meta"
          },
          selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: [
              {
                kind: Kind.FIELD,
                name: {
                  kind: Kind.NAME,
                  value: "uid"
                }
              }
            ]
          }
        };
      } else {
        return selection;
      }
    }
  );

  return {
    kind: Kind.SELECTION_SET,
    selections
  };
}

export function transformEventsFromPrismic(prismicEvent: PrismicEvent): Event {
  const withoutArrays = Object.fromEntries(
    Object.entries(prismicEvent).map(nodeField => {
      if (Array.isArray(nodeField[1])) {
        return [nodeField[0], nodeField[1][0].text];
      } else {
        return nodeField;
      }
    })
  );

  const { ical, _meta, ...rest }: PrismicEvent = withoutArrays as PrismicEvent;

  return {
    id: _meta?.uid,
    ical: ical?.url,
    ...rest
  };
}
