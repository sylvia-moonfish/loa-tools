import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

type AbyssalDungeonDataType = {
  nameEn: string;
  nameKo: string;
  tabs: AbyssalDungeonTabDataType[];
};

type AbyssalDungeonTabDataType = {
  nameEn: string;
  nameKo: string;
  difficultyNameEn?: string;
  difficultyNameKo?: string;
  stages: AbyssalDungeonStageDataType[];
};

type AbyssalDungeonStageDataType = {
  nameEn: string;
  nameKo: string;
  tier: number;
  level: number;
  groupSize: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  if (!process.env.DISCORD_ADMIN_ID) return redirect("/");

  const user = await requireUser(request);
  if (user.discordId !== process.env.DISCORD_ADMIN_ID) return redirect("/");

  const abyssalDungeonData: AbyssalDungeonDataType = {
    nameEn: "Abyssal Dungeon",
    nameKo: "어비스 던전",
    tabs: [
      {
        nameEn: "Ancient Elveria",
        nameKo: "고대 유적 엘베리아",
        stages: [
          {
            nameEn: "Demon Beast Canyon",
            nameKo: "마수의 골짜기",
            tier: 1,
            level: 340,
            groupSize: 4,
          },
          {
            nameEn: "Necromancer's Origin",
            nameKo: "사령술사의 근원",
            tier: 1,
            level: 340,
            groupSize: 4,
          },
        ],
      },
      {
        nameEn: "Phantom Palace",
        nameKo: "몽환의 궁전",
        stages: [
          {
            nameEn: "Hall of the Twisted Warlord",
            nameKo: "비틀린 군주의 회랑",
            tier: 1,
            level: 460,
            groupSize: 4,
          },
          {
            nameEn: "Hildebrandt Palace",
            nameKo: "몽환궁전 힐데브리뉴",
            tier: 1,
            level: 460,
            groupSize: 4,
          },
        ],
      },
      {
        nameEn: "Ark of Arrogance",
        nameKo: "오만의 방주",
        stages: [
          {
            nameEn: "Road of Lament",
            nameKo: "탄식의 길",
            tier: 2,
            level: 840,
            groupSize: 4,
          },
          {
            nameEn: "Forge of Fallen Pride",
            nameKo: "추락한 긍지의 용광로",
            tier: 2,
            level: 840,
            groupSize: 4,
          },
        ],
      },
      {
        nameEn: "Gate of Paradise",
        nameKo: "낙원의 문",
        stages: [
          {
            nameEn: "Sea of Indolence",
            nameKo: "태만의 바다",
            tier: 2,
            level: 960,
            groupSize: 8,
          },
          {
            nameEn: "Tranquil Karkosa",
            nameKo: "고요한 카르코사",
            tier: 2,
            level: 960,
            groupSize: 8,
          },
          {
            nameEn: "Alaric's Sanctuary",
            nameKo: "아르카디아의 성역",
            tier: 2,
            level: 960,
            groupSize: 8,
          },
        ],
      },
      {
        nameEn: "Oreha's Well",
        nameKo: "오레하의 우물",
        difficultyNameEn: "Normal",
        difficultyNameKo: "노말",
        stages: [
          {
            nameEn: "Aira's Oculus",
            nameKo: "아이라의 눈",
            tier: 3,
            level: 1325,
            groupSize: 4,
          },
          {
            nameEn: "Oreha Preveza",
            nameKo: "오레하 프라바사",
            tier: 3,
            level: 1340,
            groupSize: 4,
          },
        ],
      },
      {
        nameEn: "Oreha's Well",
        nameKo: "오레하의 우물",
        difficultyNameEn: "Hard",
        difficultyNameKo: "하드",
        stages: [
          {
            nameEn: "Aira's Oculus",
            nameKo: "아이라의 눈",
            tier: 3,
            level: 1370,
            groupSize: 4,
          },
          {
            nameEn: "Oreha Preveza",
            nameKo: "오레하 프라바사",
            tier: 3,
            level: 1370,
            groupSize: 4,
          },
        ],
      },
    ],
  };

  let abyssalDungeon = await prisma.abyssalDungeon.findFirst();

  if (!abyssalDungeon) {
    abyssalDungeon = await prisma.abyssalDungeon.create({
      data: {
        nameEn: abyssalDungeonData.nameEn,
        nameKo: abyssalDungeonData.nameKo,
      },
    });
  } else {
    abyssalDungeon = await prisma.abyssalDungeon.update({
      where: { id: abyssalDungeon.id },
      data: {
        nameEn: abyssalDungeonData.nameEn,
        nameKo: abyssalDungeonData.nameKo,
      },
    });
  }

  for (const [
    abyssalDungeonTabIndex,
    abyssalDungeonTabData,
  ] of abyssalDungeonData.tabs.entries()) {
    const abyssalDungeonTab = await prisma.abyssalDungeonTab.upsert({
      where: {
        index_abyssalDungeonId: {
          index: abyssalDungeonTabIndex,
          abyssalDungeonId: abyssalDungeon.id,
        },
      },
      update: {
        nameEn: abyssalDungeonTabData.nameEn,
        nameKo: abyssalDungeonTabData.nameKo,
        difficultyNameEn: abyssalDungeonTabData.difficultyNameEn ?? undefined,
        difficultyNameKo: abyssalDungeonTabData.difficultyNameKo ?? undefined,
      },
      create: {
        index: abyssalDungeonTabIndex,
        nameEn: abyssalDungeonTabData.nameEn,
        nameKo: abyssalDungeonTabData.nameKo,
        difficultyNameEn: abyssalDungeonTabData.difficultyNameEn ?? undefined,
        difficultyNameKo: abyssalDungeonTabData.difficultyNameKo ?? undefined,
        abyssalDungeonId: abyssalDungeon.id,
      },
    });

    for (const [
      abyssalDungeonStageIndex,
      abyssalDungeonStageData,
    ] of abyssalDungeonTabData.stages.entries()) {
      await prisma.abyssalDungeonStage.upsert({
        where: {
          index_abyssalDungeonTabId: {
            index: abyssalDungeonStageIndex,
            abyssalDungeonTabId: abyssalDungeonTab.id,
          },
        },
        update: {
          nameEn: abyssalDungeonStageData.nameEn,
          nameKo: abyssalDungeonStageData.nameKo,
          tier: abyssalDungeonStageData.tier,
          level: abyssalDungeonStageData.level,
          groupSize: abyssalDungeonStageData.groupSize,
        },
        create: {
          index: abyssalDungeonStageIndex,
          nameEn: abyssalDungeonStageData.nameEn,
          nameKo: abyssalDungeonStageData.nameKo,
          tier: abyssalDungeonStageData.tier,
          level: abyssalDungeonStageData.level,
          groupSize: abyssalDungeonStageData.groupSize,
          abyssalDungeonTabId: abyssalDungeonTab.id,
        },
      });
    }
  }

  return json(
    await prisma.abyssalDungeon.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        nameEn: true,
        nameKo: true,
        tabs: {
          orderBy: { index: "asc" },
          select: {
            id: true,
            index: true,
            nameEn: true,
            nameKo: true,
            stages: {
              orderBy: { index: "asc" },
              select: {
                id: true,
                index: true,
                nameEn: true,
                nameKo: true,
                tier: true,
                level: true,
                groupSize: true,
              },
            },
          },
        },
      },
    })
  );
};

export default function AbyssalDungeonPage() {
  const data = useLoaderData();
  console.log(data);

  return (
    <textarea
      className="h-full-screen w-full cursor-default bg-loa-body"
      readOnly={true}
      value={JSON.stringify(data, null, 4)}
    />
  );
}
