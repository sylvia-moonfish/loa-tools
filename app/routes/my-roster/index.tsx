import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Button from "~/components/button";
import { prisma } from "~/db.server";
import i18next from "~/i18next.server";
import { requireUser } from "~/session.server";
import { generateJobIconPath } from "~/utils";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

type LoaderData = {
  characters: Awaited<ReturnType<typeof getCharactersFromUser>>;
  title: string;
};

const getCharactersFromUser = async (
  user: Awaited<ReturnType<typeof requireUser>>
) => {
  return await prisma.character.findMany({
    select: {
      id: true,
      name: true,
      job: true,
      itemLevel: true,
      roster: {
        select: { id: true, server: { select: { id: true, name: true } } },
      },
    },
    where: { roster: { userId: user.id } },
    orderBy: [
      { roster: { server: { name: "asc" } } },
      { isPrimary: "desc" },
      { itemLevel: "desc" },
    ],
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18next.getFixedT(request, "root");
  const user = await requireUser(request);

  return json<LoaderData>({
    characters: await getCharactersFromUser(user),
    title: `${t("myRosterTitle")} | ${t("shortTitle")}`,
  });
};

export default function MyRosterIndexPage() {
  const data = useLoaderData<LoaderData>();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-[1.25rem]">
      <div className="flex">
        <div className="flex flex-grow"></div>
        <Link to="/character/add">
          <Button
            style={{
              additionalClass: "",
              backgroundColorClass: "bg-loa-button",
              cornerRadius: "0.9375rem",
              fontSize: "1rem",
              fontWeight: "500",
              lineHeight: "1.25rem",
              px: "0.9375rem",
              py: "0.9375rem",
              textColorClass: "text-loa-white",
            }}
            text={t("addCharacter", { ns: "routes\\my-roster" })}
          />
        </Link>
      </div>
      {data.characters.map((character, index) => {
        const iconPath = generateJobIconPath(character.job);

        return (
          <Link
            className="flex w-full items-center justify-center gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]"
            key={index}
            to={`/character/${character.id}`}
          >
            <div
              className="h-[3.125rem] w-[3.125rem] bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${iconPath}')` }}
            ></div>
            <div className="flex flex-grow flex-col gap-[0.3125rem]">
              <div className="text-[1.5rem] font-[500] leading-[1.25rem]">
                {character.name}
              </div>
              <div className="text-[1rem] font-[400] leading-[1.25rem]">{`${t(
                character.job,
                { ns: "dictionary\\job" }
              )} / ${character.roster.server.name}`}</div>
            </div>
            <div className="text-[1.5rem] font-[500] leading-[1.25rem]">{`LV. ${character.itemLevel.toFixed(
              2
            )}`}</div>
          </Link>
        );
      })}
    </div>
  );
}
