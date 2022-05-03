import type { LoaderFunction } from "@remix-run/node";
import type { RootContext } from "~/root";
import { PlusIcon } from "@heroicons/react/solid";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { getCharacters } from "~/models/character.server";
import { requireUser } from "~/session.server";

export const handle = {
  i18n: ["common"],
};

type LoaderData = { characters: Awaited<ReturnType<typeof getCharacters>> };

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    characters: await getCharacters({
      userId: (await requireUser(request)).id,
    }),
  });
};

export default function CharactersIndexPage() {
  const { setPathname } = useOutletContext<RootContext>();
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();

  React.useEffect(() => {
    setPathname("/characters");
  });

  return (
    <>
      <div className="flex w-full justify-end">
        <Link
          className="flex items-center justify-center gap-2 rounded-md bg-indigo-700 py-2 px-4 transition hover:bg-indigo-600 active:bg-indigo-800"
          to="/characters/add"
        >
          <PlusIcon className="h-5 w-5" />
          <span>{t("addCharacter")}</span>
        </Link>
      </div>
      {data.characters.forEach((character, index) => {
        return <div key={index}>{JSON.stringify(character)}</div>;
      })}
    </>
  );
}
