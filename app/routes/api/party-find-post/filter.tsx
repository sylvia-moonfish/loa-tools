import type {
  Character,
  Content,
  ContentStage,
  ContentTab,
  Engraving,
  EngravingSlot,
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
  contentStage: {
    id: ContentStage["id"];
    nameEn: ContentStage["nameEn"];
    nameKo: ContentStage["nameKo"];
    contentTab: {
      id: ContentTab["id"];
      nameEn: ContentTab["nameEn"];
      nameKo: ContentTab["nameKo"];
      difficultyNameEn?: ContentTab["difficultyNameEn"];
      difficultyNameKo?: ContentTab["difficultyNameKo"];
      content: {
        id: Content["id"];
        nameEn: Content["nameEn"];
        nameKo: Content["nameKo"];
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
        name: Character["name"];
        job: Character["job"];
        itemLevel: Character["itemLevel"];
        engravingSlots: {
          id: EngravingSlot["id"];
          level: EngravingSlot["level"];
          engraving: {
            id: Engraving["id"];
            nameEn: Engraving["nameEn"];
            nameKo: Engraving["nameKo"];
          };
        }[];
        roster: {
          id: Roster["id"];
          level: Roster["level"];
          userId: Roster["userId"];
        };
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
          'id', "ContentStage"."id",
          'nameEn', "ContentStage"."nameEn",
          'nameKo', "ContentStage"."nameKo",
          'contentTab', json_build_object(
            'id', "ContentTab"."id",
            'nameEn', "ContentTab"."nameEn",
            'nameKo', "ContentTab"."nameKo",
            'difficultyNameEn', "ContentTab"."difficultyNameEn",
            'difficultyNameKo', "ContentTab"."difficultyNameKo",
            'content', json_build_object(
              'id', "Content"."id",
              'nameEn', "Content"."nameEn",
              'nameKo', "Content"."nameKo"
            )
          )
        ) AS "contentStage",
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
            json_agg("_PartyFindSlot")
          FROM
            (
              SELECT
                "PartyFindSlot"."id",
                "PartyFindSlot"."index",
                "PartyFindSlot"."jobType",
                (
                  SELECT
                    row_to_json("_PartyFindApplyState")
                  FROM
                    (
                      SELECT
                        "PartyFindApplyState"."id",
                        (
                          SELECT
                            row_to_json("_Character")
                          FROM
                            (
                              SELECT
                                "Character"."id",
                                "Character"."name",
                                "Character"."job",
                                "Character"."itemLevel",
                                (
                                  SELECT
                                    json_agg("_EngravingSlot")
                                  FROM
                                    (
                                      SELECT
                                        "EngravingSlot"."id",
                                        "EngravingSlot". "level",
                                        json_build_object(
                                          'id', "Engraving"."id",
                                          'nameEn', "Engraving"."nameEn",
                                          'nameKo', "Engraving"."nameKo"
                                        ) AS "engraving"
                                      FROM
                                        "public"."EngravingSlot"
                                      LEFT JOIN
                                        "public"."Engraving"
                                      ON
                                        "Engraving"."id" = "EngravingSlot"."engravingId"
                                      WHERE
                                        "EngravingSlot"."characterId" = "Character"."id"
                                      ORDER BY
                                        "EngravingSlot"."index"
                                    ) "_EngravingSlot"
                                ) AS "engravingSlots",
                                json_build_object(
                                  'id', "Roster"."id",
                                  'level', "Roster"."level",
                                  'userId', "Roster"."userId"
                                ) AS "roster"
                              FROM
                                "public"."Character"
                              LEFT JOIN
                                "public"."Roster"
                              ON
                                "Roster"."id" = "Character"."rosterId"
                              WHERE
                                "Character"."id" = "PartyFindApplyState"."characterId"
                            ) "_Character"
                        ) AS "character"
                      FROM
                        "public"."PartyFindApplyState"
                      WHERE
                        "PartyFindApplyState"."partyFindSlotId" = "PartyFindSlot"."id"
                    ) "_PartyFindApplyState"
                ) AS "partyFindApplyState"
              FROM
                "public"."PartyFindSlot"
              WHERE
                "PartyFindSlot"."partyFindPostId" = "PartyFindPost"."id"
              ORDER BY
                "PartyFindSlot"."index" ASC
            ) "_PartyFindSlot"
        ) AS "partyFindSlots"
      FROM
        "public"."PartyFindPost"
  
      LEFT JOIN
        "public"."ContentStage"
        ON
          "ContentStage"."id" = "PartyFindPost"."contentStageId"
      LEFT JOIN
        "public"."ContentTab"
        ON
          "ContentTab"."id" = "ContentStage"."contentTabId"
      LEFT JOIN
        "public"."Content"
        ON
          "Content"."id" = "ContentTab"."contentId"
  
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

    switch (payload.contentTypeFilter.text.en) {
      case "Chaos Dungeon":
        contentType = "CHAOS_DUNGEON";
        break;
      case "Guardian Raid":
        contentType = "GUARDIAN_RAID";
        break;
      case "Abyssal Dungeon":
        contentType = "ABYSSAL_DUNGEON";
        break;
      case "Abyss Raid":
        contentType = "ABYSS_RAID";
        break;
      case "Legion Raid":
        contentType = "LEGION_RAID";
        break;
    }

    if (contentType) {
      const miniClauses = [`"PartyFindPost"."contentType" = '${contentType}'`];

      if (payload.contentTypeFilter) {
        miniClauses.push(`"Content"."id" = '${payload.contentTypeFilter.id}'`);
      }

      if (payload.contentTierFilter) {
        miniClauses.push(
          `"ContentTab"."id" = '${payload.contentTierFilter.id}'`
        );
      }

      if (payload.contentStageFilter) {
        miniClauses.push(
          `"ContentStage"."id" = '${payload.contentStageFilter.id}'`
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
