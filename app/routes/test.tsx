import type { ItemType } from "~/components/dropdown";
import * as React from "react";
import Dropdown from "~/components/dropdown";
import Modal from "~/components/modal";

export default function Test() {
  const [isOpened, setIsOpened] = React.useState(true);

  const characters: ItemType[] = [];

  for (let i = 0; i < 50; i++) {
    characters.push({
      id: i.toString(),
      text: { en: i.toString(), ko: i.toString() },
    });
  }

  const [character, setCharacter] = React.useState<ItemType | undefined>(
    undefined
  );

  return (
    <Modal
      closeWhenClickedOutside={true}
      isOpened={isOpened}
      setIsOpened={setIsOpened}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="flex w-[36.25rem] flex-col gap-[3.125rem] overflow-visible rounded-[1.25rem] bg-loa-panel-border py-[1.875rem] px-[2.1875rem]">
        <div>
          <div className="float-right">
            <div className="material-symbols-outlined flex h-[1.25rem] w-[1.25rem] cursor-pointer items-center justify-center">
              close
            </div>
          </div>
          <div className="text-center text-[1.25rem] font-[700] leading-[1.25rem]">
            characterSelectTitle
          </div>
        </div>
        <div className="flex flex-col gap-[1.5625rem]">
          <div className="w-full whitespace-normal">
            <div className="w-full text-[1.25rem] font-[400] leading-[1.25rem]">
              characterSelectMessage
            </div>
            <div className="w-full text-[0.875rem] font-[400] leading-[1.25rem]">
              characterSelectRegionMessage
            </div>
          </div>
          <Dropdown
            items={characters}
            locale={"ko"}
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
        </div>
      </div>
    </Modal>
  );
}
