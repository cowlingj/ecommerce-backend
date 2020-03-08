import * as adapter from '@keystonejs/adapter-mongoose'

declare module '@keystonejs/adapter-mongoose' {
    class MongooseAdapter extends adapter.MoogooseAdapter {}
}