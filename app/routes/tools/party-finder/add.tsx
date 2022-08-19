/*import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { RootContext } from "~/root";
import { JobType, PartyFindContentType } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useOutletContext } from "@remix-run/react";
import * as React from "react";
import { getAbyssRaid } from "~/models/abyss-raid.server";
import {
  getAbyssalDungeon,
  getAbyssalDungeonStage,
} from "~/models/abyssal-dungeon.server";
import { getChaosDungeon } from "~/models/chaos-dungeon.server";
import { getCharacter } from "~/models/character.server";
import { getGuardianRaid } from "~/models/guardian-raid.server";
import { getLegionRaid, getLegionRaidStage } from "~/models/legion-raid.server";
import { addPartyFindPost } from "~/models/party-find-post.server";
import { addPartyFindSlot } from "~/models/party-find-slot.server";
import { requireUser } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);

  const formData = await request.formData();

  const contentType = formData.get("contentType");
  const isPracticeParty = formData.get("isPracticeParty");
  const isFarmingParty = formData.get("isFarmingParty");
  const title = formData.get("title");
  const startTime = formData.get("startTime");
  const recurring = formData.get("recurring");
  const content = formData.get("content");
  const timezoneOffset = formData.get("timezoneOffset");
  const character = formData.get("character");

  if (
    typeof contentType !== "string" ||
    typeof title !== "string" ||
    typeof startTime !== "string" ||
    typeof content !== "string" ||
    typeof timezoneOffset !== "string" ||
    typeof character !== "string"
  ) {
    return redirect("/tools/party-finder");
  }

  const startUtcTime = new Date(parseInt(startTime));
  const convertedContentType = Object.values(PartyFindContentType).find(
    (c) => c === contentType
  );

  if (!convertedContentType) {
    return redirect("/tools/party-finder");
  }

  const _character = await getCharacter({ id: character, userId: user.id });

  if (!_character) return redirect("/tools/party-finder");

  const partyFindPost = await addPartyFindPost({
    contentType: convertedContentType,
    isPracticeParty: isPracticeParty === "on",
    isFarmingParty: isFarmingParty === "on",
    title,
    startTime: startUtcTime,
    recurring: recurring === "on",
    chaosDungeonId:
      contentType === PartyFindContentType.CHAOS_DUNGEON ? content : null,
    guardianRaidId:
      contentType === PartyFindContentType.GUARDIAN_RAID ? content : null,
    abyssalDungeonId:
      contentType === PartyFindContentType.ABYSSAL_DUNGEON ? content : null,
    abyssRaidId:
      contentType === PartyFindContentType.ABYSS_RAID ? content : null,
    legionRaidId:
      contentType === PartyFindContentType.LEGION_RAID ? content : null,
    authorId: user.id,
    serverId: _character.server.id,
  });

  let partySize = 4;

  switch (contentType) {
    case PartyFindContentType.ABYSSAL_DUNGEON:
      const abyssalDungeon = await getAbyssalDungeonStage(content);
      partySize = abyssalDungeon?.groupSize ?? 4;
      break;
    case PartyFindContentType.ABYSS_RAID:
      partySize = 8;
      break;
    case PartyFindContentType.LEGION_RAID:
      const legionRaid = await getLegionRaidStage(content);
      partySize = legionRaid?.groupSize ?? 4;
      break;
  }

  let partyMembers = [];

  partyMembers.push({
    jobType: ["PALADIN", "BARD"].includes(_character.job)
      ? JobType.SUPPORT
      : JobType.DPS,
  });
  partyMembers.push({
    jobType:
      partyMembers[0].jobType === JobType.SUPPORT
        ? JobType.DPS
        : JobType.SUPPORT,
  });
  for (let i = 0; i < 2; i++) {
    partyMembers.push({ jobType: JobType.DPS });
  }

  if (partySize === 8) {
    partyMembers.push({ jobType: JobType.SUPPORT });
    for (let i = 0; i < 3; i++) {
      partyMembers.push({ jobType: JobType.DPS });
    }
  }

  await addPartyFindSlot({
    index: 0,
    jobType: partyMembers[0].jobType,
    isAuthor: true,
    partyFindPostId: partyFindPost.id,
    characterId: _character.id,
  });

  for (let i = 1; i < partySize; i++) {
    await addPartyFindSlot({
      index: i,
      jobType: partyMembers[i].jobType,
      isAuthor: false,
      partyFindPostId: partyFindPost.id,
      characterId: null,
    });
  }

  return redirect("/tools/party-finder/add");
};

type LoaderData = {
  abyssRaid: Awaited<ReturnType<typeof getAbyssRaid>>;
  abyssalDungeon: Awaited<ReturnType<typeof getAbyssalDungeon>>;
  chaosDungeon: Awaited<ReturnType<typeof getChaosDungeon>>;
  guardianRaid: Awaited<ReturnType<typeof getGuardianRaid>>;
  legionRaid: Awaited<ReturnType<typeof getLegionRaid>>;
  user: Awaited<ReturnType<typeof requireUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  if (!process.env.DISCORD_ADMIN_ID) return redirect("/tools/party-finder");

  const user = await requireUser(request);
  if (user.discordId !== process.env.DISCORD_ADMIN_ID)
    return redirect("/tools/party-finder");

  return json<LoaderData>({
    abyssRaid: await getAbyssRaid(),
    abyssalDungeon: await getAbyssalDungeon(),
    chaosDungeon: await getChaosDungeon(),
    guardianRaid: await getGuardianRaid(),
    legionRaid: await getLegionRaid(),
    user,
  });
};

export default function ToolsPartyFinderAddPage() {
  const data = useLoaderData<LoaderData>();
  const { setPathname } = useOutletContext<RootContext>();

  const [tabs, setTabs] = React.useState<any[]>([]);
  const [stages, setStages] = React.useState<any[]>([]);
  const [startTime, setStartTime] = React.useState(0);

  React.useEffect(() => {
    setPathname("/tools/party-finder/add");
  });

  return (
    <Form
      action="/tools/party-finder/add"
      className="mx-auto flex w-full max-w-lg flex-col gap-2"
      method="post"
    >
      <label>Content Type</label>
      <select
        className="rounded px-4 py-2 text-loa-body"
        name="contentType"
        onChange={(e) => {
          switch (e.target.value) {
            case "CHAOS_DUNGEON":
              setTabs(data.chaosDungeon?.tabs ?? []);
              break;
            case "GUARDIAN_RAID":
              setTabs(data.guardianRaid?.tabs ?? []);
              break;
            case "ABYSSAL_DUNGEON":
              setTabs(data.abyssalDungeon?.tabs ?? []);
              break;
            case "ABYSS_RAID":
              setTabs(data.abyssRaid?.tabs ?? []);
              break;
            case "LEGION_RAID":
              setTabs(data.legionRaid?.tabs ?? []);
              break;
          }

          setStages([]);
        }}
      >
        <option value="-">-</option>
        {Object.values(PartyFindContentType).map(
          (partyFindContentType, index) => {
            return (
              <option key={index} value={partyFindContentType}>
                {partyFindContentType}
              </option>
            );
          }
        )}
      </select>
      <label>Is Practice Party</label>
      <input name="isPracticeParty" type="checkbox" />
      <label>Is Farming Party</label>
      <input name="isFarmingParty" type="checkbox" />
      <label>Title</label>
      <input
        className="rounded px-4 py-2 text-loa-body"
        name="title"
        type="text"
      />
      <label>Start Time</label>
      <input
        className="rounded px-4 py-2 text-loa-body"
        onChange={(e) => {
          setStartTime(new Date(e.target.value).getTime());
        }}
        type="datetime-local"
      />
      <input name="startTime" type="hidden" value={startTime} />
      <label>Recurring</label>
      <input name="recurring" type="checkbox" />
      <label>Content Tab</label>
      <select
        className="rounded px-4 py-2 text-loa-body"
        onChange={(e) => {
          setStages(
            e.target.value === "-"
              ? []
              : tabs.find((t) => t.id === e.target.value)?.stages ?? []
          );
        }}
      >
        <option value="-">-</option>
        {tabs.map((tab, index) => {
          return (
            <option key={index} value={tab.id}>
              {`${tab.nameKo}${
                tab.difficultyNameKo ? ` - ${tab.difficultyNameKo}` : ""
              }`}
            </option>
          );
        })}
      </select>
      <label>Content Stage</label>
      <select className="rounded px-4 py-2 text-loa-body" name="content">
        {stages.map((stage, index) => {
          return (
            <option key={index} value={stage.id}>
              {stage.nameKo}
            </option>
          );
        })}
      </select>
      <label>Character</label>
      <select className="rounded px-4 py-2 text-loa-body" name="character">
        {data.user.characters.map((character, index) => {
          return (
            <option key={index} value={character.id}>
              {`${character.name} (${character.server.name})`}
            </option>
          );
        })}
      </select>
      <input
        className="mt-8 cursor-pointer rounded bg-loa-button px-4 py-2"
        type="submit"
        value="SUBMIT"
      />
      <input
        name="timezoneOffset"
        type="hidden"
        value={new Date().getTimezoneOffset()}
      />
    </Form>
  );
}
*/
export default function temp() {
  return <div>Hello, World!</div>;
}
