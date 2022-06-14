import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

type AbyssRaidDataType = {
  nameEn: string;
  nameKo: string;
  tabs: AbyssRaidTabDataType[];
};

type AbyssRaidTabDataType = {
  nameEn: string;
  nameKo: string;
  stages: AbyssRaidStageDataType[];
};

type AbyssRaidStageDataType = {
  nameEn: string;
  nameKo: string;
  tier: number;
  level: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  if (!process.env.DISCORD_ADMIN_ID) return redirect("/");

  const user = await requireUser(request);
  if (user.discordId !== process.env.DISCORD_ADMIN_ID) return redirect("/");

  const abyssRaidData: AbyssRaidDataType = {
    nameEn: "Abyss Raid",
    nameKo: "어비스 레이드",
    tabs: [
      {
        nameEn: "Argos",
        nameKo: "아르고스",
        stages: [
          { nameEn: "Phase 1", nameKo: "1페이즈", tier: 3, level: 1370 },
          { nameEn: "Phase 2", nameKo: "2페이즈", tier: 3, level: 1385 },
          { nameEn: "Phase 3", nameKo: "3페이즈", tier: 3, level: 1400 },
        ],
      },
    ],
  };

  let abyssRaid = await prisma.abyssRaid.findFirst();

  if (!abyssRaid) {
    abyssRaid = await prisma.abyssRaid.create({
      data: { nameEn: abyssRaidData.nameEn, nameKo: abyssRaidData.nameKo },
    });
  } else {
    abyssRaid = await prisma.abyssRaid.update({
      where: { id: abyssRaid.id },
      data: { nameEn: abyssRaidData.nameEn, nameKo: abyssRaidData.nameKo },
    });
  }

  for (const [
    abyssRaidTabIndex,
    abyssRaidTabData,
  ] of abyssRaidData.tabs.entries()) {
    const abyssRaidTab = await prisma.abyssRaidTab.upsert({
      where: {
        index_abyssRaidId: {
          index: abyssRaidTabIndex,
          abyssRaidId: abyssRaid.id,
        },
      },
      update: {
        nameEn: abyssRaidTabData.nameEn,
        nameKo: abyssRaidTabData.nameKo,
      },
      create: {
        index: abyssRaidTabIndex,
        nameEn: abyssRaidTabData.nameEn,
        nameKo: abyssRaidTabData.nameKo,
        abyssRaidId: abyssRaid.id,
      },
    });

    for (const [
      abyssRaidStageIndex,
      abyssRaidStageData,
    ] of abyssRaidTabData.stages.entries()) {
      await prisma.abyssRaidStage.upsert({
        where: {
          index_abyssRaidTabId: {
            index: abyssRaidStageIndex,
            abyssRaidTabId: abyssRaidTab.id,
          },
        },
        update: {
          nameEn: abyssRaidStageData.nameEn,
          nameKo: abyssRaidStageData.nameKo,
          tier: abyssRaidStageData.tier,
          level: abyssRaidStageData.level,
        },
        create: {
          index: abyssRaidStageIndex,
          nameEn: abyssRaidStageData.nameEn,
          nameKo: abyssRaidStageData.nameKo,
          tier: abyssRaidStageData.tier,
          level: abyssRaidStageData.level,
          abyssRaidTabId: abyssRaidTab.id,
        },
      });
    }
  }

  return json(
    await prisma.abyssRaid.findMany({
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

export default function AbyssRaidPage() {
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
