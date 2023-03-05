import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { LocaleType } from "~/i18n";
import { PartyFindApplyStateValue } from "@prisma/client";
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
  abyssalDungeon: Awaited<ReturnType<typeof getAbyssalDungeon>>;
  abyssRaid: Awaited<ReturnType<typeof getAbyssRaid>>;
  appliedPosts: Awaited<ReturnType<typeof getPostsByUserId>>;
  chaosDungeon: Awaited<ReturnType<typeof getChaosDungeon>>;
  guardianRaid: Awaited<ReturnType<typeof getGuardianRaid>>;
  legionRaid: Awaited<ReturnType<typeof getLegionRaid>>;
  locale: LocaleType;
  title: string;
  user: NonNullable<Awaited<ReturnType<typeof getUser>>>;
};

const getAbyssalDungeon = async () => {
  return await prisma.abyssalDungeon.findFirst({
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      tabs: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          difficultyNameEn: true,
          difficultyNameKo: true,
          stages: { select: { id: true, nameEn: true, nameKo: true } },
        },
      },
    },
  });
};

const getAbyssRaid = async () => {
  return await prisma.abyssRaid.findFirst({
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      tabs: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          stages: { select: { id: true, nameEn: true, nameKo: true } },
        },
      },
    },
  });
};

const getChaosDungeon = async () => {
  return await prisma.chaosDungeon.findFirst({
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      tabs: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          stages: { select: { id: true, nameEn: true, nameKo: true } },
        },
      },
    },
  });
};

const getGuardianRaid = async () => {
  return await prisma.guardianRaid.findFirst({
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      tabs: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          stages: { select: { id: true, nameEn: true, nameKo: true } },
        },
      },
    },
  });
};

const getLegionRaid = async () => {
  return await prisma.legionRaid.findFirst({
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      tabs: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          difficultyNameEn: true,
          difficultyNameKo: true,
          stages: { select: { id: true, nameEn: true, nameKo: true } },
        },
      },
    },
  });
};

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

      chaosDungeon: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          chaosDungeonTab: {
            select: {
              id: true,
              nameEn: true,
              nameKo: true,
              chaosDungeon: {
                select: { id: true, nameEn: true, nameKo: true },
              },
            },
          },
        },
      },
      guardianRaid: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          guardianRaidTab: {
            select: {
              id: true,
              nameEn: true,
              nameKo: true,
              guardianRaid: {
                select: { id: true, nameEn: true, nameKo: true },
              },
            },
          },
        },
      },
      abyssalDungeon: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          abyssalDungeonTab: {
            select: {
              id: true,
              nameEn: true,
              nameKo: true,
              difficultyNameEn: true,
              difficultyNameKo: true,
              abyssalDungeon: {
                select: { id: true, nameEn: true, nameKo: true },
              },
            },
          },
        },
      },
      abyssRaid: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          abyssRaidTab: {
            select: {
              id: true,
              nameEn: true,
              nameKo: true,
              abyssRaid: {
                select: { id: true, nameEn: true, nameKo: true },
              },
            },
          },
        },
      },
      legionRaid: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          legionRaidTab: {
            select: {
              id: true,
              nameEn: true,
              nameKo: true,
              difficultyNameEn: true,
              difficultyNameKo: true,
              legionRaid: {
                select: { id: true, nameEn: true, nameKo: true },
              },
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

  return json<LoaderData>({
    abyssalDungeon: await getAbyssalDungeon(),
    abyssRaid: await getAbyssRaid(),
    appliedPosts: await getPostsByUserId(user.id),
    chaosDungeon: await getChaosDungeon(),
    guardianRaid: await getGuardianRaid(),
    legionRaid: await getLegionRaid(),
    locale: (await i18next.getLocale(request)) as LocaleType,
    title: `${t("appliedPostsTitle")} | ${t("shortTitle")}`,
    user,
  });
};

export default function MyRosterAppliedPostsPage() {
  const data = useLoaderData<LoaderData>();
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
          {data.appliedPosts.map((p, index) => {
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
