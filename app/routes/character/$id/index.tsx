import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { ActionBody } from "~/routes/api/character/$id/delete";
import type { LocaleType } from "~/i18n";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/button";
import Modal from "~/components/modal";
import { prisma } from "~/db.server";
import i18next from "~/i18next.server";
import { getUserFromRequest } from "~/session.server";
import {
  elapsedTimeSpaced,
  generateJobIconPath,
  generateProperLocaleDateString,
  printTime,
  printTimeElapsed,
} from "~/utils";

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: data.title };
};

type LoaderData = {
  character: Awaited<ReturnType<typeof getCharacter>>;
  locale: LocaleType;
  title: string;
  user: Awaited<ReturnType<typeof getUser>>;
};

const getCharacter = async (id: string) => {
  return await prisma.character.findUnique({
    where: { id },
    select: {
      id: true,
      updatedAt: true,
      name: true,
      isPrimary: true,
      job: true,
      onTimeBadge: true,
      friendlyBadge: true,
      professionalBadge: true,
      combatLevel: true,
      itemLevel: true,
      comment: true,
      crit: true,
      specialization: true,
      domination: true,
      swiftness: true,
      endurance: true,
      expertise: true,
      roster: {
        select: {
          id: true,
          level: true,
          stronghold: { select: { id: true, name: true, level: true } },
          server: {
            select: {
              id: true,
              name: true,
              region: { select: { id: true, shortName: true } },
            },
          },
          userId: true,
        },
      },
      guild: { select: { id: true, name: true } },
      relicPieces: { select: { id: true, number: true, relic: true } },
      engravingSlots: {
        select: {
          id: true,
          index: true,
          level: true,
          engraving: {
            select: { id: true, nameEn: true, nameKo: true, iconPath: true },
          },
        },
      },
    },
  });
};

const getUser = async (id: string) => {
  return await prisma.user.findFirst({ where: { id }, select: { id: true } });
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const t = await i18next.getFixedT(request, "root");

  if (!params.id) return redirect("/");

  const character = await getCharacter(params.id);

  if (!character) return redirect("/");

  const user = await getUserFromRequest(request);

  return json<LoaderData>({
    character,
    locale: (await i18next.getLocale(request)) as LocaleType,
    title: `${character.name} | ${t("shortTitle")}`,
    user: user ? await getUser(user.id) : null,
  });
};

