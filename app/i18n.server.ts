import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next";
import { initOptions } from "~/i18n.config";
import { sessionStorage } from "~/session.server";

export let i18n = new RemixI18Next({
  detection: {
    fallbackLanguage: initOptions.fallbackLng as string,
    sessionStorage: sessionStorage,
    supportedLanguages: initOptions.supportedLngs as string[],
  },
  i18next: {
    backend: {
      loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
    },
  },
  backend: Backend,
});
