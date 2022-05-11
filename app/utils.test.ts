import { generateRandomString } from "~/utils.server";

test("generateRandomString", () => {
  expect(typeof generateRandomString(1)).toBe("string");
});