export default function CharacterIdIndexPage() {
  const data = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isDeleteWarningOpened, setIsDeleteWarningOpened] =
    React.useState(false);
  const [allowDeleteWarningClose, setAllowDeleteWarningClose] =
    React.useState(true);
  let _isConfirmDeleteEnabled = true;
  const [isConfirmDeleteEnabled, setIsConfirmDeleteEnabled] =
    React.useState(true);

  const [isCharacterHasOpenPostOpened, setIsCharacterHasOpenPostOpened] =
    React.useState(true);

  if (data.character) {
    const iconPath = generateJobIconPath(data.character.job);
    const updatedAtTime = new Date(data.character.updatedAt);
    const dateString = generateProperLocaleDateString(
      data.locale,
      updatedAtTime
    );
    const timeString = printTime(
      updatedAtTime.getHours(),
      updatedAtTime.getMinutes()
    );
    const elapsedTimes = printTimeElapsed(updatedAtTime);
    const elapsedTimeString = `${elapsedTimes[0]}${
      elapsedTimeSpaced.includes(data.locale) ? " " : ""
    }${t(`${elapsedTimes[1]}${elapsedTimes[0] === "1" ? "" : "s"}`, {
      ns: "dictionary\\time-elapsed",
    })} ${t("ago", { ns: "dictionary\\time-elapsed" })}`;

    const engravingPanel: (
      | {
          iconPath: string;
          level: number;
          name: { [locale in LocaleType]: string };
        }
      | undefined
    )[] = [];
    for (let i = 1; i <= 8; i++) {
      const engravingSlot = data.character.engravingSlots.find(
        (e) => e.index === i
      );

      if (engravingSlot) {
        engravingPanel.push({
          iconPath: engravingSlot.engraving.iconPath,
          level: engravingSlot.level,
          name: {
            en: engravingSlot.engraving.nameEn,
            ko: engravingSlot.engraving.nameKo,
          },
        });
      } else {
        engravingPanel.push(undefined);
      }
    }

    return (
      <div className="mx-auto my-[2.5rem] flex w-[46.875rem] flex-col">
        <div className="flex">
          <Button
            onClick={() => {
              navigate("/my-roster");
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
        <div className="mt-[1.25rem] flex items-start gap-[1.5625rem]">
          <div
            className="h-[4.0625rem] w-[4.0625rem] rounded-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${iconPath}')` }}
          ></div>
          <div className="flex flex-grow flex-col items-start">
            <div className="mt-[-0.1875rem] mb-[0.125rem] truncate text-[1.5rem] font-[700] leading-[1.875rem]">
              <span className="text-loa-party-leader-star">
                {t(data.character.job, { ns: "dictionary\\job" })}
              </span>{" "}
              <span>{data.character.name}</span>
            </div>
            <div className="mb-[0.3125rem] truncate text-[0.875rem] font-[400] leading-[1.25rem]">
              {`@ ${data.character.roster.server.name}${
                data.character.isPrimary
                  ? ` / ${t("mainCharacter", { ns: "routes\\character\\id" })}`
                  : ""
              }`}
            </div>
            <div className="truncate text-[0.75rem] font-[400] leading-[1.25rem] text-loa-grey">
              {`${t("lastUpdated", {
                ns: "routes\\character\\id",
              })} ${elapsedTimeString} ${dateString} ${timeString}`}
            </div>
          </div>
          {data.user && data.user.id === data.character.roster.userId && (
            <div className="flex items-start justify-end gap-[0.625rem]">
              <Link to={`/character/${data.character.id}/edit`}>
                <Button
                  style={{
                    additionalClass: "",
                    backgroundColorClass: "bg-loa-button",
                    cornerRadius: "0.9375rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    lineHeight: "1.25rem",
                    px: "0.9375rem",
                    py: "0.9375rem",
                    textColorClass: "text-loa-white",
                  }}
                  text={t("edit", { ns: "routes\\character\\id" })}
                />
              </Link>
              <Button
                onClick={() => setIsDeleteWarningOpened(true)}
                style={{
                  additionalClass: "",
                  backgroundColorClass: "bg-loa-red",
                  cornerRadius: "0.9375rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  lineHeight: "1.25rem",
                  px: "0.9375rem",
                  py: "0.9375rem",
                  textColorClass: "text-loa-white",
                }}
                text={t("delete", { ns: "routes\\character\\id" })}
              />
              <Modal
                closeWhenClickedOutside={allowDeleteWarningClose}
                isOpened={isDeleteWarningOpened}
                setIsOpened={setIsDeleteWarningOpened}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="flex w-[36.25rem] flex-col gap-[3.125rem] rounded-[1.25rem] bg-loa-panel-border py-[1.875rem] px-[2.1875rem]">
                  <div>
                    <div className="float-right">
                      <div
                        className="material-symbols-outlined flex h-[1.25rem] w-[1.25rem] cursor-pointer items-center justify-center"
                        onClick={() => setIsDeleteWarningOpened(false)}
                      >
                        close
                      </div>
                    </div>
                    <div className="text-center text-[1.25rem] font-[700] leading-[1.25rem]">
                      {t("deleteTitle", { ns: "routes\\character\\id" })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-[1.5625rem]">
                    <div className="flex items-center justify-center gap-[0.3125rem] truncate text-[1.5rem] font-[700] leading-[1.875rem]">
                      <div className="text-loa-party-leader-star">
                        {t(data.character.job, { ns: "dictionary\\job" })}
                      </div>
                      <span>{data.character.name}</span>
                    </div>
                    <div className="w-full whitespace-normal text-[1.25rem] font-[400] leading-[1.25rem]">
                      {t("confirmDelete", { ns: "routes\\character\\id" })}
                    </div>
                    <Button
                      disabled={!isConfirmDeleteEnabled}
                      onClick={() => {
                        if (_isConfirmDeleteEnabled) {
                          _isConfirmDeleteEnabled = false;
                          setIsConfirmDeleteEnabled(false);
                          setAllowDeleteWarningClose(false);

                          const actionBody: ActionBody = {
                            characterId: data.character?.id ?? "",
                            userId: data.user?.id ?? "",
                          };

                          fetch(
                            `/api/character/${data.character?.id ?? ""}/delete`,
                            {
                              method: "POST",
                              credentials: "same-origin",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(actionBody),
                            }
                          )
                            .then((data) => {
                              return data.json();
                            })
                            .then((data) => {
                              if (!data.success && data.errorMessage) {
                                if (
                                  data.errorMessage === "characterHasOpenPost"
                                ) {
                                  setIsDeleteWarningOpened(false);
                                  _isConfirmDeleteEnabled = true;
                                  setIsConfirmDeleteEnabled(true);
                                  setIsCharacterHasOpenPostOpened(true);
                                }
                              } else {
                                navigate("/my-roster");
                              }
                            })
                            .catch(() => {});
                        }
                      }}
                      style={{
                        additionalClass: "",
                        backgroundColorClass: "bg-loa-red",
                        cornerRadius: "0.9375rem",
                        disabledBackgroundColorClass: "bg-loa-inactive",
                        disabledTextColorClass: "text-loa-grey",
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        lineHeight: "1.25rem",
                        px: "",
                        py: "1.25rem",
                        textColorClass: "text-loa-white",
                      }}
                      text={t("delete", { ns: "routes\\character\\id" })}
                    />
                  </div>
                </div>
              </Modal>
              <Modal
                closeWhenClickedOutside={true}
                isOpened={isCharacterHasOpenPostOpened}
                setIsOpened={setIsCharacterHasOpenPostOpened}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="flex w-[36.25rem] flex-col gap-[3.125rem] rounded-[1.25rem] bg-loa-panel-border py-[1.875rem] px-[2.1875rem]">
                  <div>
                    <div className="float-right">
                      <div
                        className="material-symbols-outlined flex h-[1.25rem] w-[1.25rem] cursor-pointer items-center justify-center"
                        onClick={() => setIsCharacterHasOpenPostOpened(false)}
                      >
                        close
                      </div>
                    </div>
                    <div className="text-center text-[1.25rem] font-[700] leading-[1.25rem]">
                      {t("warningTitle", { ns: "routes\\character\\id" })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-[1.5625rem]">
                    <div className="flex items-center justify-center gap-[0.3125rem] truncate text-[1.5rem] font-[700] leading-[1.875rem]">
                      <div className="text-loa-party-leader-star">
                        {t(data.character.job, { ns: "dictionary\\job" })}
                      </div>
                      <span>{data.character.name}</span>
                    </div>
                    <div className="w-full whitespace-normal text-[1.25rem] font-[400] leading-[1.875rem]">
                      {t("characterHasOpenPostWarningMessage", {
                        ns: "routes\\character\\id",
                      })}
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          )}
        </div>
        <div className="mt-[1.4375rem] flex gap-[0.625rem]">
          <div className="flex items-center justify-center gap-[0.3125rem]">
            <span
              className="material-symbols-outlined text-[1.5rem]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              schedule
            </span>
            <span className="text-[1rem] font-[400] leading-[1.25rem] text-loa-grey">
              ({data.character.onTimeBadge})
            </span>
          </div>
          <div className="flex items-center justify-center gap-[0.3125rem]">
            <span className="material-symbols-outlined text-[1.5rem]">
              diversity_1
            </span>
            <span className="text-[1rem] font-[400] leading-[1.25rem] text-loa-grey">
              ({data.character.friendlyBadge})
            </span>
          </div>
          <div className="flex items-center justify-center gap-[0.3125rem]">
            <span
              className="material-symbols-outlined text-[1.5rem]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              business_center
            </span>
            <span className="text-[1rem] font-[400] leading-[1.25rem] text-loa-grey">
              ({data.character.professionalBadge})
            </span>
          </div>
        </div>
        <div className="mt-[1.25rem] flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
          <div className="text-[1.25rem] font-[700] leading-[1.5625rem]">
            {t("basicInfo", { ns: "routes\\character\\id" })}
          </div>
          <div
            style={{
              columnGap: "1rem",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            }}
          >
            <div
              style={{
                columnGap: "2rem",
                display: "grid",
                gridTemplateColumns: "max-content auto",
                rowGap: "0.9375rem",
              }}
            >
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("rosterLevel", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">
                  lv.{data.character.roster.level}
                </span>
              </div>
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("combatLevel", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">
                  lv.{data.character.combatLevel}
                </span>
              </div>
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("itemLevel", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem] text-loa-pink">
                <span className="truncate">
                  lv.{data.character.itemLevel.toFixed(2)}
                </span>
              </div>
            </div>
            <div
              style={{
                columnGap: "2rem",
                display: "grid",
                gridTemplateColumns: "max-content auto",
                rowGap: "0.9375rem",
              }}
            >
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("guild", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">
                  {data.character.guild?.name ?? ""}
                </span>
              </div>
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("pvp", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate"></span>
              </div>
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("stronghold", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">
                  {data.character.roster.stronghold?.name ?? ""}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[1.25rem] flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
          <div className="text-[1.25rem] font-[700] leading-[1.5625rem]">
            {t("combatStats", { ns: "routes\\character\\id" })}
          </div>
          <div
            style={{
              columnGap: "1rem",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            }}
          >
            <div
              style={{
                columnGap: "2rem",
                display: "grid",
                gridTemplateColumns: "max-content auto",
                rowGap: "0.9375rem",
              }}
            >
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("crit", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">{data.character.crit}</span>
              </div>
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("domination", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">{data.character.domination}</span>
              </div>
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("endurance", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">{data.character.endurance}</span>
              </div>
            </div>
            <div
              style={{
                columnGap: "2rem",
                display: "grid",
                gridTemplateColumns: "max-content auto",
                rowGap: "0.9375rem",
              }}
            >
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("specialization", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">
                  {data.character.specialization}
                </span>
              </div>
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("swiftness", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">{data.character.swiftness}</span>
              </div>
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("expertise", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">{data.character.expertise}</span>
              </div>
            </div>
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
              return (
                <div className="flex items-center gap-[0.9375rem]" key={index}>
                  <div
                    className="h-[1.375rem] w-[1.375rem] rounded-full bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundColor: e ? undefined : "#d9d9d9",
                      backgroundImage: e ? `url('${e.iconPath}')` : undefined,
                    }}
                  ></div>
                  <div className="flex flex-grow items-center text-[1rem] font-[400] leading-[1.25rem]">
                    {e ? e.name[data.locale] : "-"}
                  </div>
                  <div className="flex items-center">
                    {e ? `lv.${e.level}` : "-"}
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
              columnGap: "2.8125rem",
              display: "grid",
              gridTemplateColumns: "max-content max-content auto",
              rowGap: "0.9375rem",
            }}
          >
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("firstSet", { ns: "routes\\character\\id" })}
            </div>
            <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
              <span className="truncate">
                {data.character.relicPieces.length > 0
                  ? t(data.character.relicPieces[0].relic, {
                      ns: "dictionary\\relic",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
              <span className="truncate">
                {data.character.relicPieces.length > 0
                  ? `${data.character.relicPieces[0].number} ${t("pieces", {
                      ns: "routes\\character\\id",
                    })}`
                  : "-"}
              </span>
            </div>
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("secondSet", { ns: "routes\\character\\id" })}
            </div>
            <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
              <span className="truncate">
                {data.character.relicPieces.length > 1
                  ? t(data.character.relicPieces[1].relic, {
                      ns: "dictionary\\relic",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
              <span className="truncate">
                {data.character.relicPieces.length > 1
                  ? `${data.character.relicPieces[1].number} ${t("pieces", {
                      ns: "routes\\character\\id",
                    })}`
                  : "-"}
              </span>
            </div>
            <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
              {t("thirdSet", { ns: "routes\\character\\id" })}
            </div>
            <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
              <span className="truncate">
                {data.character.relicPieces.length > 2
                  ? t(data.character.relicPieces[2].relic, {
                      ns: "dictionary\\relic",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
              <span className="truncate">
                {data.character.relicPieces.length > 2
                  ? `${data.character.relicPieces[2].number} ${t("pieces", {
                      ns: "routes\\character\\id",
                    })}`
                  : "-"}
              </span>
            </div>
            <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
              <span className="truncate"></span>
            </div>
          </div>
        </div>
        <div className="mt-[1.25rem] flex flex-col gap-[1.25rem] rounded-[0.9375rem] bg-loa-panel p-[1.25rem]">
          <div className="text-[1.25rem] font-[700] leading-[1.5625rem]">
            {t("miscInfo", { ns: "routes\\character\\id" })}
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
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">
                  {data.character.roster.server.region.shortName}
                </span>
              </div>
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("server", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate">
                  {data.character.roster.server.name}
                </span>
              </div>
              <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                {t("language", { ns: "routes\\character\\id" })}
              </div>
              <div className="flex items-center overflow-hidden text-[1rem] font-[700] leading-[1.25rem]">
                <span className="truncate"></span>
              </div>
            </div>
            <div
              style={{
                columnGap: "2.8125rem",
                display: "grid",
                gridTemplateColumns: "max-content auto",
                rowGap: "0.9375rem",
              }}
            >
              <div className="text-[1.25rem] font-[700] leading-[1.5625rem]">
                {t("comment", { ns: "routes\\character\\id" })}
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div></div>;
}
