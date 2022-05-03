import * as crypto from "crypto";
export * as https from "https";

export function generateRandomString(byteLength: number) {
  return crypto.randomBytes(byteLength).toString("hex");
}
