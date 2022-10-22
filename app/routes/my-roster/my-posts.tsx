import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { ItemType } from "~/components/dropdown";
import type { LocaleType } from "~/i18n";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import ExpandablePanel from "~/components/my-roster/my-posts/expandable-panel";
import AddPartyButton from "~/components/tools/party-finder/add-party-button";
import { prisma } from "~/db.server";
import i18next from "~/i18next.server";
import { getSession, requireUser } from "~/session.server";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

type LoaderData = {
  accessToken: string;
  abyssalDungeon: Awaited<ReturnType<typeof getAbyssalDungeon>>;
  abyssRaid: Awaited<ReturnType<typeof getAbyssRaid>>;
  chaosDungeon: Awaited<ReturnType<typeof getChaosDungeon>>;
  guardianRaid: Awaited<ReturnType<typeof getGuardianRaid>>;
  legionRaid: Awaited<ReturnType<typeof getLegionRaid>>;
  locale: LocaleType;
  myPosts: Awaited<ReturnType<typeof getPostsByAuthorId>>;
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

const getPostsByAuthorId = async (id: string) => {
  return await prisma.partyFindPost.findMany({
    orderBy: { startTime: "asc" },
    where: { authorId: id },
    select: {
      id: true,
      state: true,
      isPracticeParty: true,
      isReclearParty: true,
      contentType: true,
      startTime: true,
      recurring: true,
      title: true,

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

      authorId: true,
      server: {
        select: { id: true, region: { select: { id: true, shortName: true } } },
      },

      partyFindSlots: {
        select: {
          id: true,
          index: true,
          jobType: true,
          partyFindApplyState: {
            select: {
              id: true,
              state: true,
              character: {
                select: {
                  id: true,
                  name: true,
                  job: true,
                  itemLevel: true,
                  roster: {
                    select: {
                      id: true,
                      user: {
                        select: {
                          id: true,
                          discordId: true,
                          discordUsername: true,
                          discordDiscriminator: true,
                        },
                      },
                      userId: true,
                    },
                  },
                  engravingSlots: {
                    select: {
                      id: true,
                      index: true,
                      level: true,
                      engraving: {
                        select: {
                          id: true,
                          nameEn: true,
                          nameKo: true,
                          iconPath: true,
                        },
                      },
                    },
                  },
                },
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
              itemLevel: true,
              roster: {
                select: {
                  id: true,
                  user: {
                    select: {
                      id: true,
                      discordId: true,
                      discordUsername: true,
                      discordDiscriminator: true,
                    },
                  },
                  userId: true,
                },
              },
              engravingSlots: {
                select: {
                  id: true,
                  index: true,
                  level: true,
                  engraving: {
                    select: {
                      id: true,
                      nameEn: true,
                      nameKo: true,
                      iconPath: true,
                    },
                  },
                },
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
    select: {
      id: true,
      rosters: {
        select: {
          id: true,
          server: {
            select: {
              id: true,
              name: true,
              region: { select: { id: true, name: true, abbr: true } },
            },
          },
          characters: {
            select: { id: true, name: true, job: true, itemLevel: true },
          },
        },
      },
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18next.getFixedT(request, "root");
  const _user = await requireUser(request);
  const user = await getUser(_user.id);
  if (!user) return redirect("/");

  const session = await getSession(request);
  if (!session.accessToken) return redirect("/");

  return json<LoaderData>({
    accessToken: session.accessToken,
    abyssalDungeon: await getAbyssalDungeon(),
    abyssRaid: await getAbyssRaid(),
    chaosDungeon: await getChaosDungeon(),
    guardianRaid: await getGuardianRaid(),
    legionRaid: await getLegionRaid(),
    locale: (await i18next.getLocale(request)) as LocaleType,
    myPosts: await getPostsByAuthorId(user.id),
    title: `${t("myPostsTitle")} | ${t("shortTitle")}`,
    user,
  });
};

export default function MyRosterMyPostsPage() {
  const data = useLoaderData<LoaderData>();
  const { t } = useTranslation();

  const _characters =
    data.user.rosters
      .sort((a, b) => a.server.name.localeCompare(b.server.name))
      .sort((a, b) => a.server.region.name.localeCompare(b.server.region.name))
      .map((r) =>
        r.characters
          .sort((a, b) => b.itemLevel - a.itemLevel)
          .map((c) => ({ ...c, roster: r }))
      )
      .flat() ?? [];
  const characters = _characters.map((c) => ({
    id: c.id,
    text: {
      en: `${t(c.job, { ns: "dictionary\\job", lng: "en" })} [${
        c.name
      }] lv.${c.itemLevel.toFixed(0)} ${c.roster.server.region.abbr}`,
      ko: `${t(c.job, { ns: "dictionary\\job", lng: "ko" })} [${
        c.name
      }] lv.${c.itemLevel.toFixed(0)} ${c.roster.server.region.abbr}`,
    },
  }));

  const contentTypes: (ItemType & {
    tiers: (ItemType & { stages: ItemType[] })[];
  })[] = [
    data.chaosDungeon,
    data.guardianRaid,
    data.abyssalDungeon,
    data.abyssRaid,
    data.legionRaid,
  ].map((d) => ({
    id: d?.id ?? "",
    text: { en: d?.nameEn ?? "", ko: d?.nameKo ?? "" },
    tiers:
      d?.tabs.map((t) => ({
        id: t.id,
        text: {
          en: `${t.nameEn}${
            (t as any).difficultyNameEn
              ? ` [${(t as any).difficultyNameEn}]`
              : ""
          }`,
          ko: `${t.nameKo}${
            (t as any).difficultyNameKo
              ? ` [${(t as any).difficultyNameKo}]`
              : ""
          }`,
        },
        stages: t.stages.map((s) => ({
          id: s.id,
          text: { en: s.nameEn, ko: s.nameKo },
        })),
      })) ?? [],
  }));

  const [loading, setLoading] = React.useState(false);

  return (
    <div className="mx-auto flex w-[46.875rem] flex-col gap-[3.125rem]">
      <div className="flex flex-col gap-[1.25rem]">
        <div className="flex items-center justify-between">
          <div className="text-[1.25rem] font-[400] leading-[1.25rem]">
            {t("recruiting", { ns: "routes\\my-roster\\my-parties" })}
          </div>
          <AddPartyButton
            characters={characters}
            contentTypes={contentTypes}
            locale={data.locale}
            userId={data.user.id}
          />
        </div>
        <div className="flex flex-col gap-[1.25rem]">
          {data.myPosts.map((p, index) => {
            return (
              <ExpandablePanel
                contentTypes={contentTypes}
                key={index}
                loading={loading}
                locale={data.locale}
                partyFindPost={p}
                setLoading={setLoading}
                userId={data.user.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
