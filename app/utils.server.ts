import * as crypto from "crypto";
import { JSDOM } from "jsdom";

export function generateRandomString(byteLength: number) {
  return crypto.randomBytes(byteLength).toString("hex");
}

export function parseDOM(content: string) {
  return new JSDOM(content);
}
