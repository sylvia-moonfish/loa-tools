import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { ActionBody, ActionData } from "~/routes/api/character/add";
import type { LocaleType } from "~/i18n";
import { Job } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/button";
import Checkbox from "~/components/checkbox";
import Dropdown, { ItemType } from "~/components/dropdown";
import Input from "~/components/input";
import SearchableDropdown from "~/components/searchable-dropdown";
import { prisma } from "~/db.server";
import i18next from "~/i18next.server";
import { requireUser } from "~/session.server";
import {
  generateJobIconPath,
  validateFloat,
  validateInt,
  validateText,
} from "~/utils";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

type LoaderData = {
  engravings: Awaited<ReturnType<typeof getEngravings>>;
  locale: LocaleType;
  regions: Awaited<ReturnType<typeof getRegions>>;
  title: string;
  user: Awaited<ReturnType<typeof getUser>>;
};

const getEngravings = async () => {
  return await prisma.engraving.findMany({
    select: { id: true, nameEn: true, nameKo: true, iconPath: true, job: true },
  });
};

const getRegions = async () => {
  return await prisma.region.findMany({
    select: {
      id: true,
      name: true,
      shortName: true,
      servers: { select: { id: true, name: true } },
    },
  });
};

const getUser = async (id: string, redirectTo: string) => {
  const user = await prisma.user.findFirst({
    where: { id },
    select: {
      id: true,
      rosters: {
        select: {
          id: true,
          level: true,
          stronghold: { select: { id: true, name: true } },
          serverId: true,
        },
      },
    },
  });

  if (!user)
    throw redirect(
      `/login?${new URLSearchParams([["redirectTo", redirectTo]])}`
    );

  return user;
};

export const loader: LoaderFunction = async ({ request }) => {
  const t = await i18next.getFixedT(request, "root");
  const user = await requireUser(request);

  return json<LoaderData>({
    engravings: await getEngravings(),
    locale: (await i18next.getLocale(request)) as LocaleType,
    regions: await getRegions(),
    title: `${t("addCharacterTitle")} | ${t("shortTitle")}`,
    user: await getUser(user.id, new URL(request.url).pathname),
  });
};

let abortController = new AbortController();

