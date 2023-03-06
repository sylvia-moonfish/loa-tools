import { ContentType, EngravingType, Job } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

type DataType = {
  nameEn: string;
  nameKo: string;
  contentType: ContentType;
  contentTabs: {
    nameEn: string;
    nameKo: string;
    difficultyNameEn?: string;
    difficultyNameKo?: string;
    contentStages: {
      nameEn: string;
      nameKo: string;
      tier: number;
      level: number;
      groupSize?: number;
    }[];
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  if (!process.env.DISCORD_ADMIN_ID) return redirect("/");

  const _user = await requireUser(request);
  const user = await prisma.user.findFirst({
    where: { id: _user.id },
    select: { id: true, discordId: true },
  });
  if (!user || user.discordId !== process.env.DISCORD_ADMIN_ID)
    return redirect("/");

  const data: DataType[] = [
    {
      nameEn: "Abyss Raid",
      nameKo: "어비스 레이드",
      contentType: ContentType.ABYSS_RAID,
      contentTabs: [
        {
          nameEn: "Argos",
          nameKo: "아르고스",
          contentStages: [
            { nameEn: "Phase 1", nameKo: "1페이즈", tier: 3, level: 1370 },
            { nameEn: "Phase 2", nameKo: "2페이즈", tier: 3, level: 1385 },
            { nameEn: "Phase 3", nameKo: "3페이즈", tier: 3, level: 1400 },
          ],
        },
      ],
    },
    {
      nameEn: "Abyssal Dungeon",
      nameKo: "어비스 던전",
      contentType: ContentType.ABYSSAL_DUNGEON,
      contentTabs: [
        {
          nameEn: "Ancient Elveria",
          nameKo: "고대 유적 엘베리아",
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
    },
    {
      nameEn: "Chaos Dungeon",
      nameKo: "카오스 던전",
      contentType: ContentType.CHAOS_DUNGEON,
      contentTabs: [
        {
          nameEn: "North Vern",
          nameKo: "베른 북부",
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
    },
    {
      nameEn: "Guardian Raid",
      nameKo: "가디언 토벌",
      contentType: ContentType.GUARDIAN_RAID,
      contentTabs: [
        {
          nameEn: "Raid Level 1",
          nameKo: "토벌 1단계",
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
            {
              nameEn: "Alberhastic",
              nameKo: "엘버하스틱",
              tier: 2,
              level: 1080,
            },
          ],
        },
        {
          nameEn: "Raid Level 5",
          nameKo: "토벌 5단계",
          contentStages: [
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
          contentStages: [
            { nameEn: "Deskaluda", nameKo: "데스칼루다", tier: 3, level: 1415 },
            {
              nameEn: "Kungelanium",
              nameKo: "쿤겔라니움",
              tier: 3,
              level: 1460,
            },
          ],
        },
      ],
    },
    {
      nameEn: "Legion Raid",
      nameKo: "군단장 레이드",
      contentType: ContentType.LEGION_RAID,
      contentTabs: [
        {
          nameEn: "Valtan",
          nameKo: "발탄",
          difficultyNameEn: "Normal",
          difficultyNameKo: "노말",
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
          contentStages: [
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
    },
  ];

  for (const _data of data) {
    let content = await prisma.content.findFirst({
      where: { contentType: _data.contentType },
    });

    if (!content) {
      content = await prisma.content.create({
        data: {
          nameEn: _data.nameEn,
          nameKo: _data.nameKo,
          contentType: _data.contentType,
        },
      });
    } else {
      content = await prisma.content.update({
        where: { id: content.id },
        data: {
          nameEn: _data.nameEn,
          nameKo: _data.nameKo,
          contentType: _data.contentType,
        },
      });
    }

    for (const [
      contentTabIndex,
      contentTabData,
    ] of _data.contentTabs.entries()) {
      const contentTab = await prisma.contentTab.upsert({
        where: {
          index_contentId: { index: contentTabIndex, contentId: content.id },
        },
        update: {
          nameEn: contentTabData.nameEn,
          nameKo: contentTabData.nameKo,
          difficultyNameEn: contentTabData.difficultyNameEn ?? null,
          difficultyNameKo: contentTabData.difficultyNameKo ?? null,
          contentType: content.contentType,
        },
        create: {
          index: contentTabIndex,
          nameEn: contentTabData.nameEn,
          nameKo: contentTabData.nameKo,
          difficultyNameEn: contentTabData.difficultyNameEn ?? null,
          difficultyNameKo: contentTabData.difficultyNameKo ?? null,
          contentType: content.contentType,
          contentId: content.id,
        },
      });

      for (const [
        contentStageIndex,
        contentStageData,
      ] of contentTabData.contentStages.entries()) {
        await prisma.contentStage.upsert({
          where: {
            index_contentTabId: {
              index: contentStageIndex,
              contentTabId: contentTab.id,
            },
          },
          update: {
            nameEn: contentStageData.nameEn,
            nameKo: contentStageData.nameKo,
            tier: contentStageData.tier,
            level: contentStageData.level,
            groupSize: contentStageData.groupSize ?? null,
            contentType: content.contentType,
          },
          create: {
            index: contentStageIndex,
            nameEn: contentStageData.nameEn,
            nameKo: contentStageData.nameKo,
            tier: contentStageData.tier,
            level: contentStageData.level,
            groupSize: contentStageData.groupSize ?? null,
            contentType: content.contentType,
            contentTabId: contentTab.id,
          },
        });
      }
    }
  }

  const engravings = [
    {
      nameEn: "Disrespect",
      nameKo: "약자 무시",
      isPositive: true,
      iconPath: "/icons/engravings/disrespect.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Spirit Absorption",
      nameKo: "정기 흡수",
      isPositive: true,
      iconPath: "/icons/engravings/spirit_absorption.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Ether Predator",
      nameKo: "에테르 포식자",
      isPositive: true,
      iconPath: "/icons/engravings/ether_predator.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Stabilized Status",
      nameKo: "안정된 상태",
      isPositive: true,
      iconPath: "/icons/engravings/stabilized_status.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Grudge",
      nameKo: "원한",
      isPositive: true,
      iconPath: "/icons/engravings/grudge.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Super Charge",
      nameKo: "슈퍼 차지",
      isPositive: true,
      iconPath: "/icons/engravings/super_charge.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Strong Will",
      nameKo: "굳은 의지",
      isPositive: true,
      iconPath: "/icons/engravings/strong_will.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Drops of Ether",
      nameKo: "구슬동자",
      isPositive: true,
      iconPath: "/icons/engravings/drops_of_ether.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Crisis Evasion",
      nameKo: "위기 모면",
      isPositive: true,
      iconPath: "/icons/engravings/crisis_evasion.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Keen Blunt Weapon",
      nameKo: "예리한 둔기",
      isPositive: true,
      iconPath: "/icons/engravings/keen_blunt_weapon.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Vital Point Hit",
      nameKo: "급소 타격",
      isPositive: true,
      iconPath: "/icons/engravings/vital_point_hit.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Max MP Increase",
      nameKo: "최대 마나 증가",
      isPositive: true,
      iconPath: "/icons/engravings/max_mp_increase.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "MP Efficiency Increase",
      nameKo: "마나 효율 증가",
      isPositive: true,
      iconPath: "/icons/engravings/mp_efficiency_increase.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Master of Escape",
      nameKo: "탈출의 명수",
      isPositive: true,
      iconPath: "/icons/engravings/master_of_escape.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Fortitude",
      nameKo: "불굴",
      isPositive: true,
      iconPath: "/icons/engravings/fortitude.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Crushing Fist",
      nameKo: "분쇄의 주먹",
      isPositive: true,
      iconPath: "/icons/engravings/crushing_fist.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Shield Piercing",
      nameKo: "실드 관통",
      isPositive: true,
      iconPath: "/icons/engravings/shield_piercing.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Master's Tenacity",
      nameKo: "달인의 저력",
      isPositive: true,
      iconPath: "/icons/engravings/masters_tenacity.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Divine Protection",
      nameKo: "여신의 가호",
      isPositive: true,
      iconPath: "/icons/engravings/divine_protection.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Heavy Armor",
      nameKo: "중갑 착용",
      isPositive: true,
      iconPath: "/icons/engravings/heavy_armor.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Explosive Expert",
      nameKo: "폭발물 전문가",
      isPositive: true,
      iconPath: "/icons/engravings/explosive_expert.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Enhanced Shield",
      nameKo: "강화 방패",
      isPositive: true,
      iconPath: "/icons/engravings/enhanced_shield.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Necromancy",
      nameKo: "강령술",
      isPositive: true,
      iconPath: "/icons/engravings/necromancy.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Preemptive Strike",
      nameKo: "선수필승",
      isPositive: true,
      iconPath: "/icons/engravings/preemptive_strike.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Broken Bone",
      nameKo: "부러진 뼈",
      isPositive: true,
      iconPath: "/icons/engravings/broken_bone.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Lightning Fury",
      nameKo: "번개의 분노",
      isPositive: true,
      iconPath: "/icons/engravings/lightning_fury.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Cursed Doll",
      nameKo: "저주받은 인형",
      isPositive: true,
      iconPath: "/icons/engravings/cursed_doll.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Contender",
      nameKo: "승부사",
      isPositive: true,
      iconPath: "/icons/engravings/contender.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Ambush Master",
      nameKo: "기습의 대가",
      isPositive: true,
      iconPath: "/icons/engravings/ambush_master.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Magick Stream",
      nameKo: "마나의 흐름",
      isPositive: true,
      iconPath: "/icons/engravings/magick_stream.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Barricade",
      nameKo: "바리케이드",
      isPositive: true,
      iconPath: "/icons/engravings/barricade.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Raid Captain",
      nameKo: "돌격대장",
      isPositive: true,
      iconPath: "/icons/engravings/raid_captain.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Awakening",
      nameKo: "각성",
      isPositive: true,
      iconPath: "/icons/engravings/awakening.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Master Brawler",
      nameKo: "결투의 대가",
      isPositive: true,
      iconPath: "/icons/engravings/master_brawler.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Mass Increase",
      nameKo: "질량 증가",
      isPositive: true,
      iconPath: "/icons/engravings/mass_increase.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Propulsion",
      nameKo: "추진력",
      isPositive: true,
      iconPath: "/icons/engravings/propulsion.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Hit Master",
      nameKo: "타격의 대가",
      isPositive: true,
      iconPath: "/icons/engravings/hit_master.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Sight Focus",
      nameKo: "시선 집중",
      isPositive: true,
      iconPath: "/icons/engravings/sight_focus.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Adrenaline",
      nameKo: "아드레날린",
      isPositive: true,
      iconPath: "/icons/engravings/adrenaline.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "All-Out Attack",
      nameKo: "속전속결",
      isPositive: true,
      iconPath: "/icons/engravings/all_out_attack.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Expert",
      nameKo: "전문의",
      isPositive: true,
      iconPath: "/icons/engravings/expert.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Emergency Rescue",
      nameKo: "긴급구조",
      isPositive: true,
      iconPath: "/icons/engravings/emergency_rescue.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },
    {
      nameEn: "Precise Dagger",
      nameKo: "정밀 단도",
      isPositive: true,
      iconPath: "/icons/engravings/precise_dagger.webp",
      type: EngravingType.COMBAT,
      job: undefined,
    },

    // DESTROYER
    {
      nameEn: "Gravity Training",
      nameKo: "중력 수련",
      isPositive: true,
      iconPath: "/icons/engravings/gravity_training.webp",
      type: EngravingType.CLASS,
      job: Job.DESTROYER,
    },
    {
      nameEn: "Rage Hammer",
      nameKo: "분노의 망치",
      isPositive: true,
      iconPath: "/icons/engravings/rage_hammer.webp",
      type: EngravingType.CLASS,
      job: Job.DESTROYER,
    },

    // GUNLANCER
    {
      nameEn: "Combat Readiness",
      nameKo: "전투 태세",
      isPositive: true,
      iconPath: "/icons/engravings/combat_readiness.webp",
      type: EngravingType.CLASS,
      job: Job.GUNLANCER,
    },
    {
      nameEn: "Lone Knight",
      nameKo: "고독한 기사",
      isPositive: true,
      iconPath: "/icons/engravings/lone_knight.webp",
      type: EngravingType.CLASS,
      job: Job.GUNLANCER,
    },

    // BERSERKER
    {
      nameEn: "Mayhem",
      nameKo: "광기",
      isPositive: true,
      iconPath: "/icons/engravings/mayhem.webp",
      type: EngravingType.CLASS,
      job: Job.BERSERKER,
    },
    {
      nameEn: "Berserker's Technique",
      nameKo: "광전사의 비기",
      isPositive: true,
      iconPath: "/icons/engravings/berserkers_technique.webp",
      type: EngravingType.CLASS,
      job: Job.BERSERKER,
    },

    // PALADIN
    {
      nameEn: "Judgment",
      nameKo: "심판자",
      isPositive: true,
      iconPath: "/icons/engravings/judgment.webp",
      type: EngravingType.CLASS,
      job: Job.PALADIN,
    },
    {
      nameEn: "Blessed Aura",
      nameKo: "축복의 오라",
      isPositive: true,
      iconPath: "/icons/engravings/blessed_aura.webp",
      type: EngravingType.CLASS,
      job: Job.PALADIN,
    },

    // STRIKER
    {
      nameEn: "Deathblow",
      nameKo: "일격필살",
      isPositive: true,
      iconPath: "/icons/engravings/deathblow.webp",
      type: EngravingType.CLASS,
      job: Job.STRIKER,
    },
    {
      nameEn: "Esoteric Flurry",
      nameKo: "오의난무",
      isPositive: true,
      iconPath: "/icons/engravings/esoteric_flurry.webp",
      type: EngravingType.CLASS,
      job: Job.STRIKER,
    },

    // WARDANCER
    {
      nameEn: "Esoteric Skill Enhancement",
      nameKo: "오의 강화",
      isPositive: true,
      iconPath: "/icons/engravings/esoteric_skill_enhancement.webp",
      type: EngravingType.CLASS,
      job: Job.WARDANCER,
    },
    {
      nameEn: "First Intention",
      nameKo: "초심",
      isPositive: true,
      iconPath: "/icons/engravings/first_intention.webp",
      type: EngravingType.CLASS,
      job: Job.WARDANCER,
    },

    // SCRAPPER
    {
      nameEn: "Ultimate Skill: Taijutsu",
      nameKo: "극의: 체술",
      isPositive: true,
      iconPath: "/icons/engravings/ultimate_skill_taijutsu.webp",
      type: EngravingType.CLASS,
      job: Job.SCRAPPER,
    },
    {
      nameEn: "Shock Training",
      nameKo: "충격 단련",
      isPositive: true,
      iconPath: "/icons/engravings/shock_training.webp",
      type: EngravingType.CLASS,
      job: Job.SCRAPPER,
    },

    // SOULFIST
    {
      nameEn: "Energy Overflow",
      nameKo: "세맥타통",
      isPositive: true,
      iconPath: "/icons/engravings/energy_overflow.webp",
      type: EngravingType.CLASS,
      job: Job.SOULFIST,
    },
    {
      nameEn: "Robust Spirit",
      nameKo: "역천지체",
      isPositive: true,
      iconPath: "/icons/engravings/robust_spirit.webp",
      type: EngravingType.CLASS,
      job: Job.SOULFIST,
    },

    // GLAIVIER
    {
      nameEn: "Pinnacle",
      nameKo: "절정",
      isPositive: true,
      iconPath: "/icons/engravings/pinnacle.webp",
      type: EngravingType.CLASS,
      job: Job.GLAIVIER,
    },
    {
      nameEn: "Control",
      nameKo: "절제",
      isPositive: true,
      iconPath: "/icons/engravings/control.webp",
      type: EngravingType.CLASS,
      job: Job.GLAIVIER,
    },

    // DEADEYE
    {
      nameEn: "Enhanced Weapon",
      nameKo: "강화 무기",
      isPositive: true,
      iconPath: "/icons/engravings/enhanced_weapon.webp",
      type: EngravingType.CLASS,
      job: Job.DEADEYE,
    },
    {
      nameEn: "Pistoleer",
      nameKo: "핸드거너",
      isPositive: true,
      iconPath: "/icons/engravings/pistoleer.webp",
      type: EngravingType.CLASS,
      job: Job.DEADEYE,
    },

    // ARTILLERIST
    {
      nameEn: "Firepower Enhancement",
      nameKo: "화력 강화",
      isPositive: true,
      iconPath: "/icons/engravings/firepower_enhancement.webp",
      type: EngravingType.CLASS,
      job: Job.ARTILLERIST,
    },
    {
      nameEn: "Barrage Enhancement",
      nameKo: "포격 강화",
      isPositive: true,
      iconPath: "/icons/engravings/barrage_enhancement.webp",
      type: EngravingType.CLASS,
      job: Job.ARTILLERIST,
    },

    // SHARPSHOOTER
    {
      nameEn: "Loyal Companion",
      nameKo: "두 번째 동료",
      isPositive: true,
      iconPath: "/icons/engravings/loyal_companion.webp",
      type: EngravingType.CLASS,
      job: Job.SHARPSHOOTER,
    },
    {
      nameEn: "Death Strike",
      nameKo: "죽음의 습격",
      isPositive: true,
      iconPath: "/icons/engravings/death_strike.webp",
      type: EngravingType.CLASS,
      job: Job.SHARPSHOOTER,
    },

    // GUNSLINGER
    {
      nameEn: "Peacemaker",
      nameKo: "피스메이커",
      isPositive: true,
      iconPath: "/icons/engravings/peacemaker.webp",
      type: EngravingType.CLASS,
      job: Job.GUNSLINGER,
    },
    {
      nameEn: "Time to Hunt",
      nameKo: "사냥의 시간",
      isPositive: true,
      iconPath: "/icons/engravings/time_to_hunt.webp",
      type: EngravingType.CLASS,
      job: Job.GUNSLINGER,
    },

    // BARD
    {
      nameEn: "True Courage",
      nameKo: "진실된 용맹",
      isPositive: true,
      iconPath: "/icons/engravings/true_courage.webp",
      type: EngravingType.CLASS,
      job: Job.BARD,
    },
    {
      nameEn: "Desperate Salvation",
      nameKo: "절실한 구원",
      isPositive: true,
      iconPath: "/icons/engravings/desperate_salvation.webp",
      type: EngravingType.CLASS,
      job: Job.BARD,
    },

    // ARCANIST
    {
      nameEn: "Empress's Grace",
      nameKo: "황후의 은총",
      isPositive: true,
      iconPath: "/icons/engravings/empresss_grace.webp",
      type: EngravingType.CLASS,
      job: Job.ARCANIST,
    },
    {
      nameEn: "Order of the Emperor",
      nameKo: "황제의 칙령",
      isPositive: true,
      iconPath: "/icons/engravings/order_of_the_emperor.webp",
      type: EngravingType.CLASS,
      job: Job.ARCANIST,
    },

    // SORCERESS
    {
      nameEn: "Igniter",
      nameKo: "점화",
      isPositive: true,
      iconPath: "/icons/engravings/igniter.webp",
      type: EngravingType.CLASS,
      job: Job.SORCERESS,
    },
    {
      nameEn: "Reflux",
      nameKo: "환류",
      isPositive: true,
      iconPath: "/icons/engravings/reflux.webp",
      type: EngravingType.CLASS,
      job: Job.SORCERESS,
    },

    // DEATHBLADE
    {
      nameEn: "Remaining Energy",
      nameKo: "잔재된 기운",
      isPositive: true,
      iconPath: "/icons/engravings/remaining_energy.webp",
      type: EngravingType.CLASS,
      job: Job.DEATHBLADE,
    },
    {
      nameEn: "Surge",
      nameKo: "버스트",
      isPositive: true,
      iconPath: "/icons/engravings/surge.webp",
      type: EngravingType.CLASS,
      job: Job.DEATHBLADE,
    },

    // SHADOWHUNTER
    {
      nameEn: "Perfect Suppression",
      nameKo: "완벽한 억제",
      isPositive: true,
      iconPath: "/icons/engravings/perfect_suppression.webp",
      type: EngravingType.CLASS,
      job: Job.SHADOWHUNTER,
    },
    {
      nameEn: "Demonic Impulse",
      nameKo: "멈출 수 없는 충동",
      isPositive: true,
      iconPath: "/icons/engravings/demonic_impulse.webp",
      type: EngravingType.CLASS,
      job: Job.SHADOWHUNTER,
    },
  ];

  for (const engraving of engravings) {
    const _engraving = await prisma.engraving.findFirst({
      where: { nameEn: engraving.nameEn },
    });

    if (_engraving) {
      await prisma.engraving.update({
        where: { id: _engraving.id },
        data: engraving,
      });
    } else {
      await prisma.engraving.create({ data: engraving });
    }
  }

  const regionMap = [
    {
      regionName: "North America West",
      regionAbbr: "NW",
      regionShortName: "NA.W",
      serverNames: [
        "Mari",
        "Valtan",
        "Enviska",
        "Akkan",
        "Bergstrom",
        "Shandi",
        "Rohendel",
      ],
    },
    {
      regionName: "North America East",
      regionAbbr: "NE",
      regionShortName: "NA.E",
      serverNames: [
        "Azena",
        "Una",
        "Regulus",
        "Avesta",
        "Galatur",
        "Karta",
        "Ladon",
        "Kharmine",
        "Elzowin",
        "Sasha",
        "Adrinne",
        "Aldebaran",
        "Zosma",
        "Vykas",
        "Danube",
      ],
    },
    {
      regionName: "Europe Central",
      regionAbbr: "EC",
      regionShortName: "E.C",
      serverNames: [
        "Neria",
        "Kadan",
        "Trixion",
        "Calvasus",
        "Thirain",
        "Zinnervale",
        "Asta",
        "Wei",
        "Slen",
        "Sceptrum",
        "Procyon",
        "Beatrice",
        "Inanna",
        "Thaemine",
        "Sirius",
        "Antares",
        "Brelshaza",
        "Nineveh",
        "Mokoko",
      ],
    },
    {
      regionName: "Europe West",
      regionAbbr: "EW",
      regionShortName: "E.W",
      serverNames: [
        "Rethramis",
        "Tortoyk",
        "Moonkeep",
        "Stonehearth",
        "Shadespire",
        "Tragon",
        "Petrania",
        "Punika",
      ],
    },
    {
      regionName: "South America",
      regionAbbr: "SA",
      regionShortName: "SA",
      serverNames: [
        "Kazeros",
        "Agaton",
        "Gienah",
        "Arcturus",
        "Yorn",
        "Feiton",
        "Vern",
        "Kurzan",
        "Prideholme",
      ],
    },
  ];

  for (let i = 0; i < regionMap.length; i++) {
    let region = await prisma.region.upsert({
      where: {
        name: regionMap[i].regionName,
      },
      update: {
        name: regionMap[i].regionName,
      },
      create: {
        name: regionMap[i].regionName,
        abbr: regionMap[i].regionAbbr,
        shortName: regionMap[i].regionShortName,
      },
    });

    for (let j = 0; j < regionMap[i].serverNames.length; j++) {
      await prisma.server.upsert({
        where: {
          name: regionMap[i].serverNames[j],
        },
        update: {
          name: regionMap[i].serverNames[j],
          regionId: region.id,
        },
        create: {
          name: regionMap[i].serverNames[j],
          regionId: region.id,
        },
      });
    }
  }

  return json({});
};

export default function SeedPage() {
  return <div></div>;
}
