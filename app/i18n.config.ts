import type { InitOptions } from "i18next";

export const initOptions: InitOptions = {
  defaultNS: "common",
  fallbackLng: "en",
  react: {
    useSuspense: false,
  },
  supportedLngs: ["en", "ko"],
};
