import type { ItemType } from "~/components/dropdown";
import type { LocaleType } from "~/i18n";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function InfoOverlay(props: {
  enabled: boolean;
  engravings: {
    engraving: { id: string; nameEn: string; nameKo: string };
    level: number;
  }[];
  itemLevel: number;
  job: string;
  locale: LocaleType;
  name: string;
  rosterLevel: number;
}) {
  const { t } = useTranslation();

  const engravings: { level: number; engraving: ItemType }[] = props.engravings
    ? props.engravings.map((engraving) => {
        return {
          level: engraving.level,
          engraving: {
            id: engraving.engraving.id,
            text: {
              en: engraving.engraving.nameEn,
              ko: engraving.engraving.nameKo,
            },
          },
        };
      })
    : [];

  return (
    <div
      className="absolute flex flex-col rounded-[1.25rem] bg-loa-panel-border p-[0.9375rem]"
      style={{
        display: props.enabled ? undefined : "none",
      }}
    >
      <div className="justify-stretch flex flex-col items-center font-[700]">
        <p className="text-loa-party-leader-star">
          {props.job ? t(props.job, { ns: "dictionary\\job" }) : ""}
        </p>
        <p>{props.name}</p>
      </div>
      <div className="mt-[0.9375rem] flex flex-col gap-[1.25rem]">
        <div className="flex flex-col gap-[0.9375rem]">
          <div className="flex justify-between gap-[2.8125rem] text-[0.875rem]">
            <div className="font-[400]">
              {t("rosterLevel", {
                ns: "components\\tools\\party-finder\\info-overlay",
              })}
            </div>
            <div className="font-[700]">lv. {props.rosterLevel}</div>
          </div>
          <div className="flex justify-between gap-[2.8125rem] text-[0.875rem]">
            <div className="font-[400]">
              {t("itemLevel", {
                ns: "components\\tools\\party-finder\\info-overlay",
              })}
            </div>
            <div className="font-[700] text-loa-pink">
              lv. {props.itemLevel}
            </div>
          </div>
        </div>
        <hr className="border-loa-button" />
        <div className="flex flex-col gap-[0.9375rem]">
          {props.engravings.length === 0 ? (
            <div className="text-[0.875rem]">
              {t("noEngravings", {
                ns: "components\\tools\\party-finder\\info-overlay",
              })}
            </div>
          ) : (
            engravings.map((engraving) => {
              return (
                <div
                  className="flex justify-between gap-[2.8125rem] text-[0.875rem]"
                  id={engraving.engraving.id}
                >
                  <div className="font-[400]">
                    {engraving.engraving.text
                      ? engraving.engraving.text[props.locale]
                      : ""}
                  </div>
                  <div className="font-[700]">lv. {engraving.level}</div>
                </div>
              );
            })
          )}
        </div>
        <hr className="border-loa-button" />
        <div className="flex flex-col gap-[0.9375rem]">
          <div className="flex justify-between gap-[2.8125rem] text-[0.875rem]">
            <div className="font-[400]">갈망</div>
            <div className="font-[700]">2부위</div>
          </div>
          <div className="flex justify-between gap-[2.8125rem] text-[0.875rem]">
            <div className="font-[400]">사멸</div>
            <div className="font-[700]">4부위</div>
          </div>
        </div>
      </div>
    </div>
  );
}
