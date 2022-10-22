import type { User } from "@prisma/client";
import { Job, JobType, PartyFindContentType } from "@prisma/client";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

export const putFromAndToOnRight = ["ko"];

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.id === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");

  if (!data || !isUser(data.user)) return undefined;

  return data.user;
}

export function getItemFromArray<T>(id: string, array: T[]): T | undefined {
  const index = parseInt(id);
  return index >= 0 && index < array.length ? array[index] : undefined;
}

export const elapsedTimeSpaced = ["en"];

export function printTimeElapsed(date: Date): string[] {
  const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (diff <= 0) return [];
  if (diff < 60) return [diff.toString(), "second"];
  if (diff < 60 * 60) return [Math.floor(diff / 60).toString(), "minute"];
  if (diff < 60 * 60 * 24)
    return [Math.floor(diff / 60 / 60).toString(), "hour"];
  if (diff < 60 * 60 * 24 * 7)
    return [Math.floor(diff / 60 / 60 / 24).toString(), "day"];
  if (diff < 60 * 60 * 24 * 7 * 4)
    return [Math.floor(diff / 60 / 60 / 24 / 7).toString(), "week"];
  if (diff < 60 * 60 * 24 * 365)
    return [Math.floor(diff / 60 / 60 / 24 / 30).toString(), "month"];
  else return [Math.floor(diff / 60 / 60 / 24 / 365).toString(), "year"];
}

export function printTime(hour: number, minute: number): string {
  return `${
    hour === 12
      ? 12
      : (hour % 12).toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })
  }:${minute.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })} ${hour >= 12 ? "PM" : "AM"}`;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();

  if (!maybeUser)
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );

  return maybeUser;
}

export function generateDiscordAvatarSrc(
  discordId: string,
  hash: string | undefined
) {
  return hash
    ? `https://cdn.discordapp.com/avatars/${discordId}/${hash}.${
        hash.substring(0, 2) === "a_" ? "gif" : "png"
      }`
    : "";
}

export function generateProperLocaleDateString(locale: string, date: Date) {
  const yearString = date
    .getFullYear()
    .toLocaleString("en-US", { minimumIntegerDigits: 4, useGrouping: false });
  const monthString = (date.getMonth() + 1).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const dayString = date
    .getDate()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

  switch (locale) {
    case "en":
      return `${dayString}/${monthString}/${yearString}`;
    case "ko":
      return `${yearString}/${monthString}/${dayString}`;
  }
}

export function getContentByType(partyFindPost: any) {
  switch (partyFindPost?.contentType) {
    case PartyFindContentType.CHAOS_DUNGEON:
      return {
        contentStage: partyFindPost?.chaosDungeon,
        contentTab: partyFindPost?.chaosDungeon?.chaosDungeonTab,
        contentType: partyFindPost?.chaosDungeon?.chaosDungeonTab?.chaosDungeon,
      };
    case PartyFindContentType.GUARDIAN_RAID:
      return {
        contentStage: partyFindPost?.guardianRaid,
        contentTab: partyFindPost?.guardianRaid?.guardianRaidTab,
        contentType: partyFindPost?.guardianRaid?.guardianRaidTab?.guardianRaid,
      };
    case PartyFindContentType.ABYSSAL_DUNGEON:
      return {
        contentStage: partyFindPost?.abyssalDungeon,
        contentTab: partyFindPost?.abyssalDungeon?.abyssalDungeonTab,
        contentType:
          partyFindPost?.abyssalDungeon?.abyssalDungeonTab?.abyssalDungeon,
      };
    case PartyFindContentType.ABYSS_RAID:
      return {
        contentStage: partyFindPost?.abyssRaid,
        contentTab: partyFindPost?.abyssRaid?.abyssRaidTab,
        contentType: partyFindPost?.abyssRaid?.abyssRaidTab?.abyssRaid,
      };
    case PartyFindContentType.LEGION_RAID:
      return {
        contentStage: partyFindPost?.legionRaid,
        contentTab: partyFindPost?.legionRaid?.legionRaidTab,
        contentType: partyFindPost?.legionRaid?.legionRaidTab?.legionRaid,
      };
  }
}

export function generateJobIconPath(job: Job) {
  switch (job) {
    case Job.DESTROYER:
      return "/icons/job_icons/destroyer.png";
    case Job.GUNLANCER:
      return "/icons/job_icons/warlord.png";
    case Job.BERSERKER:
      return "/icons/job_icons/berserker.png";
    case Job.PALADIN:
      return "/icons/job_icons/holyknight.png";

    case Job.STRIKER:
      return "/icons/job_icons/striker.png";

    case Job.WARDANCER:
      return "/icons/job_icons/battlemaster.png";
    case Job.SCRAPPER:
      return "/icons/job_icons/infighter.png";
    case Job.SOULFIST:
      return "/icons/job_icons/soulmaster.png";
    case Job.GLAIVIER:
      return "/icons/job_icons/lancemaster.png";

    case Job.DEADEYE:
      return "/icons/job_icons/devilhunter.png";
    case Job.ARTILLERIST:
      return "/icons/job_icons/blaster.png";
    case Job.SHARPSHOOTER:
      return "/icons/job_icons/hawkeye.png";

    case Job.GUNSLINGER:
      return "/icons/job_icons/gunslinger.png";

    case Job.BARD:
      return "/icons/job_icons/bard.png";
    case Job.ARCANIST:
      return "/icons/job_icons/arcana.png";
    case Job.SORCERESS:
      return "/icons/job_icons/sorceress.png";

    case Job.DEATHBLADE:
      return "/icons/job_icons/blade.png";
    case Job.SHADOWHUNTER:
      return "/icons/job_icons/demonic.png";
  }
}

export const supportJobs = ["PALADIN", "BARD"];

export function getJobTypeFromJob(job: Job) {
  return supportJobs.includes(job) ? JobType.SUPPORT : JobType.DPS;
}

export function validateText(
  required: boolean,
  text: string,
  max?: number,
  min?: number
) {
  if (text.length === 0) return !required;

  return (
    (typeof max === "undefined" || text.length <= max) &&
    (typeof min === "undefined" || text.length >= min)
  );
}

export function validateInt(
  required: boolean,
  text: string,
  max?: number,
  min?: number
) {
  if (text.length === 0) return !required;

  return (
    (typeof max === "undefined" || parseInt(text) <= max) &&
    (typeof min === "undefined" || parseInt(text) >= min)
  );
}

export function validateFloat(
  required: boolean,
  text: string,
  max?: number,
  min?: number
) {
  if (text.length === 0) return !required;

  return (
    (typeof max === "undefined" || parseFloat(text) <= max) &&
    (typeof min === "undefined" || parseFloat(text) >= min)
  );
}

export function validateDateString(date: string) {
  return date.length > 0 && !Number.isNaN(new Date(date).getTime());
}

export function convertStringToInt(
  value: string | undefined
): number | undefined {
  if (typeof value === "undefined") return undefined;
  const parsed = parseInt(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function getColorCodeFromDifficulty(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "normal":
      return "text-loa-green";
    case "hard":
      return "text-loa-red";
    case "inferno":
      return "text-loa-party-leader-star";
  }

  return "";
}