export default function CharacterAddPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();

  const [jobs, setJobs] = React.useState<ItemType[]>(
    Object.values(Job).map((job) => ({
      i18n: { keyword: job, namespace: "dictionary\\job" },
      id: job,
    }))
  );
  const [job, setJob] = React.useState<ItemType | undefined>(undefined);
  const [jobIconPath, setJobIconPath] = React.useState<string | undefined>(
    undefined
  );
  const [characterName, setCharacterName] = React.useState("");
  const [region, setRegion] = React.useState<ItemType | undefined>(undefined);
  const [servers, setServers] = React.useState<ItemType[]>([]);
  const [server, setServer] = React.useState<ItemType | undefined>(undefined);
  const [isMainCharacter, setIsMainCharacter] = React.useState(false);

  const [rosterLevel, setRosterLevel] = React.useState("");
  const [combatLevel, setCombatLevel] = React.useState("");
  const [itemLevel, setItemLevel] = React.useState("");
  const [guild, setGuild] = React.useState("");
  const [stronghold, setStronghold] = React.useState("");

  const [crit, setCrit] = React.useState("");
  const [specialization, setSpecialization] = React.useState("");
  const [domination, setDomination] = React.useState("");
  const [swiftness, setSwiftness] = React.useState("");
  const [endurance, setEndurance] = React.useState("");
  const [expertise, setExpertise] = React.useState("");

  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(false);

  const _engravingPanel: {
    engraving: ItemType | undefined;
    items: ItemType[];
    level: string;
  }[] = [];

  for (let i = 0; i < 8; i++) {
    _engravingPanel.push({
      engraving: undefined,
      items: data.engravings
        .filter((e) => !e.job)
        .map((e) => ({ id: e.id, text: { en: e.nameEn, ko: e.nameKo } }))
        .sort((a, b) => a.text[data.locale].localeCompare(b.text[data.locale])),
      level: "",
    });
  }

  const [engravingPanel, setEngravingPanel] = React.useState(_engravingPanel);

  const filterItems = (text: string, index: number) => {
    const tempArray = [...engravingPanel];

    tempArray[index].items = getFilteredItems(text);

    setEngravingPanel(tempArray);
  };

  const getFilteredItems = (text: string) => {
    const itemsArray = [];

    if (job) {
      itemsArray.push(data.engravings.filter((e) => e.job == job.id));
    }

    itemsArray.push(data.engravings.filter((e) => !e.job));

    return itemsArray
      .map((i) =>
        i.map((_i) => ({
          id: _i.id,
          text: { en: _i.nameEn, ko: _i.nameKo },
        }))
      )
      .map((i) =>
        i
          .filter((_i) =>
            _i.text[data.locale].toLowerCase().includes(text.toLowerCase())
          )
          .sort((a, b) =>
            a.text[data.locale].localeCompare(b.text[data.locale])
          )
      )
      .flat();
  };

  const validateDropdownSelection = (item: ItemType | undefined) => {
    return typeof item !== "undefined";
  };

  const validateForm = () => {
    return (
      validateDropdownSelection(job) &&
      validateText(true, characterName, 16, 2) &&
      validateDropdownSelection(region) &&
      validateDropdownSelection(server) &&
      validateInt(true, rosterLevel, 300, 1) &&
      validateInt(true, combatLevel, 60, 1) &&
      validateFloat(true, itemLevel, 2000, 0) &&
      validateText(false, guild, 20) &&
      validateText(false, stronghold, 20) &&
      validateInt(true, crit, undefined, 0) &&
      validateInt(true, specialization, undefined, 0) &&
      validateInt(true, domination, undefined, 0) &&
      validateInt(true, swiftness, undefined, 0) &&
      validateInt(true, endurance, undefined, 0) &&
      validateInt(true, expertise, undefined, 0)
    );
  };

  React.useEffect(() => {
    if (job) {
      const filteredItems = getFilteredItems("");
      const tempArray = [...engravingPanel];

      for (let i = 0; i < tempArray.length; i++) {
        tempArray[i].items = filteredItems;

        if (
          tempArray[i].engraving &&
          !filteredItems
            .map((i) => i.id)
            .includes(tempArray[i].engraving?.id ?? "")
        ) {
          tempArray[i].engraving = undefined;
          tempArray[i].level = "";
        }
      }

      setEngravingPanel(tempArray);
    }
  }, [job]);

  React.useEffect(() => {
    if (server) {
      const roster = data.user.rosters.find((r) => r.serverId === server.id);

      if (roster) {
        setRosterLevel(roster.level.toString());
        setStronghold(roster.stronghold ? roster.stronghold.name : "");
        return;
      }
    }

    setRosterLevel("");
    setStronghold("");
  }, [server]);

  return (
    <div className="mx-auto my-[2.5rem] flex w-[46.875rem] flex-col">
      {typeof errorMessage === "string" && (
        <div className="mb-[2.5rem] flex items-center justify-center whitespace-normal rounded-[0.9375rem] bg-loa-red p-[1.25rem]">
          {t(errorMessage, { ns: "error-messages" })}
        </div>
      )}
      <div className="flex">
        <Button
          onClick={() => {
            navigate(-1);
          }}
          style={{
            additionalClass:
              "w-[1.875rem] h-[1.875rem] rounded-full flex items-center justify-center",
            backgroundColorClass: "bg-loa-button",
            cornerRadius: "",
            fontSize: "",
            fontWeight: "",
            lineHeight: "",
            px: "",
            py: "",
            textColorClass: "",
          }}
          text={
            <span className="material-symbols-outlined text-[0.9375rem]">
              navigate_before
            </span>
          }
        />
      </div>
      <div className="mt-[1.25rem] flex items-start">
        <div
          className="h-[4.0625rem] w-[4.0625rem] rounded-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: jobIconPath ? `url('${jobIconPath}')` : "",
          }}
        ></div>
        <div className="ml-[1.5625rem] flex w-[27.9375rem] flex-col gap-[0.5rem]">
          <div className="flex gap-[0.3125rem]">
            <SearchableDropdown
              invalid={!validateDropdownSelection(job)}
              items={jobs}
              locale={data.locale}
              onFilter={(text) => {
                setJobs(
                  Object.values(Job)
                    .map((job) => ({
                      i18n: { keyword: job, namespace: "dictionary\\job" },
                      id: job,
                    }))
                    .filter((j) =>
                      t(j.i18n.keyword, { ns: j.i18n.namespace })
                        .toLowerCase()
                        .includes(text.toLowerCase())
                    )
                );
              }}
              onSelect={(item) => {
                if (
                  item &&
                  item.id &&
                  Object.values(Job).includes(item.id as Job)
                ) {
                  setJob(item);
                  setJobIconPath(
                    generateJobIconPath(item.id as Job) ?? undefined
                  );
                }
              }}
              placeholder={t("selectJob", { ns: "routes\\character\\add" })}
              selected={job}
              style={{
                panel: {
                  alignment: "center",
                  anchor: "center",
                  backgroundColorClass: "bg-loa-panel",
                  borderColorClass: "border-loa-button",
                  borderWidth: "0.075rem",
                  cornerRadius: "0.9375rem",
                  item: {
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    lineHeight: "1.25rem",
                    px: "0.625rem",
                    py: "0.3125rem",
                    separator: {
                      colorClass: "border-loa-button",
                      margin: "0.3125rem",
                    },
                  },
                  margin: 0.25,
                  maxHeight: 15,
                },
                selectInput: {
                  additionalClass: "w-[8.37rem]",
                  backgroundColorClass: "bg-loa-inactive",
                  cornerRadius: "0.9375rem",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  inactiveTextColorClass: "text-loa-grey",
                  invalid: {
                    outlineColorClass: "outline-loa-red",
                    outlineWidth: "0.15rem",
                  },
                  lineHeight: "1.25rem",
                  px: "0.625rem",
                  py: "0.3125rem",
                },
              }}
            />
            <Input
              invalid={!validateText(true, characterName, 16, 2)}
              onChange={(text) => {
                if (validateText(false, text, 16)) {
                  setCharacterName(text);
                }
              }}
              placeholder={t("enterName", { ns: "routes\\character\\add" })}
              style={{
                additionalClass: "flex-grow",
                backgroundColorClass: "bg-loa-inactive",
                cornerRadius: "0.9375rem",
                fontSize: "0.75rem",
                fontWeight: "500",
                inactiveTextColorClass: "text-loa-grey",
                invalid: {
                  outlineColorClass: "outline-loa-red",
                  outlineWidth: "0.15rem",
                },
                lineHeight: "1.25rem",
                px: "0.625rem",
                py: "0.3125rem",
                textColorClass: "text-loa-white",
              }}
              text={characterName}
              type="text"
            />
          </div>
          <div className="flex gap-[0.3125rem]">
            <Dropdown
              invalid={!validateDropdownSelection(region)}
              items={data.regions.map((r) => ({
                id: r.id,
                text: { en: r.name, ko: r.name },
              }))}
              locale={data.locale}
              onChange={(item) => {
                setRegion(item);

                if (item && item.id) {
                  const region = data.regions.find((r) => r.id === item.id);

                  if (region) {
                    setServer(undefined);
                    setServers(
                      region.servers.map((s) => ({
                        id: s.id,
                        text: { en: s.name, ko: s.name },
                      }))
                    );
                  }
                }
              }}
              placeholder={t("selectRegion", { ns: "routes\\character\\add" })}
              selected={region}
              style={{
                panel: {
                  alignment: "center",
                  anchor: "center",
                  backgroundColorClass: "bg-loa-panel",
                  borderColorClass: "border-loa-button",
                  borderWidth: "0.075rem",
                  cornerRadius: "0.9375rem",
                  item: {
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    lineHeight: "1.25rem",
                    px: "0.625rem",
                    py: "0.3125rem",
                    separator: {
                      colorClass: "border-loa-button",
                      margin: "0.3125rem",
                    },
                  },
                  margin: 0.25,
                  maxHeight: 15,
                },
                selectButton: {
                  backgroundColorClass: "bg-loa-inactive",
                  cornerRadius: "0.9375rem",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  gap: "0.625rem",
                  inactiveTextColorClass: "text-loa-grey",
                  invalid: {
                    outlineColorClass: "outline-loa-red",
                    outlineWidth: "0.15rem",
                  },
                  lineHeight: "1.25rem",
                  px: "0.625rem",
                  py: "0.3125rem",
                },
              }}
            />
            <Dropdown
              invalid={!validateDropdownSelection(server)}
              items={servers}
              locale={data.locale}
              onChange={(item) => {
                setServer(item);
              }}
              placeholder={t("selectServer", { ns: "routes\\character\\add" })}
              selected={server}
              style={{
                panel: {
                  alignment: "center",
                  anchor: "center",
                  backgroundColorClass: "bg-loa-panel",
                  borderColorClass: "border-loa-button",
                  borderWidth: "0.075rem",
                  cornerRadius: "0.9375rem",
                  item: {
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    lineHeight: "1.25rem",
                    px: "0.625rem",
                    py: "0.3125rem",
                    separator: {
                      colorClass: "border-loa-button",
                      margin: "0.3125rem",
                    },
                  },
                  margin: 0.25,
                  maxHeight: 15,
                },
                selectButton: {
                  backgroundColorClass: "bg-loa-inactive",
                  cornerRadius: "0.9375rem",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  gap: "0.625rem",
                  inactiveTextColorClass: "text-loa-grey",
                  invalid: {
                    outlineColorClass: "outline-loa-red",
                    outlineWidth: "0.15rem",
                  },
                  lineHeight: "1.25rem",
                  px: "0.625rem",
                  py: "0.3125rem",
                },
              }}
            />
            <Checkbox
              isChecked={isMainCharacter}
              onClick={() => {
                setIsMainCharacter(!isMainCharacter);
              }}
              style={{
                gap: "0.375rem",
                box: {
                  backgroundColorClass: "bg-loa-white",
                  checkColorClass: "text-loa-body",
                  size: 1.125,
                },
                text: {
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  lineHeight: "1.25rem",
                },
              }}
              text={t("mainCharacter", { ns: "routes\\character\\add" })}
            />
          </div>
        </div>
      </div>
      <div className="mt-[1.25rem] flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
        <div className="text-[1.25rem] font-[700] leading-[1.5625rem]">
          {t("basicInfo", { ns: "routes\\character\\id" })}
        </div>
        <div
          style={{
            columnGap: "2.8125rem",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          }}
        >
          <div
            style={{
              columnGap: "2.8125rem",
              display: "grid",
              gridTemplateColumns: "max-content auto",
              rowGap: "0.9375rem",
            }}
          >
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("rosterLevel", { ns: "routes\\character\\id" })}
            </div>
            <Input
              invalid={!validateInt(true, rosterLevel, 300, 1)}
              onChange={(text) => {
                if (validateInt(false, text, 300, 1)) {
                  setRosterLevel(parseInt(text).toString());
                }
              }}
              style={{
                additionalClass: "w-full",
                backgroundColorClass: "bg-loa-inactive",
                cornerRadius: "0.9375rem",
                fontSize: "0.75rem",
                fontWeight: "500",
                inactiveTextColorClass: "text-loa-grey",
                invalid: {
                  outlineColorClass: "outline-loa-red",
                  outlineWidth: "0.15rem",
                },
                lineHeight: "1.25rem",
                px: "0.625rem",
                py: "0.3125rem",
                textColorClass: "text-loa-white",
              }}
              text={rosterLevel}
              type="number"
            />
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("combatLevel", { ns: "routes\\character\\id" })}
            </div>
            <Input
              invalid={!validateInt(true, combatLevel, 60, 1)}
              onChange={(text) => {
                if (validateInt(false, text, 60, 1)) {
                  setCombatLevel(parseInt(text).toString());
                }
              }}
              style={{
                additionalClass: "w-full",
                backgroundColorClass: "bg-loa-inactive",
                cornerRadius: "0.9375rem",
                fontSize: "0.75rem",
                fontWeight: "500",
                inactiveTextColorClass: "text-loa-grey",
                invalid: {
                  outlineColorClass: "outline-loa-red",
                  outlineWidth: "0.15rem",
                },
                lineHeight: "1.25rem",
                px: "0.625rem",
                py: "0.3125rem",
                textColorClass: "text-loa-white",
              }}
              text={combatLevel}
              type="number"
            />
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("itemLevel", { ns: "routes\\character\\id" })}
            </div>
            <Input
              invalid={!validateFloat(true, itemLevel, 2000, 0)}
              onChange={(text) => {
                if (validateFloat(false, text, 2000, 0)) {
                  setItemLevel(parseFloat(text).toString());
                }
              }}
              style={{
                additionalClass: "w-full",
                backgroundColorClass: "bg-loa-inactive",
                cornerRadius: "0.9375rem",
                fontSize: "0.75rem",
                fontWeight: "500",
                inactiveTextColorClass: "text-loa-grey",
                invalid: {
                  outlineColorClass: "outline-loa-red",
                  outlineWidth: "0.15rem",
                },
                lineHeight: "1.25rem",
                px: "0.625rem",
                py: "0.3125rem",
                textColorClass: "text-loa-white",
              }}
              text={itemLevel}
              type="number"
            />
          </div>
          <div
            style={{
              columnGap: "2.8125rem",
              display: "grid",
              gridTemplateColumns: "max-content auto",
              rowGap: "0.9375rem",
            }}
          >
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("guild", { ns: "routes\\character\\id" })}
            </div>
            <Input
              invalid={!validateText(false, guild, 20)}
              onChange={(text) => {
                if (validateText(false, text, 20)) {
                  setGuild(text);
                }
              }}
              style={{
                additionalClass: "w-full",
                backgroundColorClass: "bg-loa-inactive",
                cornerRadius: "0.9375rem",
                fontSize: "0.75rem",
                fontWeight: "500",
                inactiveTextColorClass: "text-loa-grey",
                invalid: {
                  outlineColorClass: "outline-loa-red",
                  outlineWidth: "0.15rem",
                },
                lineHeight: "1.25rem",
                px: "0.625rem",
                py: "0.3125rem",
                textColorClass: "text-loa-white",
              }}
              text={guild}
              type="text"
            />
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("pvp", { ns: "routes\\character\\id" })}
            </div>
            <div></div>
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("stronghold", { ns: "routes\\character\\id" })}
            </div>
            <Input
              invalid={!validateText(false, stronghold, 20)}
              onChange={(text) => {
                if (validateText(false, text, 20)) {
                  setStronghold(text);
                }
              }}
              style={{
                additionalClass: "w-full",
                backgroundColorClass: "bg-loa-inactive",
                cornerRadius: "0.9375rem",
                fontSize: "0.75rem",
                fontWeight: "500",
                inactiveTextColorClass: "text-loa-grey",
                invalid: {
                  outlineColorClass: "outline-loa-red",
                  outlineWidth: "0.15rem",
                },
                lineHeight: "1.25rem",
                px: "0.625rem",
                py: "0.3125rem",
                textColorClass: "text-loa-white",
              }}
              text={stronghold}
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="mt-[1.25rem] flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
        <div className="text-[1.25rem] font-[700] leading-[1.5625rem]">
          {t("combatStats", { ns: "routes\\character\\id" })}
        </div>
        <div
          style={{
            columnGap: "2.8125rem",
            display: "grid",
            gridTemplateColumns: "max-content auto max-content auto",
            rowGap: "0.9375rem",
          }}
        >
          <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
            {t("crit", { ns: "routes\\character\\id" })}
          </div>
          <Input
            invalid={!validateInt(true, crit, 3000, 0)}
            onChange={(text) => {
              if (validateInt(false, text, 3000, 0)) {
                setCrit(parseInt(text).toString());
              }
            }}
            style={{
              additionalClass: "w-full",
              backgroundColorClass: "bg-loa-inactive",
              cornerRadius: "0.9375rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              inactiveTextColorClass: "text-loa-grey",
              invalid: {
                outlineColorClass: "outline-loa-red",
                outlineWidth: "0.15rem",
              },
              lineHeight: "1.25rem",
              px: "0.625rem",
              py: "0.3125rem",
              textColorClass: "text-loa-white",
            }}
            text={crit}
            type="number"
          />
          <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
            {t("specialization", { ns: "routes\\character\\id" })}
          </div>
          <Input
            invalid={!validateInt(true, specialization, 3000, 0)}
            onChange={(text) => {
              if (validateInt(false, text, 3000, 0)) {
                setSpecialization(parseInt(text).toString());
              }
            }}
            style={{
              additionalClass: "w-full",
              backgroundColorClass: "bg-loa-inactive",
              cornerRadius: "0.9375rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              inactiveTextColorClass: "text-loa-grey",
              invalid: {
                outlineColorClass: "outline-loa-red",
                outlineWidth: "0.15rem",
              },
              lineHeight: "1.25rem",
              px: "0.625rem",
              py: "0.3125rem",
              textColorClass: "text-loa-white",
            }}
            text={specialization}
            type="number"
          />
          <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
            {t("domination", { ns: "routes\\character\\id" })}
          </div>
          <Input
            invalid={!validateInt(true, domination, 3000, 0)}
            onChange={(text) => {
              if (validateInt(false, text, 3000, 0)) {
                setDomination(parseInt(text).toString());
              }
            }}
            style={{
              additionalClass: "w-full",
              backgroundColorClass: "bg-loa-inactive",
              cornerRadius: "0.9375rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              inactiveTextColorClass: "text-loa-grey",
              invalid: {
                outlineColorClass: "outline-loa-red",
                outlineWidth: "0.15rem",
              },
              lineHeight: "1.25rem",
              px: "0.625rem",
              py: "0.3125rem",
              textColorClass: "text-loa-white",
            }}
            text={domination}
            type="number"
          />
          <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
            {t("swiftness", { ns: "routes\\character\\id" })}
          </div>
          <Input
            invalid={!validateInt(true, swiftness, 3000, 0)}
            onChange={(text) => {
              if (validateInt(false, text, 3000, 0)) {
                setSwiftness(parseInt(text).toString());
              }
            }}
            style={{
              additionalClass: "w-full",
              backgroundColorClass: "bg-loa-inactive",
              cornerRadius: "0.9375rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              inactiveTextColorClass: "text-loa-grey",
              invalid: {
                outlineColorClass: "outline-loa-red",
                outlineWidth: "0.15rem",
              },
              lineHeight: "1.25rem",
              px: "0.625rem",
              py: "0.3125rem",
              textColorClass: "text-loa-white",
            }}
            text={swiftness}
            type="number"
          />
          <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
            {t("endurance", { ns: "routes\\character\\id" })}
          </div>
          <Input
            invalid={!validateInt(true, endurance, 3000, 0)}
            onChange={(text) => {
              if (validateInt(false, text, 3000, 0)) {
                setEndurance(parseInt(text).toString());
              }
            }}
            style={{
              additionalClass: "w-full",
              backgroundColorClass: "bg-loa-inactive",
              cornerRadius: "0.9375rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              inactiveTextColorClass: "text-loa-grey",
              invalid: {
                outlineColorClass: "outline-loa-red",
                outlineWidth: "0.15rem",
              },
              lineHeight: "1.25rem",
              px: "0.625rem",
              py: "0.3125rem",
              textColorClass: "text-loa-white",
            }}
            text={endurance}
            type="number"
          />
          <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
            {t("expertise", { ns: "routes\\character\\id" })}
          </div>
          <Input
            invalid={!validateInt(true, expertise, 3000, 0)}
            onChange={(text) => {
              if (validateInt(false, text, 3000, 0)) {
                setExpertise(parseInt(text).toString());
              }
            }}
            style={{
              additionalClass: "w-full",
              backgroundColorClass: "bg-loa-inactive",
              cornerRadius: "0.9375rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              inactiveTextColorClass: "text-loa-grey",
              invalid: {
                outlineColorClass: "outline-loa-red",
                outlineWidth: "0.15rem",
              },
              lineHeight: "1.25rem",
              px: "0.625rem",
              py: "0.3125rem",
              textColorClass: "text-loa-white",
            }}
            text={expertise}
            type="number"
          />
        </div>
      </div>

      <div className="mt-[1.25rem] flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
        <div className="text-[1.25rem] font-[700] leading-[1.5625rem]">
          {t("engravings", { ns: "routes\\character\\id" })}
        </div>
        <div
          style={{
            columnGap: "3.375rem",
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gridTemplateRows:
              "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
            rowGap: "0.9375rem",
          }}
        >
          {engravingPanel.map((e, index) => {
            const iconPath = data.engravings.find(
              (_e) => _e.id === e.engraving?.id
            )?.iconPath;

            return (
              <div className="flex items-center gap-[0.9375rem]" key={index}>
                <div
                  className="h-[1.375rem] w-[1.375rem] rounded-full bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundColor: iconPath ? "" : "#d9d9d9",
                    backgroundImage: iconPath ? `url('${iconPath}')` : "",
                  }}
                ></div>
                <div className="flex-grow">
                  <SearchableDropdown
                    items={e.items}
                    locale={data.locale}
                    onFilter={(text) => {
                      filterItems(text, index);
                    }}
                    onSelect={(item) => {
                      const tempArray = [...engravingPanel];

                      if (!item) {
                        tempArray[index].engraving = undefined;
                        tempArray[index].level = "";
                      } else if (
                        !tempArray.find((t) => t.engraving?.id === item.id)
                      ) {
                        let target:
                          | {
                              engraving: ItemType | undefined;
                              level: string | undefined;
                            }
                          | undefined = undefined;

                        for (let i = 0; i < index; i++) {
                          if (!tempArray[i].engraving) {
                            target = tempArray[i];
                            break;
                          }
                        }

                        if (!target) target = tempArray[index];

                        target.engraving = item;
                        target.level = "1";
                      }

                      setEngravingPanel(tempArray);
                    }}
                    placeholder={t("selectEngraving", {
                      ns: "routes\\character\\add",
                    })}
                    selected={e.engraving}
                    style={{
                      panel: {
                        alignment: "center",
                        anchor: "center",
                        backgroundColorClass: "bg-loa-panel",
                        borderColorClass: "border-loa-button",
                        borderWidth: "0.075rem",
                        cornerRadius: "0.9375rem",
                        item: {
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          lineHeight: "1.25rem",
                          px: "0.625rem",
                          py: "0.3125rem",
                          separator: {
                            colorClass: "border-loa-button",
                            margin: "0.3125rem",
                          },
                        },
                        margin: 0.75,
                        maxHeight: 15,
                      },
                      selectInput: {
                        backgroundColorClass: "bg-loa-inactive",
                        cornerRadius: "0.9375rem",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        inactiveTextColorClass: "text-loa-grey",
                        lineHeight: "1.25rem",
                        px: "0.625rem",
                        py: "0.3125rem",
                      },
                    }}
                  />
                </div>
                <div>
                  lv.{" "}
                  <Input
                    disabled={e.level.length === 0}
                    onChange={(text) => {
                      const parsed = parseInt(text);

                      if (parsed > 0 && parsed <= 3) {
                        const tempArray = [...engravingPanel];

                        tempArray[index].level = text;

                        setEngravingPanel(tempArray);
                      }
                    }}
                    style={{
                      additionalClass: "w-[3rem]",
                      backgroundColorClass: "bg-loa-inactive",
                      cornerRadius: "0.9375rem",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      inactiveTextColorClass: "text-loa-grey",
                      lineHeight: "1.25rem",
                      px: "0.625rem",
                      py: "0.3125rem",
                      textColorClass: "text-loa-white",
                    }}
                    text={e.level}
                    type="number"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-[1.25rem] flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
        <div className="text-[1.25rem] font-[700] leading-[1.5625rem]">
          {t("relicGear", { ns: "routes\\character\\id" })}
        </div>
        <div
          style={{
            columnGap: "3.375rem",
            display: "grid",
            gridTemplateColumns: "max-content auto",
            rowGap: "0.9375rem",
          }}
        >
          <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
            {t("firstSet", { ns: "routes\\character\\id" })}
          </div>
          <div className="flex items-center text-[1rem] font-[700] leading-[1.25rem]">
            {data.regions.find((r) => r.id === region?.id)?.shortName}
          </div>
          <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
            {t("secondSet", { ns: "routes\\character\\id" })}
          </div>
          <div className="flex items-center text-[1rem] font-[700] leading-[1.25rem]">
            {server?.text ? server.text[data.locale] : ""}
          </div>
          <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
            {t("thirdSet", { ns: "routes\\character\\id" })}
          </div>
          <div></div>
        </div>
      </div>
      <div className="mt-[1.25rem] flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
        <div
          style={{
            columnGap: "2.8125rem",
            display: "grid",
            gridTemplateColumns: "max-content auto",
            rowGap: "0.9375rem",
          }}
        >
          <div className="text-[1.25rem] font-[700] leading-[1.5625rem]">
            {t("miscInfo", { ns: "routes\\character\\id" })}
          </div>
        </div>
        <div
          style={{
            columnGap: "2.8125rem",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          }}
        >
          <div
            style={{
              columnGap: "2.8125rem",
              display: "grid",
              gridTemplateColumns: "max-content auto",
              rowGap: "0.9375rem",
            }}
          >
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("region", { ns: "routes\\character\\id" })}
            </div>
            <div className="flex items-center text-[1rem] font-[700] leading-[1.25rem]">
              {data.regions.find((r) => r.id === region?.id)?.shortName}
            </div>
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("server", { ns: "routes\\character\\id" })}
            </div>
            <div className="flex items-center text-[1rem] font-[700] leading-[1.25rem]">
              {server?.text ? server.text[data.locale] : ""}
            </div>
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("language", { ns: "routes\\character\\id" })}
            </div>
            <div></div>
          </div>
          <div
            style={{
              columnGap: "2.8125rem",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            }}
          >
            <div className="flex text-[1rem] font-[400] leading-[1.25rem]">
              {t("comment", { ns: "routes\\character\\id" })}
            </div>
            <div className="flex items-center text-[1rem] font-[700] leading-[1.25rem]">
              {data.regions.find((r) => r.id === region?.id)?.shortName}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[1.25rem]">
        <Button
          disabled={!validateForm() || loading}
          onClick={() => {
            if (validateForm() && !loading) {
              setLoading(true);

              const actionBody: ActionBody = {
                job: job?.id ?? "",
                characterName,
                region: region?.id ?? "",
                server: server?.id ?? "",
                isMainCharacter,
                rosterLevel: parseInt(rosterLevel),
                combatLevel: parseInt(combatLevel),
                itemLevel: parseFloat(itemLevel),
                guild,
                stronghold,
                crit: parseInt(crit),
                specialization: parseInt(specialization),
                domination: parseInt(domination),
                swiftness: parseInt(swiftness),
                endurance: parseInt(endurance),
                expertise: parseInt(expertise),
                engravings: engravingPanel
                  .map((e) => {
                    if (e.engraving && parseInt(e.level) > 0) {
                      return { id: e.engraving.id, level: parseInt(e.level) };
                    } else {
                      return [];
                    }
                  })
                  .flat(),
                userId: data.user.id,
              };

              abortController.abort();
              abortController = new AbortController();

              fetch("/api/character/add", {
                method: "POST",
                credentials: "same-origin",
                signal: abortController.signal,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(actionBody),
              })
                .then((response) => response.json())
                .then((data: ActionData) => {
                  if (data.success) {
                    navigate("/my-roster");
                  } else {
                    setErrorMessage(data.errorMessage ?? "commonError");
                    setLoading(false);
                  }
                })
                .catch((e) => {
                  setErrorMessage("commonError");
                  setLoading(false);
                });
            }
          }}
          style={{
            additionalClass: "w-full transition",
            backgroundColorClass: "bg-loa-green",
            cornerRadius: "0.9375rem",
            disabledBackgroundColorClass: "bg-loa-inactive",
            disabledTextColorClass: "text-loa-grey",
            fontSize: "1rem",
            fontWeight: "500",
            lineHeight: "1.25rem",
            px: "",
            py: "0.9375rem",
            textColorClass: "text-loa-white",
          }}
          text={t("submit", { ns: "routes\\character\\add" })}
        />
      </div>
    </div>
  );
}
