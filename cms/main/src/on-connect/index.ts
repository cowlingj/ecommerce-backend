import addInitialUsers from "./add-initial-users";
import { Keystone } from "@keystonejs/keystone";
import addInitialStrings from "./add-initial-string-values";

export default function(keystone: Keystone) {
    addInitialUsers(keystone)
    addInitialStrings(keystone)
}
