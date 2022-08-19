import type {
  AbyssalDungeon,
  AbyssalDungeonStage,
  AbyssalDungeonTab,
  AbyssRaid,
  AbyssRaidStage,
  AbyssRaidTab,
  ChaosDungeon,
  ChaosDungeonStage,
  ChaosDungeonTab,
  Character,
  GuardianRaid,
  GuardianRaidStage,
  GuardianRaidTab,
  JobType,
  LegionRaid,
  LegionRaidStage,
  LegionRaidTab,
  PartyFindPost,
  PartyFindSlot,
  Region,
  Server,
} from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { supportJobs } from "~/utils";

export type FilteredPartyFindPosts = {
  id: PartyFindPost["id"];
  contentType: PartyFindPost["contentType"];
  isPracticeParty: PartyFindPost["isPracticeParty"];
  isReclearParty: PartyFindPost["isReclearParty"];
  title: PartyFindPost["title"];
  startTime: PartyFindPost["startTime"];
  recurring: PartyFindPost["recurring"];
  chaosDungeon: {
    id: ChaosDungeonStage["id"];
    nameEn: ChaosDungeonStage["nameEn"];
    nameKo: ChaosDungeonStage["nameKo"];
    chaosDungeonTab: {
      id: ChaosDungeonTab["id"];
      nameEn: ChaosDungeonTab["nameEn"];
      nameKo: ChaosDungeonTab["nameKo"];
      chaosDungeon: {
        id: ChaosDungeon["id"];
        nameEn: ChaosDungeon["nameEn"];
        nameKo: ChaosDungeon["nameKo"];
      };
    };
  };
  guardianRaid: {
    id: GuardianRaidStage["id"];
    nameEn: GuardianRaidStage["nameEn"];
    nameKo: GuardianRaidStage["nameKo"];
    guardianRaidTab: {
      id: GuardianRaidTab["id"];
      nameEn: GuardianRaidTab["nameEn"];
      nameKo: GuardianRaidTab["nameKo"];
      guardianRaid: {
        id: GuardianRaid["id"];
        nameEn: GuardianRaid["nameEn"];
        nameKo: GuardianRaid["nameKo"];
      };
    };
  };
  abyssalDungeon: {
    id: AbyssalDungeonStage["id"];
    nameEn: AbyssalDungeonStage["nameEn"];
    nameKo: AbyssalDungeonStage["nameKo"];
    abyssalDungeonTab: {
      id: AbyssalDungeonTab["id"];
      nameEn: AbyssalDungeonTab["nameEn"];
      nameKo: AbyssalDungeonTab["nameKo"];
      difficultyNameEn: AbyssalDungeonTab["difficultyNameEn"];
      difficultyNameKo: AbyssalDungeonTab["difficultyNameKo"];
      abyssalDungeon: {
        id: AbyssalDungeon["id"];
        nameEn: AbyssalDungeon["nameEn"];
        nameKo: AbyssalDungeon["nameKo"];
      };
    };
  };
  abyssRaid: {
    id: AbyssRaidStage["id"];
    nameEn: AbyssRaidStage["nameEn"];
    nameKo: AbyssRaidStage["nameKo"];
    abyssRaidTab: {
      id: AbyssRaidTab["id"];
      nameEn: AbyssRaidTab["nameEn"];
      nameKo: AbyssRaidTab["nameKo"];
      abyssRaid: {
        id: AbyssRaid["id"];
        nameEn: AbyssRaid["nameEn"];
        nameKo: AbyssRaid["nameKo"];
      };
    };
  };
  legionRaid: {
    id: LegionRaidStage["id"];
    nameEn: LegionRaidStage["nameEn"];
    nameKo: LegionRaidStage["nameKo"];
    legionRaidTab: {
      id: LegionRaidTab["id"];
      nameEn: LegionRaidTab["nameEn"];
      nameKo: LegionRaidTab["nameKo"];
      difficultyNameEn: LegionRaidTab["difficultyNameEn"];
      difficultyNameKo: LegionRaidTab["difficultyNameKo"];
      legionRaid: {
        id: LegionRaid["id"];
        nameEn: LegionRaid["nameEn"];
        nameKo: LegionRaid["nameKo"];
      };
    };
  };
  server: {
    id: Server["id"];
    region: {
      id: Region["id"];
      name: Region["name"];
      abbr: Region["abbr"];
      shortName: Region["shortName"];
    };
  };
  partyFindSlots: {
    id: PartyFindSlot["id"];
    index: PartyFindSlot["index"];
    jobType: PartyFindSlot["jobType"];
    character: {
      id: Character["id"];
      job: Character["job"];
      itemLevel: Character["itemLevel"];
    };
  }[];
}[];

