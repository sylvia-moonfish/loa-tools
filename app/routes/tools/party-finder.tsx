import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import i18next from "~/i18next.server";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

type LoaderData = { title: string };

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18next.getFixedT(request, "root");

  return json<LoaderData>({
    title: `${t("partyFinderPageTitle")} | ${t("shortTitle")}`,
  });
};

export default function ToolsPartyFinderPage() {
  return <Outlet />;
}
