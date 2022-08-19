import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

type GuardianRaidDataType = {
  nameEn: string;
  nameKo: string;
  tabs: GuardianRaidTabDataType[];
};

type GuardianRaidTabDataType = {
  nameEn: string;
  nameKo: string;
  stages: GuardianRaidStageDataType[];
};

type GuardianRaidStageDataType = {
  nameEn: string;
  nameKo: string;
  tier: number;
  level: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const guardianRaidData: GuardianRaidDataType = {
    nameEn: "Guardian Raid",
    nameKo: "가디언 토벌",
    tabs: [
      {
        nameEn: "Raid Level 1",
        nameKo: "토벌 1단계",
        stages: [
          { nameEn: "Ur'nil", nameKo: "우르닐", tier: 1, level: 302 },
          { nameEn: "Lumerus", nameKo: "루메루스", tier: 1, level: 340 },
          {
            nameEn: "Icy Legoros",
            nameKo: "빙결의 레기오로스",
            tier: 1,
            level: 380,
          },
          { nameEn: "Vertus", nameKo: "베르투스", tier: 1, level: 420 },
        ],
      },
      {
        nameEn: "Raid Level 2",
        nameKo: "토벌 2단계",
        stages: [
          { nameEn: "Chromanium", nameKo: "크로마니움", tier: 1, level: 460 },
          { nameEn: "Nacrasena", nameKo: "나크라세나", tier: 1, level: 500 },
          {
            nameEn: "Flame Fox Yoho",
            nameKo: "홍염의 요호",
            tier: 1,
            level: 540,
          },
          { nameEn: "Tytalos", nameKo: "타이탈로스", tier: 1, level: 580 },
        ],
      },
      {
        nameEn: "Raid Level 3",
        nameKo: "토벌 3단계",
        stages: [
          {
            nameEn: "Dark Legoros",
            nameKo: "어둠의 레기오로스",
            tier: 2,
            level: 802,
          },
          { nameEn: "Helgaia", nameKo: "헬가이아", tier: 2, level: 840 },
          { nameEn: "Calventus", nameKo: "칼벤투스", tier: 2, level: 880 },
          { nameEn: "Achates", nameKo: "아카테스", tier: 2, level: 920 },
        ],
      },
      {
        nameEn: "Raid Level 4",
        nameKo: "토벌 4단계",
        stages: [
          {
            nameEn: "Frost Helgaia",
            nameKo: "혹한의 헬가이아",
            tier: 2,
            level: 960,
          },
          {
            nameEn: "Lava Chromanium",
            nameKo: "용암 크로마니움",
            tier: 2,
            level: 1000,
          },
          { nameEn: "Levanos", nameKo: "레바노스", tier: 2, level: 1040 },
          { nameEn: "Alberhastic", nameKo: "엘버하스틱", tier: 2, level: 1080 },
        ],
      },
      {
        nameEn: "Raid Level 5",
        nameKo: "토벌 5단계",
        stages: [
          {
            nameEn: "Armored Nacrasena",
            nameKo: "중갑 나크라세나",
            tier: 3,
            level: 1302,
          },
          { nameEn: "Igrexion", nameKo: "이그렉시온", tier: 3, level: 1340 },
          {
            nameEn: "Night Fox Yoho",
            nameKo: "흑야의 요호",
            tier: 3,
            level: 1370,
          },
          { nameEn: "Velganos", nameKo: "벨가누스", tier: 3, level: 1385 },
        ],
      },
      {
        nameEn: "Raid Level 6",
        nameKo: "토벌 6단계",
        stages: [
          { nameEn: "Deskaluda", nameKo: "데스칼루다", tier: 3, level: 1415 },
          { nameEn: "Kungelanium", nameKo: "쿤겔라니움", tier: 3, level: 1460 },
        ],
      },
    ],
  };

  let guardianRaid = await prisma.guardianRaid.findFirst();

  if (!guardianRaid) {
    guardianRaid = await prisma.guardianRaid.create({
      data: {
        nameEn: guardianRaidData.nameEn,
        nameKo: guardianRaidData.nameKo,
      },
    });
  } else {
    guardianRaid = await prisma.guardianRaid.update({
      where: { id: guardianRaid.id },
      data: {
        nameEn: guardianRaidData.nameEn,
        nameKo: guardianRaidData.nameKo,
      },
    });
  }

  for (const [
    guardianRaidTabIndex,
    guardianRaidTabData,
  ] of guardianRaidData.tabs.entries()) {
    const guardianRaidTab = await prisma.guardianRaidTab.upsert({
      where: {
        index_guardianRaidId: {
          index: guardianRaidTabIndex,
          guardianRaidId: guardianRaid.id,
        },
      },
      update: {
        nameEn: guardianRaidTabData.nameEn,
        nameKo: guardianRaidTabData.nameKo,
      },
      create: {
        index: guardianRaidTabIndex,
        nameEn: guardianRaidTabData.nameEn,
        nameKo: guardianRaidTabData.nameKo,
        guardianRaidId: guardianRaid.id,
      },
    });

    for (const [
      guardianRaidStageIndex,
      guardianRaidStageData,
    ] of guardianRaidTabData.stages.entries()) {
      await prisma.guardianRaidStage.upsert({
        where: {
          index_guardianRaidTabId: {
            index: guardianRaidStageIndex,
            guardianRaidTabId: guardianRaidTab.id,
          },
        },
        update: {
          nameEn: guardianRaidStageData.nameEn,
          nameKo: guardianRaidStageData.nameKo,
          tier: guardianRaidStageData.tier,
          level: guardianRaidStageData.level,
        },
        create: {
          index: guardianRaidStageIndex,
          nameEn: guardianRaidStageData.nameEn,
          nameKo: guardianRaidStageData.nameKo,
          tier: guardianRaidStageData.tier,
          level: guardianRaidStageData.level,
          guardianRaidTabId: guardianRaidTab.id,
        },
      });
    }
  }

  return json(
    await prisma.guardianRaid.findMany({
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

export default function GuardianRaidPage() {
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
