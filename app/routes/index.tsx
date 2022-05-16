import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { RootContext } from "~/root";
import { json, redirect } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { i18n } from "~/i18n.server";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return {
    title: data.title,
  };
};

export const handle = {
  i18n: ["root"],
};

type LoaderData = {
  title: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/tools/party-finder");

  const t = await i18n.getFixedT(request, "root");

  return json<LoaderData>({
    title: t("longTitle"),
  });
};

export default function Index() {
  const { setPathname } = useOutletContext<RootContext>();
  const { t } = useTranslation();

  React.useEffect(() => {
    setPathname("/");
  });

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8">
      <h1 className="text-indigo-500 text-9xl font-bold">
        {t("longTitle", { ns: "root" })}
      </h1>
      <div>뉴욕 최고 디자이너가 디자인한 사이트.</div>
    </div>
  );
}
