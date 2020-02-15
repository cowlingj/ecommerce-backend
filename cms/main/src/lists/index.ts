import setupUser from './user'
import setupEvents from './events'
import setupStrings from './string-value'
import { Keystone } from '@keystonejs/keystone'

export default function(keystone: Keystone) {
    setupUser(keystone)
    setupEvents(keystone)
    setupStrings(keystone)
}
