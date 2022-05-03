import { getLanguageTextFromLocale } from "~/utils";

test("getLanguageTextFromLocale", () => {
  expect(getLanguageTextFromLocale("en")).toBe("English");
});
