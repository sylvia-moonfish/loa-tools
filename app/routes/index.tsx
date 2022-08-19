import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useTranslation } from "react-i18next";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return {
    title: data.title,
  };
};

export const handle = {
  i18n: [],
};

type LoaderData = {
  title: string;
};

export const loader: LoaderFunction = async () => {
  return redirect("/tools/party-finder");
};

export default function Index() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8">
      <h1 className="text-indigo-500 text-9xl font-bold">
        {t("longTitle", { ns: "root" })}
      </h1>
      <div>뉴욕 최고 디자이너가 디자인한 사이트.</div>
    </div>
  );
}
