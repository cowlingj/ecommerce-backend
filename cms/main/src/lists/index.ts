import setupUser from './user'
import setupEvents from './events'
import { Keystone } from '@keystonejs/keystone'

export default function(keystone: Keystone) {
    setupUser(keystone)
    setupEvents(keystone)
}