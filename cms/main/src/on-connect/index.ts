import addInitialUsers from "./add-initial-users";
import { Keystone } from "@keystonejs/keystone";

export default function(keystone: Keystone) {
    addInitialUsers(keystone)
}