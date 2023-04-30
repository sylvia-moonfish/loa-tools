import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";
import i18next from "~/i18next.server";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

export const handle = {
  i18n: [],
};

type LoaderData = {
  title: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18next.getFixedT(request, "root");

  return json<LoaderData>({
    title: `${t("charactersPageTitle")} | ${t("shortTitle")}`,
  });
};

export default function CharactersPage() {
  return (
    <div className="flex flex-grow flex-col pt-8">
      <Outlet context={useOutletContext()} />
    </div>
  );
}
