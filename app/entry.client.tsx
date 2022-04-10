import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import { hydrate } from "react-dom";
import { I18nextProvider, initReactI18next } from "react-i18next";

import { initOptions } from "~/i18n.config";

i18next
  .use(initReactI18next)
  .init(initOptions) // use common configuration so client-side and server-side are the same.
  .then(() => {
    return hydrate(
      <I18nextProvider i18n={i18next}>
        <RemixBrowser />
      </I18nextProvider>,
      document
    );
  });
