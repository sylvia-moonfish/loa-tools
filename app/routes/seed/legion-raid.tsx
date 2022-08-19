import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

type LegionRaidDataType = {
  nameEn: string;
  nameKo: string;
  tabs: LegionRaidTabDataType[];
};

type LegionRaidTabDataType = {
  nameEn: string;
  nameKo: string;
  difficultyNameEn: string;
  difficultyNameKo: string;
  stages: LegionRaidStageDataType[];
};

type LegionRaidStageDataType = {
  nameEn: string;
  nameKo: string;
  tier: number;
  level: number;
  groupSize: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const legionRaidData: LegionRaidDataType = {
    nameEn: "Legion Raid",
    nameKo: "군단장 레이드",
    tabs: [
      {
        nameEn: "Valtan",
        nameKo: "발탄",
        difficultyNameEn: "Normal",
        difficultyNameKo: "노말",
        stages: [
          {
            nameEn: "Gate 1",
            nameKo: "1관문",
            tier: 3,
            level: 1415,
            groupSize: 8,
          },
          {
            nameEn: "Gate 2",
            nameKo: "2관문",
            tier: 3,
            level: 1415,
            groupSize: 8,
          },
        ],
      },
      {
        nameEn: "Valtan",
        nameKo: "발탄",
        difficultyNameEn: "Hard",
        difficultyNameKo: "하드",
        stages: [
          {
            nameEn: "Gate 1",
            nameKo: "1관문",
            tier: 3,
            level: 1445,
            groupSize: 8,
          },
          {
            nameEn: "Gate 2",
            nameKo: "2관문",
            tier: 3,
            level: 1445,
            groupSize: 8,
          },
        ],
      },
      {
        nameEn: "Valtan",
        nameKo: "발탄",
        difficultyNameEn: "Inferno",
        difficultyNameKo: "헬",
        stages: [
          {
            nameEn: "All Gates",
            nameKo: "전 관문",
            tier: 3,
            level: 1445,
            groupSize: 8,
          },
        ],
      },
      {
        nameEn: "Vykas",
        nameKo: "비아키스",
        difficultyNameEn: "Normal",
        difficultyNameKo: "노말",
        stages: [
          {
            nameEn: "Gate 1",
            nameKo: "1관문",
            tier: 3,
            level: 1430,
            groupSize: 8,
          },
          {
            nameEn: "Gate 2",
            nameKo: "2관문",
            tier: 3,
            level: 1430,
            groupSize: 8,
          },
          {
            nameEn: "Gate 3",
            nameKo: "3관문",
            tier: 3,
            level: 1430,
            groupSize: 8,
          },
        ],
      },
      {
        nameEn: "Vykas",
        nameKo: "비아키스",
        difficultyNameEn: "Hard",
        difficultyNameKo: "하드",
        stages: [
          {
            nameEn: "Gate 1",
            nameKo: "1관문",
            tier: 3,
            level: 1460,
            groupSize: 8,
          },
          {
            nameEn: "Gate 2",
            nameKo: "2관문",
            tier: 3,
            level: 1460,
            groupSize: 8,
          },
          {
            nameEn: "Gate 3",
            nameKo: "3관문",
            tier: 3,
            level: 1460,
            groupSize: 8,
          },
        ],
      },
    ],
  };

  let legionRaid = await prisma.legionRaid.findFirst();

  if (!legionRaid) {
    legionRaid = await prisma.legionRaid.create({
      data: { nameEn: legionRaidData.nameEn, nameKo: legionRaidData.nameKo },
    });
  } else {
    legionRaid = await prisma.legionRaid.update({
      where: { id: legionRaid.id },
      data: { nameEn: legionRaidData.nameEn, nameKo: legionRaidData.nameKo },
    });
  }

  for (const [
    legionRaidTabIndex,
    legionRaidTabData,
  ] of legionRaidData.tabs.entries()) {
    const legionRaidTab = await prisma.legionRaidTab.upsert({
      where: {
        index_legionRaidId: {
          index: legionRaidTabIndex,
          legionRaidId: legionRaid.id,
        },
      },
      update: {
        nameEn: legionRaidTabData.nameEn,
        nameKo: legionRaidTabData.nameKo,
        difficultyNameEn: legionRaidTabData.difficultyNameEn,
        difficultyNameKo: legionRaidTabData.difficultyNameKo,
      },
      create: {
        index: legionRaidTabIndex,
        nameEn: legionRaidTabData.nameEn,
        nameKo: legionRaidTabData.nameKo,
        difficultyNameEn: legionRaidTabData.difficultyNameEn,
        difficultyNameKo: legionRaidTabData.difficultyNameKo,
        legionRaidId: legionRaid.id,
      },
    });

    for (const [
      legionRaidStageIndex,
      legionRaidStageData,
    ] of legionRaidTabData.stages.entries()) {
      await prisma.legionRaidStage.upsert({
        where: {
          index_legionRaidTabId: {
            index: legionRaidStageIndex,
            legionRaidTabId: legionRaidTab.id,
          },
        },
        update: {
          nameEn: legionRaidStageData.nameEn,
          nameKo: legionRaidStageData.nameKo,
          tier: legionRaidStageData.tier,
          level: legionRaidStageData.level,
          groupSize: legionRaidStageData.groupSize,
        },
        create: {
          index: legionRaidStageIndex,
          nameEn: legionRaidStageData.nameEn,
          nameKo: legionRaidStageData.nameKo,
          tier: legionRaidStageData.tier,
          level: legionRaidStageData.level,
          groupSize: legionRaidStageData.groupSize,
          legionRaidTabId: legionRaidTab.id,
        },
      });
    }
  }

  return json(
    await prisma.legionRaid.findMany({
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
            difficultyNameEn: true,
            difficultyNameKo: true,
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

export default function LegionRaidPage() {
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
