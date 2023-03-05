import type { ItemType } from "~/components/dropdown";
import type { ActionBody, ActionData } from "~/routes/api/party-find-post/add";
import type { LocaleType } from "~/i18n";
import { useNavigate } from "@remix-run/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import ContentFilter from "~/components/tools/party-finder/content-filter";
import Button from "~/components/button";
import Checkbox from "~/components/checkbox";
import Dropdown from "~/components/dropdown";
import Input from "~/components/input";
import Modal from "~/components/modal";
import { validateDateString, validateText } from "~/utils";

let abortController = new AbortController();

export default function AddPartyButton(props: {
  characters: ItemType[];
  contentTypes: (ItemType & { tiers: (ItemType & { stages: ItemType[] })[] })[];
  locale: LocaleType;
  userId: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [contentType, setContentType] = React.useState<ItemType | undefined>(
    undefined
  );
  const [contentTier, setContentTier] = React.useState<ItemType | undefined>(
    undefined
  );
  const [contentStage, setContentStage] = React.useState<ItemType | undefined>(
    undefined
  );

  const [partyTitle, setPartyTitle] = React.useState("");
  const [isPracticeParty, setIsPracticeParty] = React.useState(true);
  const [isReclearParty, setIsReclearParty] = React.useState(false);
  const [enforceRole, setEnforceRole] = React.useState(false);
  const [roleString, setRoleString] = React.useState("partyRecruitAnyone");

  const [startDate, setStartDate] = React.useState("");
  const [isRecurring, setIsRecurring] = React.useState(false);

  const [character, setCharacter] = React.useState<ItemType | undefined>(
    undefined
  );

  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const validateForm = () => {
    return (
      contentType &&
      contentTier &&
      contentStage &&
      validateText(true, partyTitle, 35, 1) &&
      (isPracticeParty || isReclearParty) &&
      !(isPracticeParty && isReclearParty) &&
      validateDateString(startDate) &&
      character
    );
  };

  return (
    <div>
      <Button
        onClick={() => {
          setIsModalOpen(true);
        }}
        style={{
          additionalClass: "",
          backgroundColorClass: "bg-loa-button",
          cornerRadius: "0.9375rem",
          fontSize: "1rem",
          fontWeight: "500",
          lineHeight: "1.25rem",
          px: "0.875rem",
          py: "0.9375rem",
          textColorClass: "text-loa-white",
        }}
        text={`+ ${t("postParty", {
          ns: "components\\tools\\party-finder\\add-party-button",
        })}`}
      />
      <Modal
        closeWhenClickedOutside={!loading}
        isOpened={isModalOpen}
        setIsOpened={setIsModalOpen}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="flex w-[36.25rem] flex-col gap-[1.375rem] rounded-[1.25rem] bg-loa-panel-border p-[1.875rem]">
          <div>
            <div className="float-right">
              <div
                className="material-symbols-outlined flex h-[1.25rem] w-[1.25rem] cursor-pointer items-center justify-center"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                close
              </div>
            </div>
            <div className="text-center text-[1.25rem] font-[700] leading-[1.25rem]">
              {t("postParty", {
                ns: "components\\tools\\party-finder\\add-party-button",
              })}
            </div>
          </div>
          <div className="flex flex-col gap-[1.25rem]">
            {errorMessage.length > 0 && (
              <div className="flex items-center justify-center whitespace-normal rounded-[0.9375rem] bg-loa-red p-[1.25rem]">
                {t(errorMessage, { ns: "error-messages" })}
              </div>
            )}
            <div className="flex flex-col gap-[1.25rem]">
              <div className="text-[1.25rem] font-[400] leading-[1.25rem]">
                {t("contentInfo", {
                  ns: "components\\tools\\party-finder\\add-party-button",
                })}
              </div>
              <div className="flex flex-col gap-[0.625rem]">
                <ContentFilter
                  contentStage={contentStage}
                  contentTier={contentTier}
                  contentType={contentType}
                  contentTypes={props.contentTypes}
                  locale={props.locale}
                  required={true}
                  setContentStage={setContentStage}
                  setContentTier={setContentTier}
                  setContentType={setContentType}
                />
              </div>
              <hr className="border-loa-button" />
            </div>
            <div className="flex flex-col gap-[1.25rem]">
              <div className="text-[1.25rem] font-[400] leading-[1.25rem]">
                {t("partyInfo", {
                  ns: "components\\tools\\party-finder\\add-party-button",
                })}
              </div>
              <div
                style={{
                  columnGap: "2rem",
                  display: "grid",
                  gridTemplateColumns: "max-content auto",
                  rowGap: "1rem",
                }}
              >
                <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                  {t("partyTitle", {
                    ns: "components\\tools\\party-finder\\add-party-button",
                  })}
                </div>
                <Input
                  invalid={!validateText(true, partyTitle, 35, 1)}
                  onChange={(text) => {
                    if (validateText(false, partyTitle, 35)) {
                      setPartyTitle(text);
                    }
                  }}
                  style={{
                    additionalClass: "w-full",
                    backgroundColorClass: "bg-loa-inactive",
                    cornerRadius: "0.9375rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    inactiveTextColorClass: "text-loa-grey",
                    invalid: {
                      outlineColorClass: "outline-loa-red",
                      outlineWidth: "0.2",
                    },
                    lineHeight: "1.25rem",
                    px: "1rem",
                    py: "0.5rem",
                    textColorClass: "text-loa-white",
                  }}
                  text={partyTitle}
                  type="text"
                />
                <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                  {t("partyType", {
                    ns: "components\\tools\\party-finder\\add-party-button",
                  })}
                </div>
                <div
                  style={{
                    columnGap: "1rem",
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  }}
                >
                  <Checkbox
                    isChecked={isPracticeParty}
                    onClick={() => {
                      setIsReclearParty(!!isPracticeParty);
                      setIsPracticeParty(!isPracticeParty);
                    }}
                    style={{
                      gap: "0.8125rem",
                      box: {
                        backgroundColorClass: "bg-loa-white",
                        checkColorClass: "text-loa-body",
                        size: 1.875,
                      },
                      text: {
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        lineHeight: "1.25rem",
                      },
                    }}
                    text={t("practiceParty", {
                      ns: "routes\\tools\\party-finder",
                    })}
                  />
                  <Checkbox
                    isChecked={isReclearParty}
                    onClick={() => {
                      setIsPracticeParty(!!isReclearParty);
                      setIsReclearParty(!isReclearParty);
                    }}
                    style={{
                      gap: "0.8125rem",
                      box: {
                        backgroundColorClass: "bg-loa-white",
                        checkColorClass: "text-loa-body",
                        size: 1.875,
                      },
                      text: {
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        lineHeight: "1.25rem",
                      },
                    }}
                    text={t("reclearParty", {
                      ns: "routes\\tools\\party-finder",
                    })}
                  />
                </div>
                <div className="flex items-center">
                  {t("partyRoles", {
                    ns: "components\\tools\\party-finder\\add-party-button",
                  })}
                </div>
                <Checkbox
                  isChecked={enforceRole}
                  onClick={() => {
                    setRoleString(
                      enforceRole
                        ? "partyRecruitAnyone"
                        : "partyRecruitEnforced"
                    );
                    setEnforceRole(!enforceRole);
                  }}
                  style={{
                    gap: "0.8125rem",
                    box: {
                      backgroundColorClass: "bg-loa-white",
                      checkColorClass: "text-loa-body",
                      size: 1.875,
                    },
                    text: {
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      lineHeight: "1.25rem",
                    },
                  }}
                  text={t(roleString, {
                    ns: "components\\tools\\party-finder\\add-party-button",
                  })}
                />
              </div>
              <hr className="border-loa-button" />
            </div>
            <div className="flex flex-col gap-[1.25rem]">
              <div className="text-[1.25rem] font-[400] leading-[1.25rem]">
                {t("partySchedule", {
                  ns: "components\\tools\\party-finder\\add-party-button",
                })}
              </div>
              <div className="flex flex-col gap-[1rem]">
                <div className="flex gap-[2rem]">
                  <div className="flex items-center text-[1rem] font-[400] leading-[1.25rem]">
                    {t("scheduleDate", {
                      ns: "components\\tools\\party-finder\\add-party-button",
                    })}
                  </div>
                  <Input
                    invalid={!validateDateString(startDate)}
                    onChange={(text) => {
                      if (validateDateString(text)) setStartDate(text);
                    }}
                    style={{
                      additionalClass: "w-full",
                      backgroundColorClass: "bg-loa-inactive",
                      cornerRadius: "0.9375rem",
                      fontSize: "1rem",
                      fontWeight: "500",
                      inactiveTextColorClass: "text-loa-grey",
                      invalid: {
                        outlineColorClass: "outline-loa-red",
                        outlineWidth: "0.2",
                      },
                      lineHeight: "1.25rem",
                      px: "1rem",
                      py: "0.5rem",
                      textColorClass: "text-loa-white",
                    }}
                    text={startDate}
                    type="datetime-local"
                  />
                </div>
                <Checkbox
                  isChecked={isRecurring}
                  onClick={() => {
                    setIsRecurring(!isRecurring);
                  }}
                  style={{
                    gap: "0.8125rem",
                    box: {
                      backgroundColorClass: "bg-loa-white",
                      checkColorClass: "text-loa-body",
                      size: 1.875,
                    },
                    text: {
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      lineHeight: "1.25rem",
                    },
                  }}
                  text={t("recurring", {
                    ns: "components\\tools\\party-finder\\add-party-button",
                  })}
                />
              </div>
              <hr className="border-loa-button" />
            </div>
            <div className="flex flex-col gap-[1.25rem]">
              <div className="text-[1.25rem] font-[400] leading-[1.25rem]">
                {t("characterInfo", {
                  ns: "components\\tools\\party-finder\\add-party-button",
                })}
              </div>
              <Dropdown
                invalid={!character}
                items={props.characters}
                locale={props.locale}
                onChange={setCharacter}
                selected={character}
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
              <hr className="border-loa-button" />
            </div>
            <Button
              disabled={!validateForm() || loading}
              onClick={() => {
                if (validateForm() && !loading) {
                  setLoading(true);

                  if (contentType) {
                    const actionBody: ActionBody = {
                      contentType,
                      contentTierId: contentTier?.id ?? "",
                      contentStageId: contentStage?.id ?? "",
                      partyTitle,
                      isPracticeParty,
                      isReclearParty,
                      enforceRole,
                      startDate: new Date(startDate).getTime(),
                      isRecurring,
                      characterId: character?.id ?? "",
                      userId: props.userId,
                    };

                    abortController.abort();
                    abortController = new AbortController();

                    fetch("/api/party-find-post/add", {
                      method: "POST",
                      credentials: "same-origin",
                      signal: abortController.signal,
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(actionBody),
                    })
                      .then((response) => response.json())
                      .then((data: ActionData) => {
                        if (data.success && data.partyFindPostId) {
                          navigate(`/party-find-post/${data.partyFindPostId}`);
                        } else {
                          setErrorMessage(data.errorMessage ?? "commonError");
                          setLoading(false);
                        }
                      })
                      .catch((e) => {
                        setErrorMessage("commonError");
                        setLoading(false);
                      });
                  } else {
                    setErrorMessage("commonError");
                    setLoading(false);
                  }
                }
              }}
              style={{
                additionalClass: "transition",
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
              text={t("post", {
                ns: "components\\tools\\party-finder\\add-party-button",
              })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
