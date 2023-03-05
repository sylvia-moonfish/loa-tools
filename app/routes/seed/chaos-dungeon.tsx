import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

type ChaosDungeonDataType = {
  nameEn: string;
  nameKo: string;
  tabs: ChaosDungeonTabDataType[];
};

type ChaosDungeonTabDataType = {
  nameEn: string;
  nameKo: string;
  stages: ChaosDungeonStageDataType[];
};

type ChaosDungeonStageDataType = {
  nameEn: string;
  nameKo: string;
  tier: number;
  level: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const chaosDungeonData: ChaosDungeonDataType = {
    nameEn: "Chaos Dungeon",
    nameKo: "카오스 던전",
    tabs: [
      {
        nameEn: "North Vern",
        nameKo: "베른 북부",
        stages: [
          {
            nameEn: "Level 1 Echo",
            nameKo: "공명 1단계",
            tier: 1,
            level: 250,
          },
          {
            nameEn: "Level 2 Echo",
            nameKo: "공명 2단계",
            tier: 1,
            level: 340,
          },
          {
            nameEn: "Level 3 Echo",
            nameKo: "공명 3단계",
            tier: 1,
            level: 380,
          },
          {
            nameEn: "Level 4 Echo",
            nameKo: "공명 4단계",
            tier: 1,
            level: 420,
          },
        ],
      },
      {
        nameEn: "Rohendel",
        nameKo: "로헨델",
        stages: [
          {
            nameEn: "Level 1 Phantom",
            nameKo: "환영 1단계",
            tier: 1,
            level: 460,
          },
          {
            nameEn: "Level 2 Phantom",
            nameKo: "환영 2단계",
            tier: 1,
            level: 500,
          },
          {
            nameEn: "Level 3 Phantom",
            nameKo: "환영 3단계",
            tier: 1,
            level: 540,
          },
          {
            nameEn: "Level 4 Phantom",
            nameKo: "환영 4단계",
            tier: 1,
            level: 580,
          },
        ],
      },
      {
        nameEn: "Yorn",
        nameKo: "욘",
        stages: [
          {
            nameEn: "Level 1 Earth",
            nameKo: "대지 1단계",
            tier: 2,
            level: 600,
          },
          {
            nameEn: "Level 2 Earth",
            nameKo: "대지 2단계",
            tier: 2,
            level: 840,
          },
          {
            nameEn: "Level 3 Earth",
            nameKo: "대지 3단계",
            tier: 2,
            level: 880,
          },
          {
            nameEn: "Level 4 Earth",
            nameKo: "대지 4단계",
            tier: 2,
            level: 920,
          },
        ],
      },
      {
        nameEn: "Feiton",
        nameKo: "페이튼",
        stages: [
          {
            nameEn: "Level 1 Shadow",
            nameKo: "그림자 1단계",
            tier: 2,
            level: 960,
          },
          {
            nameEn: "Level 2 Shadow",
            nameKo: "그림자 2단계",
            tier: 2,
            level: 1000,
          },
          {
            nameEn: "Level 3 Shadow",
            nameKo: "그림자 3단계",
            tier: 2,
            level: 1040,
          },
          {
            nameEn: "Level 4 Shadow",
            nameKo: "그림자 4단계",
            tier: 2,
            level: 1080,
          },
        ],
      },
      {
        nameEn: "Punika",
        nameKo: "파푸니카",
        stages: [
          {
            nameEn: "Level 1 Star",
            nameKo: "별 1단계",
            tier: 3,
            level: 1100,
          },
          {
            nameEn: "Level 2 Star",
            nameKo: "별 2단계",
            tier: 3,
            level: 1310,
          },
          {
            nameEn: "level 1 Moon",
            nameKo: "달 1단계",
            tier: 3,
            level: 1325,
          },
          {
            nameEn: "Level 2 Moon",
            nameKo: "달 2단계",
            tier: 3,
            level: 1340,
          },
          {
            nameEn: "Level 3 Moon",
            nameKo: "달 3단계",
            tier: 3,
            level: 1355,
          },
          {
            nameEn: "Level 1 Sun",
            nameKo: "태양 1단계",
            tier: 3,
            level: 1370,
          },
          {
            nameEn: "Level 2 Sun",
            nameKo: "태양 2단계",
            tier: 3,
            level: 1385,
          },
          {
            nameEn: "Level 3 Sun",
            nameKo: "태양 3단계",
            tier: 3,
            level: 1400,
          },
        ],
      },
      {
        nameEn: "South Vern",
        nameKo: "베른 남부",
        stages: [
          {
            nameEn: "Level 1 Corruption",
            nameKo: "타락 1단계",
            tier: 3,
            level: 1415,
          },
          {
            nameEn: "Level 2 Corruption",
            nameKo: "타락 2단계",
            tier: 3,
            level: 1445,
          },
          {
            nameEn: "Level 3 Corruption",
            nameKo: "타락 3단계",
            tier: 3,
            level: 1475,
          },
        ],
      },
    ],
  };

  let chaosDungeon = await prisma.chaosDungeon.findFirst();

  if (!chaosDungeon) {
    chaosDungeon = await prisma.chaosDungeon.create({
      data: {
        nameEn: chaosDungeonData.nameEn,
        nameKo: chaosDungeonData.nameKo,
      },
    });
  } else {
    chaosDungeon = await prisma.chaosDungeon.update({
      where: { id: chaosDungeon.id },
      data: {
        nameEn: chaosDungeonData.nameEn,
        nameKo: chaosDungeonData.nameKo,
      },
    });
  }

  for (const [
    chaosDungeonTabIndex,
    chaosDungeonTabData,
  ] of chaosDungeonData.tabs.entries()) {
    const chaosDungeonTab = await prisma.chaosDungeonTab.upsert({
      where: {
        index_chaosDungeonId: {
          index: chaosDungeonTabIndex,
          chaosDungeonId: chaosDungeon.id,
        },
      },
      update: {
        nameEn: chaosDungeonTabData.nameEn,
        nameKo: chaosDungeonTabData.nameKo,
      },
      create: {
        index: chaosDungeonTabIndex,
        nameEn: chaosDungeonTabData.nameEn,
        nameKo: chaosDungeonTabData.nameKo,
        chaosDungeonId: chaosDungeon.id,
      },
    });

    for (const [
      chaosDungeonStageIndex,
      chaosDungeonStageData,
    ] of chaosDungeonTabData.stages.entries()) {
      await prisma.chaosDungeonStage.upsert({
        where: {
          index_chaosDungeonTabId: {
            index: chaosDungeonStageIndex,
            chaosDungeonTabId: chaosDungeonTab.id,
          },
        },
        update: {
          nameEn: chaosDungeonStageData.nameEn,
          nameKo: chaosDungeonStageData.nameKo,
          tier: chaosDungeonStageData.tier,
          level: chaosDungeonStageData.level,
        },
        create: {
          index: chaosDungeonStageIndex,
          nameEn: chaosDungeonStageData.nameEn,
          nameKo: chaosDungeonStageData.nameKo,
          tier: chaosDungeonStageData.tier,
          level: chaosDungeonStageData.level,
          chaosDungeonTabId: chaosDungeonTab.id,
        },
      });
    }
  }

  return json(
    await prisma.chaosDungeon.findMany({
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
              },
            },
          },
        },
      },
    })
  );
};

export default function ChaosDungeonPage() {
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
