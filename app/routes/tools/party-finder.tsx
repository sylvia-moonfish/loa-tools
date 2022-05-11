import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { RootContext } from "~/root";
import { json } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import * as React from "react";
import { i18n } from "~/i18n.server";
import { requireUser } from "~/session.server";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

export const handle = {
  i18n: ["root"],
};

type LoaderData = {
  title: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18n.getFixedT(request, "root");
  const user = await requireUser(request);

  return json<LoaderData>({
    title: `${t("partyFinderPageTitle")} | ${t("shortTitle")}`,
  });
};

export default function ToolsPartyFinderPage() {
  const { setPathname } = useOutletContext<RootContext>();

  React.useEffect(() => {
    setPathname("/tools/party-finder");
  });

  return <div className="mx-auto w-[76.25rem]"></div>;
}
