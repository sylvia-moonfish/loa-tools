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
  LegionRaid,
  LegionRaidStage,
  LegionRaidTab,
  PartyFindApplyState,
  PartyFindPost,
  PartyFindSlot,
  Region,
  Roster,
  Server,
} from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { JobType } from "@prisma/client";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { supportJobs } from "~/utils";

// There's too many filters to manually typecheck the json...
export type ActionBody = {};

// Export the query result type.
// This has to match whatever the raw query is returning.
export type FilteredPartyFindPosts = {
  id: PartyFindPost["id"];
  state: PartyFindPost["state"];
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
  authorId: PartyFindPost["authorId"];
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
    partyFindApplyState: {
      id: PartyFindApplyState["id"];
      character: {
        id: Character["id"];
        job: Character["job"];
        itemLevel: Character["itemLevel"];
        roster: { id: Roster["id"]; userId: Roster["userId"] };
      };
    };
  }[];
}[];

// Template for the raw query.
// We use raw query because timezone calculation is not supported by prisma.
const getFilteredPartyFindPosts = async (filterClauses: string[]) => {
  const query = `
      SELECT
        "PartyFindPost"."id",
        "PartyFindPost"."state",
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
        "PartyFindPost"."authorId",
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
                'partyFindApplyState', json_build_object(
                  'id', "PartyFindApplyState"."id",
                  'character', json_build_object(
                    'id', "Character"."id",
                    'job', "Character"."job",
                    'itemLevel', "Character"."itemLevel",
                    'roster', json_build_object(
                      'id', "Roster"."id",
                      'userId', "Roster"."userId"
                    )
                  )
                )
              ) ORDER BY "index" ASC
            )
          FROM
            "public"."PartyFindSlot"
          LEFT JOIN
            "public"."PartyFindApplyState"
          ON
            "PartyFindApplyState"."partyFindSlotId" = "PartyFindSlot"."id"
          LEFT JOIN
            "public"."Character"
            ON
              "Character"."id" = "PartyFindApplyState"."characterId"
          LEFT JOIN
            "public"."Roster"
          ON
            "Roster"."id" = "Character"."rosterId"
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
      `;

  return await prisma.$queryRawUnsafe(query);
};

// Dynamically generate the "WHERE" clause to append to the raw query.
export const action: ActionFunction = async ({ request }) => {
  const payload = await request.json();

  // Default condition: the post should not be expired and the post should be recruiting.
  const filterClauses: string[] = [
    '"PartyFindPost"."startTime" > now()',
    "\"PartyFindPost\".\"state\" IN ('RECRUITING', 'RERECRUITING')",
  ];

  // Generate job filter conditionals.
  const jobFilterList: JobType[] = [JobType.ANY];

  if (payload.jobFilterList) {
    payload.jobFilterList.forEach((job: string) => {
      if (supportJobs.includes(job)) {
        if (!jobFilterList.includes("SUPPORT")) jobFilterList.push("SUPPORT");
      } else {
        if (!jobFilterList.includes("DPS")) jobFilterList.push("DPS");
      }
    });
  }

  if (jobFilterList.length > 1) {
    filterClauses.push(`
        EXISTS(
          SELECT
          FROM
            "public"."PartyFindSlot"
          WHERE
            "PartyFindSlot"."partyFindPostId" = "PartyFindPost"."id"
            AND
            "PartyFindSlot"."partyFindApplyStateId" IS NULL
            AND
            "PartyFindSlot"."jobType" IN (${jobFilterList
              .map((jobFilter) => `'${jobFilter}'`)
              .join(", ")})
        )`);
  }

  // Generate content type filter conditionals.
  if (payload.contentTypeFilter) {
    let contentType = undefined;
    let tableBaseName: string | undefined = undefined;

    switch (payload.contentTypeFilter.text.en) {
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
      const miniClauses = [`"PartyFindPost"."contentType" = '${contentType}'`];

      if (payload.contentTypeFilter) {
        miniClauses.push(
          `"${tableBaseName}"."id" = '${payload.contentTypeFilter.id}'`
        );
      }

      if (payload.contentTierFilter) {
        miniClauses.push(
          `"${tableBaseName}Tab"."id" = '${payload.contentTierFilter.id}'`
        );
      }

      if (payload.contentStageFilter) {
        miniClauses.push(
          `"${tableBaseName}Stage"."id" = '${payload.contentStageFilter.id}'`
        );
      }

      filterClauses.push(`(${miniClauses.join(" AND ")})`);
    }
  }

  // Generate region filter conditionals.
  if (payload.regionFilter) {
    filterClauses.push(`"Region"."id" = '${payload.regionFilter}'`);
  }

  // Generate goal filter conditionals.
  if (payload.practicePartyFilter !== payload.reclearPartyFilter) {
    if (payload.practicePartyFilter) {
      filterClauses.push(`"PartyFindPost"."isPracticeParty" = TRUE`);
    } else if (payload.reclearPartyFilter) {
      filterClauses.push(`"PartyFindPost"."isReclearParty" = TRUE`);
    }
  }

  // To generate time-related conditionals, we need client's timezone information...
  if (payload.timezone) {
    // Generate day-of-the-week filter conditionals.
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

    // Generate start time filter conditionals.
    const clauses = [
      { value: payload.startTimeFilter, type: "start" },
      { value: payload.endTimeFilter, type: "end" },
    ]
      .filter((e) => typeof e.value !== "undefined")
      .map(
        (e) =>
          `(EXTRACT(HOUR FROM ("PartyFindPost"."startTime" AT TIME ZONE 'UTC') AT TIME ZONE '${
            payload.timezone
          }') * 60 + EXTRACT(MINUTE FROM ("PartyFindPost"."startTime" AT TIME ZONE 'UTC') AT TIME ZONE '${
            payload.timezone
          }')) ${e.type === "start" ? ">=" : "<="} ${e.value * 60}`
      );

    // Generate year and month filter conditionals.
    if (
      typeof payload.startTimeFilter !== "undefined" &&
      typeof payload.endTimeFilter !== "undefined" &&
      payload.startTimeFilter > payload.endTimeFilter
    ) {
      filterClauses.push(`(${clauses.join(" OR ")})`);
    } else if (clauses.length > 0) {
      filterClauses.push(`(${clauses.join(" AND ")})`);
    }

    if (typeof payload.yearFilter !== "undefined") {
      filterClauses.push(
        `EXTRACT(YEAR FROM ("PartyFindPost"."startTime" AT TIME ZONE 'UTC') AT TIME ZONE '${payload.timezone}') = ${payload.yearFilter}`
      );
    }

    if (typeof payload.monthFilter !== "undefined") {
      filterClauses.push(
        `EXTRACT(MONTH FROM ("PartyFindPost"."startTime" AT TIME ZONE 'UTC') AT TIME ZONE '${payload.timezone}') = ${payload.monthFilter}`
      );
    }
  }

  return json(await getFilteredPartyFindPosts(filterClauses));
};