const getFilteredPartyFindPosts = async (filterClauses: string[]) => {
  return await prisma.$queryRawUnsafe(`
    SELECT
      "PartyFindPost"."id",
      "PartyFindPost"."contentType",
      "PartyFindPost"."isPracticeParty",
      "PartyFindPost"."isReclearParty",
      "PartyFindPost"."title",
      "PartyFindPost"."startTime",
      "PartyFindPost"."recurring",
      json_build_object(
        'id', "ChaosDungeonStage"."id",
        'nameEn', "ChaosDungeonStage"."nameEn",
        'nameKo', "ChaosDungeonStage"."nameKo",
        'chaosDungeonTab', json_build_object(
          'id', "ChaosDungeonTab"."id",
          'nameEn', "ChaosDungeonTab"."nameEn",
          'nameKo', "ChaosDungeonTab"."nameKo",
          'chaosDungeon', json_build_object(
            'id', "ChaosDungeon"."id",
            'nameEn', "ChaosDungeon"."nameEn",
            'nameKo', "ChaosDungeon"."nameKo"
          )
        )
      ) AS "chaosDungeon",
      json_build_object(
        'id', "GuardianRaidStage"."id",
        'nameEn', "GuardianRaidStage"."nameEn",
        'nameKo', "GuardianRaidStage"."nameKo",
        'guardianRaidTab', json_build_object(
          'id', "GuardianRaidTab"."id",
          'nameEn', "GuardianRaidTab"."nameEn",
          'nameKo', "GuardianRaidTab"."nameKo",
          'guardianRaid', json_build_object(
            'id', "GuardianRaid"."id",
            'nameEn', "GuardianRaid"."nameEn",
            'nameKo', "GuardianRaid"."nameKo"
          )
        )
      ) AS "guardianRaid",
      json_build_object(
        'id', "AbyssalDungeonStage"."id",
        'nameEn', "AbyssalDungeonStage"."nameEn",
        'nameKo', "AbyssalDungeonStage"."nameKo",
        'abyssalDungeonTab', json_build_object(
          'id', "AbyssalDungeonTab"."id",
          'nameEn', "AbyssalDungeonTab"."nameEn",
          'nameKo', "AbyssalDungeonTab"."nameKo",
          'difficultyNameEn', "AbyssalDungeonTab"."difficultyNameEn",
          'difficultyNameKo', "AbyssalDungeonTab"."difficultyNameKo",
          'abyssalDungeon', json_build_object(
            'id', "AbyssalDungeon"."id",
            'nameEn', "AbyssalDungeon"."nameEn",
            'nameKo', "AbyssalDungeon"."nameKo"
          )
        )
      ) AS "abyssalDungeon",
      json_build_object(
        'id', "AbyssRaidStage"."id",
        'nameEn', "AbyssRaidStage"."nameEn",
        'nameKo', "AbyssRaidStage"."nameKo",
        'abyssRaidTab', json_build_object(
          'id', "AbyssRaidTab"."id",
          'nameEn', "AbyssRaidTab"."nameEn",
          'nameKo', "AbyssRaidTab"."nameKo",
          'abyssRaid', json_build_object(
            'id', "AbyssRaid"."id",
            'nameEn', "AbyssRaid"."nameEn",
            'nameKo', "AbyssRaid"."nameKo"
          )
        )
      ) AS "abyssRaid",
      json_build_object(
        'id', "LegionRaidStage"."id",
        'nameEn', "LegionRaidStage"."nameEn",
        'nameKo', "LegionRaidStage"."nameKo",
        'legionRaidTab', json_build_object(
          'id', "LegionRaidTab"."id",
          'nameEn', "LegionRaidTab"."nameEn",
          'nameKo', "LegionRaidTab"."nameKo",
          'difficultyNameEn', "LegionRaidTab"."difficultyNameEn",
          'difficultyNameKo', "LegionRaidTab"."difficultyNameKo",
          'legionRaid', json_build_object(
            'id', "LegionRaid"."id",
            'nameEn', "LegionRaid"."nameEn",
            'nameKo', "LegionRaid"."nameKo"
          )
        )
      ) AS "legionRaid",
      json_build_object(
        'id', "Server"."id",
        'region', json_build_object(
          'id', "Region"."id",
          'name', "Region"."name",
          'abbr', "Region"."abbr",
          'shortName', "Region"."shortName"
        )
      ) AS "server",
      (
        SELECT
          json_agg(
            json_build_object(
              'id', "PartyFindSlot"."id",
              'index', "PartyFindSlot"."index",
              'jobType', "PartyFindSlot"."jobType",
              'character', json_build_object(
                'id', "Character"."id",
                'job', "Character"."job",
                'itemLevel', "Character"."itemLevel"
              )
            ) ORDER BY "index" ASC
          )
        FROM
          "public"."PartyFindSlot"
        LEFT JOIN 
          "public"."Character"
          ON
            "Character"."id" = "PartyFindSlot"."characterId"
        WHERE
          "PartyFindSlot"."partyFindPostId" = "PartyFindPost"."id"
      ) AS "partyFindSlots"
    FROM
      "public"."PartyFindPost"

    LEFT JOIN
      "public"."ChaosDungeonStage"
      ON
        "ChaosDungeonStage"."id" = "PartyFindPost"."chaosDungeonId"
    LEFT JOIN
      "public"."ChaosDungeonTab"
      ON
        "ChaosDungeonTab"."id" = "ChaosDungeonStage"."chaosDungeonTabId"
    LEFT JOIN
      "public"."ChaosDungeon"
      ON
        "ChaosDungeon"."id" = "ChaosDungeonTab"."chaosDungeonId"

    LEFT JOIN
      "public"."GuardianRaidStage"
      ON
        "GuardianRaidStage"."id" = "PartyFindPost"."guardianRaidId"
    LEFT JOIN
      "public"."GuardianRaidTab"
      ON
        "GuardianRaidTab"."id" = "GuardianRaidStage"."guardianRaidTabId"
    LEFT JOIN
      "public"."GuardianRaid"
      ON
        "GuardianRaid"."id" = "GuardianRaidTab"."guardianRaidId"

    LEFT JOIN
      "public"."AbyssalDungeonStage"
      ON
        "AbyssalDungeonStage"."id" = "PartyFindPost"."abyssalDungeonId"
    LEFT JOIN
      "public"."AbyssalDungeonTab"
      ON
        "AbyssalDungeonTab"."id" = "AbyssalDungeonStage"."abyssalDungeonTabId"
    LEFT JOIN
      "public"."AbyssalDungeon"
      ON
        "AbyssalDungeon"."id" = "AbyssalDungeonTab"."abyssalDungeonId"

    LEFT JOIN
      "public"."AbyssRaidStage"
      ON
        "AbyssRaidStage"."id" = "PartyFindPost"."abyssRaidId"
    LEFT JOIN
      "public"."AbyssRaidTab"
      ON
        "AbyssRaidTab"."id" = "AbyssRaidStage"."abyssRaidTabId"
    LEFT JOIN
      "public"."AbyssRaid"
      ON
        "AbyssRaid"."id" = "AbyssRaidTab"."abyssRaidId"

    LEFT JOIN
      "public"."LegionRaidStage"
      ON
        "LegionRaidStage"."id" = "PartyFindPost"."legionRaidId"
    LEFT JOIN
      "public"."LegionRaidTab"
      ON
        "LegionRaidTab"."id" = "LegionRaidStage"."legionRaidTabId"
    LEFT JOIN
      "public"."LegionRaid"
      ON
        "LegionRaid"."id" = "LegionRaidTab"."legionRaidId"

    LEFT JOIN
      "public"."Server"
      ON
        "Server"."id" = "PartyFindPost"."serverId"
    LEFT JOIN
      "public"."Region"
      ON
        "Region"."id" = "Server"."regionId"
    ${filterClauses.length > 0 ? `WHERE ${filterClauses.join(" AND ")}` : ""}
    `);
};

