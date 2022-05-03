import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { hydrate } from "react-dom";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next";
import { initOptions } from "~/i18n.config";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    ...initOptions,
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["htmlTag"],
      caches: [],
    },
    ns: getInitialNamespaces(),
  })
  .then(() => {
    return hydrate(
      <I18nextProvider i18n={i18next}>
        <RemixBrowser />
      </I18nextProvider>,
      document
    );
  });
