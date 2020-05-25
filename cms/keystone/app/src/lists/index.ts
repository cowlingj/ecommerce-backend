import setupUser from './user'
import setupEvents from './events'
import setupProducts from './products'
import setupStrings from './string-value'
import { Keystone } from '@keystonejs/keystone'

export default function(keystone: Keystone) {
    setupUser(keystone)
    if (!process.env.FLAG_DISABLE_EVENTS) { setupEvents(keystone) }
    if (!process.env.FLAG_DISABLE_RESOURCES) { setupStrings(keystone) }
    if (!process.env.FLAG_DISABLE_PRODUCTS) { setupProducts(keystone) }
}
