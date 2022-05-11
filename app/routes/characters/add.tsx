import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { Server } from "~/models/server.server";
import type { RootContext } from "~/root";
import { Job } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { addCharacter } from "~/models/character.server";
import { getAllRegions } from "~/models/region.server";
import { getServer } from "~/models/server.server";
import { requireUser } from "~/session.server";

export const handle = {
  i18n: ["common"],
};

type ActionData = {
  errorMessage?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const isPrimary = formData.get("isPrimary") === "on";
  const job = formData.get("job");
  const itemLevel = formData.get("itemLevel");
  const regionId = formData.get("region");
  const serverId = formData.get("server");

  if (
    typeof name !== "string" ||
    typeof job !== "string" ||
    typeof itemLevel !== "string" ||
    typeof regionId !== "string" ||
    typeof serverId !== "string"
  ) {
    return json<ActionData>({
      errorMessage: "invalid input",
    });
  }

  const itemLevelNumber = parseInt(itemLevel);
  const convertedJob = Object.values(Job).find((j) => j === job);

  if (!itemLevelNumber || !convertedJob) {
    return json<ActionData>({
      errorMessage: "invalid input",
    });
  }

  const user = await requireUser(request);
  const server = await getServer({ id: serverId });

  if (!user || !server) {
    return json<ActionData>({
      errorMessage: "invalid input",
    });
  }

  await addCharacter({
    name,
    isPrimary,
    job: convertedJob,
    itemLevel: itemLevelNumber,
    userId: user.id,
    serverId: server.id,
  });

  return redirect("/characters");
};

type LoaderData = {
  regions: Awaited<ReturnType<typeof getAllRegions>>;
  user: Awaited<ReturnType<typeof requireUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    regions: await getAllRegions(),
    user: await requireUser(request),
  });
};

export default function CharactersAddPage() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const { setPathname } = useOutletContext<RootContext>();
  const { t } = useTranslation();

  React.useEffect(() => {
    setPathname("/characters/add");
  });

  const [servers, setServers] = React.useState<Server[]>([]);

  return (
    <Form
      action="/characters/add"
      className="mx-auto flex w-full max-w-lg flex-col gap-2"
      method="post"
    >
      {actionData && actionData.errorMessage && (
        <div>{actionData.errorMessage}</div>
      )}
      <label>{t("characterName")}</label>
      <input
        className="rounded px-4 py-2 text-loa-body"
        name="name"
        type="text"
      />
      <label>{t("primaryCharacter")}</label>
      <input name="isPrimary" type="checkbox" />
      <label>{t("job")}</label>
      <select className="rounded px-4 py-2 text-loa-body" name="job">
        {Object.values(Job).map((job, index) => {
          return (
            <option key={index} value={job}>
              {t(job)}
            </option>
          );
        })}
      </select>
      <label>{t("itemLevel")}</label>
      <input
        className="rounded px-4 py-2 text-loa-body"
        name="itemLevel"
        type="number"
      />
      <label>{t("region")}</label>
      <select
        className="rounded px-4 py-2 text-loa-body"
        name="region"
        onChange={(e) => {
          setServers(
            data.regions.find((r) => r.id === e.target.value)?.servers || []
          );
        }}
      >
        {data.regions.map((region, index) => {
          return (
            <option key={index} value={region.id}>
              {region.name}
            </option>
          );
        })}
      </select>
      <label>{t("server")}</label>
      <select className="rounded px-4 py-2 text-loa-body" name="server">
        {servers.map((server, index) => {
          return (
            <option key={index} value={server.id}>
              {server.name}
            </option>
          );
        })}
      </select>
      <input
        className="mt-8 cursor-pointer rounded bg-loa-button px-4 py-2"
        type="submit"
        value={t("characterSubmit")}
      />
    </Form>
  );
}
