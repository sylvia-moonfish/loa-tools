// Use this to create a new user and login with that user
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts username@example.com
// and it will log out the cookie value you can use to interact with the server
// as that new user.

import { installGlobals } from "@remix-run/node";
import { parse } from "cookie";

installGlobals();

async function createAndLogin(email: string) {}

createAndLogin(process.argv[2]);
