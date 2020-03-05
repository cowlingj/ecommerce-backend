
## Prismic Setup

1. Create a repository
2. Create a new custom type with app id of ${PRISMIC_EVENT_TYPE}
  - In the json tab paste `prismic-event.json` (this sets up the event with the correct variables)

## Environment

| Name | Desciption |
|---|---|
| PORT | port to bind to |
| HOST | ip address to bind to |
| PRISMIC_REFS_URI | URI for the refs (versioning) endpoint |
| PRISMIC_GRAPHQL_URI | URI for the prismic graphql endpoint |
| PRISMIC_ACCESS_TOKEN | Perminant access token setup in prismic |
| PRISMIC_EVENT_QUERY | name of the single event query according to prismic |
| PRISMIC_EVENTS_QUERY | name of the all events query according to prismic |
