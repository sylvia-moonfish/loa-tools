import { FileSystemBackend, RemixI18Next } from "remix-i18next";

import { initOptions } from "~/i18n.config";

// server-side filesystem backend configuration.
export let i18n = new RemixI18Next(new FileSystemBackend(`public/locales`), {
  fallbackLng: initOptions.fallbackLng as string,
  supportedLanguages: initOptions.supportedLngs as string[],
});
