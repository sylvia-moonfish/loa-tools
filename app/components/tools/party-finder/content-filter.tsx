import type { ItemType } from "~/components/dropdown";
import type { LocaleType } from "~/i18n";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/dropdown";

export default function ContentFilter(props: {
  contentStage: ItemType | undefined;
  contentTier: ItemType | undefined;
  contentType: ItemType | undefined;
  contentTypes: (ItemType & { tiers: (ItemType & { stages: ItemType[] })[] })[];
  initContentTiers?: (ItemType & { stages: ItemType[] })[];
  initContentStages?: ItemType[];
  locale: LocaleType;
  required: boolean;
  setContentStage: (item: ItemType | undefined) => void;
  setContentTier: (item: ItemType | undefined) => void;
  setContentType: (item: ItemType | undefined) => void;
}) {
  const { t } = useTranslation();

  const setContentType = (item: ItemType | undefined) => {
    if (item && props.contentType && item.id === props.contentType.id) return;

    setContentTiers(
      item ? props.contentTypes.find((c) => c.id === item.id)?.tiers ?? [] : []
    );
    setContentTier(undefined);

    props.setContentType(item);
  };

  const [contentTiers, setContentTiers] = React.useState<
    (ItemType & { stages: ItemType[] })[]
  >(props.initContentTiers ?? []);
  const setContentTier = (item: ItemType | undefined) => {
    if (item && props.contentTier && item.id === props.contentTier.id) return;

    setContentStages(
      item ? contentTiers.find((c) => c.id === item.id)?.stages ?? [] : []
    );
    setContentStage(undefined);

    props.setContentTier(item);
  };

  const [contentStages, setContentStages] = React.useState<ItemType[]>(
    props.initContentStages ?? []
  );
  const setContentStage = (item: ItemType | undefined) => {
    if (item && props.contentStage && item.id === props.contentStage.id) return;
    props.setContentStage(item);
  };

  return (
    <>
      <Dropdown
        invalid={props.required && !props.contentType}
        items={props.contentTypes}
        locale={props.locale}
        onChange={setContentType}
        placeholder={t("contentType", {
          ns: "components\\tools\\party-finder\\content-filter",
        })}
        selected={props.contentType}
        style={{
          panel: {
            alignment: "center",
            anchor: "center",
            backgroundColorClass: "bg-loa-panel",
            borderColorClass: "border-loa-button",
            borderWidth: "0.0875rem",
            cornerRadius: "0.9375rem",
            item: {
              fontSize: "0.875rem",
              fontWeight: "500",
              lineHeight: "1.25rem",
              px: "1.25rem",
              py: "0.625rem",
              separator: {
                colorClass: "border-loa-button",
                margin: "0.4375rem",
              },
            },
            margin: 0.2917,
            maxHeight: 17.5,
          },
          selectButton: {
            backgroundColorClass: "bg-loa-inactive",
            cornerRadius: "0.9375rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            gap: "",
            inactiveTextColorClass: "text-loa-grey",
            invalid: {
              outlineColorClass: "outline-loa-red",
              outlineWidth: "0.175rem",
            },
            lineHeight: "1.25rem",
            px: "1.25rem",
            py: "0.625rem",
          },
        }}
      />
      <Dropdown
        invalid={props.required && !props.contentTier}
        items={props.contentType ? contentTiers : []}
        locale={props.locale}
        onChange={setContentTier}
        placeholder={t("contentTier", {
          ns: "components\\tools\\party-finder\\content-filter",
        })}
        selected={props.contentTier}
        style={{
          panel: {
            alignment: "center",
            anchor: "center",
            backgroundColorClass: "bg-loa-panel",
            borderColorClass: "border-loa-button",
            borderWidth: "0.0875rem",
            cornerRadius: "0.9375rem",
            item: {
              fontSize: "0.875rem",
              fontWeight: "500",
              lineHeight: "1.25rem",
              px: "1.25rem",
              py: "0.625rem",
              separator: {
                colorClass: "border-loa-button",
                margin: "0.4375rem",
              },
            },
            margin: 0.2917,
            maxHeight: 17.5,
          },
          selectButton: {
            backgroundColorClass: "bg-loa-inactive",
            cornerRadius: "0.9375rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            gap: "",
            inactiveTextColorClass: "text-loa-grey",
            invalid: {
              outlineColorClass: "outline-loa-red",
              outlineWidth: "0.175rem",
            },
            lineHeight: "1.25rem",
            px: "1.25rem",
            py: "0.625rem",
          },
        }}
      />
      <Dropdown
        invalid={props.required && !props.contentStage}
        items={props.contentType && props.contentTier ? contentStages : []}
        locale={props.locale}
        onChange={setContentStage}
        placeholder={t("contentStage", {
          ns: "components\\tools\\party-finder\\content-filter",
        })}
        selected={props.contentStage}
        style={{
          panel: {
            alignment: "center",
            anchor: "center",
            backgroundColorClass: "bg-loa-panel",
            borderColorClass: "border-loa-button",
            borderWidth: "0.0875rem",
            cornerRadius: "0.9375rem",
            item: {
              fontSize: "0.875rem",
              fontWeight: "500",
              lineHeight: "1.25rem",
              px: "1.25rem",
              py: "0.625rem",
              separator: {
                colorClass: "border-loa-button",
                margin: "0.4375rem",
              },
            },
            margin: 0.2917,
            maxHeight: 17.5,
          },
          selectButton: {
            backgroundColorClass: "bg-loa-inactive",
            cornerRadius: "0.9375rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            gap: "",
            inactiveTextColorClass: "text-loa-grey",
            invalid: {
              outlineColorClass: "outline-loa-red",
              outlineWidth: "0.175rem",
            },
            lineHeight: "1.25rem",
            px: "1.25rem",
            py: "0.625rem",
          },
        }}
      />
    </>
  );
}
