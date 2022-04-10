import type { InitOptions } from "i18next";

// i18 common configuration.
export const initOptions: InitOptions = {
  defaultNS: "common",
  fallbackLng: "en",
  react: { useSuspense: false },
  supportedLngs: ["en", "ko"],
};
