import type { LocaleType } from "~/i18n";
import * as React from "react";
import { useTranslation } from "react-i18next";

export type ItemType = {
  i18n?: {
    keyword: string;
    namespace: string;
  };
  id: string;
  text?: { [locale in LocaleType]: string };
};

export default function Dropdown(props: {
  invalid?: boolean;
  items: ItemType[];
  locale: LocaleType;
  onChange: (item: ItemType | undefined) => void;
  placeholder?: string;
  selected: ItemType | undefined;
  style: {
    additionalClass?: string;
    panel: {
      alignment: "left" | "center" | "right";
      anchor: "left" | "center" | "right";
      backgroundColorClass: string;
      borderColorClass: string;
      borderWidth: string;
      cornerRadius: string;
      item: {
        fontSize: string;
        fontWeight: string;
        lineHeight: string;
        px: string;
        py: string;
        separator: { colorClass: string; margin: string };
      };
      margin: number;
      maxHeight: number;
    };
    selectButton: {
      backgroundColorClass: string;
      cornerRadius: string;
      fontSize: string;
      fontWeight: string;
      gap: string;
      inactiveTextColorClass: string;
      invalid?: { outlineColorClass: string; outlineWidth: string };
      lineHeight: string;
      px: string;
      py: string;
    };
  };
}) {
  const { t } = useTranslation();

  const [isOpened, setIsOpened] = React.useState(false);
  const [windowHeight, setWindowHeight] = React.useState<number | undefined>(
    undefined
  );
  const [fontSize, setFontSize] = React.useState<number | undefined>(undefined);
  const [isBottom, setIsBottom] = React.useState(true);
  const [maxHeight, setMaxHeight] = React.useState<number | undefined>(
    undefined
  );

  const selectButton = React.useRef<HTMLDivElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);

  function close() {
    setIsOpened(false);
  }

  function setHeight() {
    setWindowHeight(window.innerHeight);
  }

  React.useEffect(() => {
    if (document) {
      setFontSize(
        parseFloat(
          getComputedStyle(document.documentElement).fontSize.replace("px", "")
        )
      );
    }
  });

  React.useEffect(() => {
    if (window && isOpened) {
      setHeight();
      window.addEventListener("click", close, { once: true });
      window.addEventListener("resize", setHeight);
    }

    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("resize", setHeight);
    };
  }, [isOpened]);

  React.useEffect(() => {
    if (isOpened && selectButton.current && windowHeight) {
      const rect = selectButton.current.getBoundingClientRect();
      const _isBottom = windowHeight / 2 > rect.top;
      setIsBottom(_isBottom);

      if (fontSize) {
        setMaxHeight(
          Math.min(
            (_isBottom
              ? windowHeight - rect.bottom - props.style.panel.margin * fontSize
              : rect.top - props.style.panel.margin * fontSize) / fontSize,
            props.style.panel.maxHeight
          )
        );
      }
    }
  }, [windowHeight]);

  return (
    <div className={`${props.style.additionalClass ?? ""} relative`}>
      <div
        className={`${
          props.items.length == 0 ? "cursor-not-allowed " : "cursor-pointer "
        } ${props.style.selectButton.backgroundColorClass} ${
          props.invalid && props.style.selectButton.invalid
            ? props.style.selectButton.invalid.outlineColorClass
            : ""
        } flex items-center justify-between`}
        onClick={() => {
          if (props.items.length > 0 && !isOpened) setIsOpened(true);
        }}
        ref={selectButton}
        style={{
          borderRadius: props.style.selectButton.cornerRadius,
          gap: props.style.selectButton.gap,
          outlineStyle:
            props.invalid && props.style.selectButton.invalid
              ? "solid"
              : undefined,
          outlineWidth:
            props.invalid && props.style.selectButton.invalid
              ? props.style.selectButton.invalid.outlineWidth
              : undefined,
          paddingBottom: props.style.selectButton.py,
          paddingLeft: props.style.selectButton.px,
          paddingRight: props.style.selectButton.px,
          paddingTop: props.style.selectButton.py,
        }}
      >
        <div
          className={`${
            props.selected
              ? ""
              : props.style.selectButton.inactiveTextColorClass
          }`}
          style={{
            fontSize: props.style.selectButton.fontSize,
            fontWeight: props.style.selectButton.fontWeight,
            lineHeight: props.style.selectButton.lineHeight,
          }}
        >
          {props.selected
            ? props.selected.text
              ? props.selected.text[props.locale]
              : props.selected.i18n
              ? t(props.selected.i18n.keyword, {
                  ns: props.selected.i18n.namespace,
                })
              : ""
            : props.placeholder ?? "-"}
        </div>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: props.style.selectButton.fontSize,
          }}
        >
          {isOpened ? "expand_less" : "expand_more"}
        </span>
      </div>
      <div
        className={`${props.style.panel.backgroundColorClass} ${props.style.panel.borderColorClass} absolute z-20 flex min-w-full flex-col items-stretch justify-items-stretch overflow-y-auto overflow-x-hidden transition`}
        ref={panel}
        style={{
          backgroundColor: isOpened ? undefined : "rgba(0, 0, 0, 0)",
          borderColor: isOpened ? undefined : "rgba(0, 0, 0, 0)",
          borderRadius: props.style.panel.cornerRadius,
          borderWidth: props.style.panel.borderWidth,
          left: `${props.style.panel.alignment === "center" ? "50%" : ""}${
            props.style.panel.alignment === "right" ? "100%" : ""
          }`,
          maxHeight: `${maxHeight}rem`,
          transform: `${
            props.style.panel.anchor === "center" ? "translate(-50%, 0)" : ""
          } ${
            props.style.panel.anchor === "right" ? "translate(-100%, 0)" : ""
          } ${
            isBottom
              ? `translate(0, ${props.style.panel.margin}rem)`
              : `translate(0, -100%) translate(0, -${props.style.panel.margin}rem)`
          } ${isOpened ? "scale(1)" : "scale(1, 0)"}`,
          top: `${isBottom ? "" : "0"}`,
          transformOrigin: isBottom ? "top" : "bottom",
        }}
      >
        {props.items.map((item, index) => {
          return (
            <div
              className="text-center"
              key={index}
              onClick={() => {
                props.onChange(item);
              }}
            >
              {index !== 0 && (
                <hr
                  className={props.style.panel.item.separator.colorClass}
                  style={{
                    marginLeft: props.style.panel.item.separator.margin,
                    marginRight: props.style.panel.item.separator.margin,
                  }}
                />
              )}
              <div
                style={{
                  fontSize: props.style.panel.item.fontSize,
                  fontWeight: props.style.panel.item.fontWeight,
                  lineHeight: props.style.panel.item.lineHeight,
                  paddingBottom: props.style.panel.item.py,
                  paddingLeft: props.style.panel.item.px,
                  paddingRight: props.style.panel.item.px,
                  paddingTop: props.style.panel.item.py,
                }}
              >
                {item.text
                  ? item.text[props.locale]
                  : item.i18n
                  ? t(item.i18n.keyword, { ns: item.i18n.namespace })
                  : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
