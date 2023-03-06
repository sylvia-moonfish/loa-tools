import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { LocaleType } from "~/i18n";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import ExpandablePanel from "~/components/my-roster/applied-posts/expandable-panel";
import Button from "~/components/button";
import { prisma } from "~/db.server";
import i18next from "~/i18next.server";
import { requireUser } from "~/session.server";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

type LoaderData = {
  appliedPosts: Awaited<ReturnType<typeof getPostsByUserId>>;
  locale: LocaleType;
  title: string;
  user: NonNullable<Awaited<ReturnType<typeof getUser>>>;
};

type AppliedPosts = Awaited<ReturnType<typeof getPostsByUserId>>;

const getPostsByUserId = async (id: string) => {
  return await prisma.partyFindPost.findMany({
    orderBy: { startTime: "asc" },
    where: {
      authorId: {
        not: id,
      },
      applyStates: { some: { character: { roster: { userId: id } } } },
    },
    select: {
      id: true,
      contentType: true,
      startTime: true,
      recurring: true,
      contentStage: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          contentTab: {
            select: {
              id: true,
              nameEn: true,
              nameKo: true,
              difficultyNameEn: true,
              difficultyNameKo: true,
              content: { select: { id: true, nameEn: true, nameKo: true } },
            },
          },
        },
      },
      applyStates: {
        select: {
          id: true,
          state: true,
          character: {
            select: {
              id: true,
              name: true,
              job: true,
              roster: {
                select: { id: true, userId: true },
              },
            },
          },
        },
      },
    },
  });
};

const getUser = async (id: string) => {
  return await prisma.user.findFirst({
    where: { id },
    select: { id: true },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18next.getFixedT(request, "root");
  const _user = await requireUser(request);
  const user = await getUser(_user.id);
  if (!user) return redirect("/");

  return json({
    appliedPosts: await getPostsByUserId(user.id),
    locale: (await i18next.getLocale(request)) as LocaleType,
    title: `${t("appliedPostsTitle")} | ${t("shortTitle")}`,
    user,
  });
};

export default function MyRosterAppliedPostsPage() {
  const data = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-[46.875rem] flex-col gap-[3.125rem]">
      <div className="flex flex-col gap-[1.25rem]">
        <div className="flex items-center justify-between">
          <div className="text-[1.25rem] font-[400] leading-[1.25rem]">
            {t("applying", { ns: "routes\\my-roster\\my-parties" })}
          </div>
          <Link to="/tools/party-finder">
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
              text={t("lookForOtherParty", {
                ns: "routes\\my-roster\\my-parties",
              })}
            />
          </Link>
        </div>
        <div className="flex flex-col gap-[1.25rem]">
          {(data.appliedPosts as AppliedPosts).map((p, index) => {
            const applyState = p.applyStates.find(
              (a) => a.character.roster.userId === data.user.id
            );

            if (applyState) {
              return (
                <ExpandablePanel
                  applyState={applyState}
                  key={index}
                  locale={data.locale}
                  partyFindPost={p}
                />
              );
            } else {
              return <div key={index}></div>;
            }
          })}
        </div>
      </div>
    </div>
  );
}
