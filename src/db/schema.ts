// Re-export all schema tables from the modular schema folder
import { user } from "./schema/user";
import { session } from "./schema/session";
import { account } from "./schema/account";
import { verification } from "./schema/verification";
import { guest } from "./schema/guest";
import { products } from "./schema/products";

export * from "./schema/index";
export { user, session, account, verification, guest, products };
