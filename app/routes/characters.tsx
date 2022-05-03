import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";
import { i18n } from "~/i18n.server";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

export const handle = {
  i18n: ["common"],
};

type LoaderData = {
  title: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18n.getFixedT(request, "common");

  return json<LoaderData>({
    title: `${t("charactersPageTitle")} | ${t("shortTitle")}`,
  });
};

export default function CharactersPage() {
  return (
    <div className="flex flex-grow flex-col gap-8 pt-8">
      <Outlet context={useOutletContext()} />
    </div>
  );
}
