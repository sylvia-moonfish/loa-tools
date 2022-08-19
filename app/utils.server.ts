import * as crypto from "crypto";

export function generateRandomString(byteLength: number) {
  return crypto.randomBytes(byteLength).toString("hex");
}