export const action: ActionFunction = async ({ request }) => {
  const payload = await request.json();

  const filterClauses: string[] = [];

  const jobFilterList: JobType[] = [];

  if (payload.jobFilterList) {
    payload.jobFilterList.forEach((job: string) => {
      if (supportJobs.includes(job)) {
        if (!jobFilterList.includes("SUPPORT")) jobFilterList.push("SUPPORT");
      } else {
        if (!jobFilterList.includes("DPS")) jobFilterList.push("DPS");
      }
    });
  }

  if (jobFilterList.length > 0) {
    filterClauses.push(`
      EXISTS(
        SELECT
        FROM
          "public"."PartyFindSlot"
        WHERE
          "PartyFindSlot"."partyFindPostId" = "PartyFindPost"."id"
          AND
          "PartyFindSlot"."characterId" IS NULL
          AND
          "PartyFindSlot"."jobType" IN (${jobFilterList
            .map((jobFilter) => `'${jobFilter}'`)
            .join(", ")})
      )`);
  }

  if (payload.contentFilterList && payload.contentFilterList.length > 0) {
    let contentType = undefined;
    let tableBaseName: string | undefined = undefined;

    switch (payload.contentFilterList[0].text.en) {
      case "Chaos Dungeon":
        contentType = "CHAOS_DUNGEON";
        tableBaseName = "ChaosDungeon";
        break;
      case "Guardian Raid":
        contentType = "GUARDIAN_RAID";
        tableBaseName = "GuardianRaid";
        break;
      case "Abyssal Dungeon":
        contentType = "ABYSSAL_DUNGEON";
        tableBaseName = "AbyssalDungeon";
        break;
      case "Abyss Raid":
        contentType = "ABYSS_RAID";
        tableBaseName = "AbyssRaid";
        break;
      case "Legion Raid":
        contentType = "LEGION_RAID";
        tableBaseName = "LegionRaid";
        break;
    }

    if (contentType && tableBaseName) {
      filterClauses.push(
        `("PartyFindPost"."contentType" = '${contentType}' AND ${payload.contentFilterList
          .map(
            (contentFilter: any, index: number) =>
              `"${tableBaseName}${["", "Tab", "Stage"][index]}"."id" = '${
                contentFilter.value
              }'`
          )
          .join(" AND ")})`
      );
    }
  }

  if (payload.regionFilter) {
    filterClauses.push(`"Region"."id" = '${payload.regionFilter}'`);
  }

  if (payload.practicePartyFilter !== payload.farmingPartyFilter) {
    if (payload.practicePartyFilter) {
      filterClauses.push(`"PartyFindPost"."isPracticeParty" = TRUE`);
    } else if (payload.farmingPartyFilter) {
      filterClauses.push(`"PartyFindPost"."isFarmingParty" = TRUE`);
    }
  }

  if (payload.timezone) {
    if (
      payload.dayFilterList &&
      payload.dayFilterList.includes(true) &&
      payload.dayFilterList.includes(false)
    ) {
      filterClauses.push(
        `(${(payload.dayFilterList as boolean[])
          .map((dayFilter, index) => {
            return { dayFilter, index };
          })
          .filter((dayFilter) => dayFilter.dayFilter)
          .map((dayFilter) => {
            return dayFilter.index;
          })
          .map(
            (dayFilter) =>
              `EXTRACT(DOW FROM ("PartyFindPost"."startTime" AT TIME ZONE 'UTC') AT TIME ZONE '${
                payload.timezone
              }') = ${(dayFilter + 1) % 7}`
          )
          .join(" OR ")})`
      );
    }

    const clauses = [
      { value: payload.startTimeFilter, type: "start" },
      { value: payload.endTimeFilter, type: "end" },
    ]
      .filter((e) => e.value !== undefined)
      .map(
        (e) =>
          `(EXTRACT(HOUR FROM ("PartyFindPost"."startTime" AT TIME ZONE 'UTC') AT TIME ZONE '${
            payload.timezone
          }') * 60 + EXTRACT(MINUTE FROM ("PartyFindPost"."startTime" AT TIME ZONE 'UTC') AT TIME ZONE '${
            payload.timezone
          }')) ${e.type === "start" ? ">=" : "<="} ${e.value * 60}`
      );

    if (
      payload.startTimeFilter &&
      payload.endTimeFilter &&
      payload.startTimeFilter > payload.endTimeFilter
    ) {
      filterClauses.push(`(${clauses.join(" OR ")})`);
    } else if (clauses.length > 0) {
      filterClauses.push(`(${clauses.join(" AND ")})`);
    }

    if (payload.yearFilter) {
      filterClauses.push(
        `EXTRACT(YEAR FROM ("PartyFindPost"."startTime" AT TIME ZONE 'UTC') AT TIME ZONE '${payload.timezone}') = ${payload.yearFilter}`
      );
    }

    if (payload.monthFilter) {
      filterClauses.push(
        `EXTRACT(MONTH FROM ("PartyFindPost"."startTime" AT TIME ZONE 'UTC') AT TIME ZONE '${payload.timezone}') = ${payload.monthFilter}`
      );
    }
  }

  return json(await getFilteredPartyFindPosts(filterClauses));
};
