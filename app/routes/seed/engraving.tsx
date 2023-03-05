import type { LoaderFunction } from "@remix-run/node";
import { EngravingType, Job } from "@prisma/client";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async ({ request }) => {
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

  return json(
    await prisma.engraving.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        nameEn: true,
        nameKo: true,
        isPositive: true,
        iconPath: true,
        type: true,
        job: true,
      },
    })
  );
};

export default function EngravingPage() {
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
