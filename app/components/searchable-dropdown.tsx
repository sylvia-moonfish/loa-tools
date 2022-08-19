import type { ItemType } from "~/components/dropdown";
import type { LocaleType } from "~/i18n";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function SearchableDropdown(props: {
  items: ItemType[];
  locale: LocaleType;
  onFilter: (text: string) => void;
  onSelect: (item: ItemType | undefined) => void;
  placeholder?: string;
  selected: ItemType | undefined;
  style: {
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
    selectInput: {
      backgroundColorClass: string;
      cornerRadius: string;
      fontSize: string;
      fontWeight: string;
      inactiveTextColorClass: string;
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
  const [maxHeight, setMaxHeight] = React.useState<number>(
    props.style.panel.maxHeight
  );
  const [isFocused, setIsFocused] = React.useState(false);
  const [inputText, setInputText] = React.useState("");

  const selectInput = React.useRef<HTMLInputElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);

  function close() {
    setIsOpened(false);
  }

  function setHeight() {
    setWindowHeight(window.innerHeight);
  }

  function focusIn() {
    setInputText("");
    props.onSelect(undefined);
    setIsFocused(true);
  }

  function focusOut() {
    setIsFocused(false);
  }

  React.useEffect(() => {
    if (document) {
      setFontSize(
        parseFloat(
          getComputedStyle(document.documentElement).fontSize.replace("px", "")
        )
      );
    }

    if (selectInput.current) {
      selectInput.current.addEventListener("focusin", focusIn);
      selectInput.current.addEventListener("focusout", focusOut);
    }

    if (window) {
      setHeight();
      window.addEventListener("resize", setHeight);
    }

    return () => {
      if (selectInput.current) {
        selectInput.current.removeEventListener("focusin", focusIn);
        selectInput.current.removeEventListener("focusout", focusOut);
      }

      if (window) {
        window.removeEventListener("resize", setHeight);
      }
    };
  });

  React.useEffect(() => {
    if (window && isOpened) {
      window.addEventListener("click", close, { once: true });
    }

    return () => {
      if (window) {
        window.removeEventListener("click", close);
      }
    };
  }, [isOpened]);

  React.useEffect(() => {
    if (selectInput.current && windowHeight) {
      const rect = selectInput.current.getBoundingClientRect();
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

  React.useEffect(() => {
    props.onFilter(inputText);
  }, [inputText, props.locale]);

  const inputElement = (value: string) => {
    return (
      <input
        className={`${
          isFocused || props.selected
            ? ""
            : `${props.style.selectInput.inactiveTextColorClass} `
        }${props.style.selectInput.backgroundColorClass} w-full`}
        onChange={(e) => {
          if (props.items.length > 0 && !isOpened) setIsOpened(true);
          setInputText(e.target.value);
        }}
        onClick={() => {
          if (props.items.length > 0 && !isOpened) setIsOpened(true);
        }}
        style={{
          borderRadius: props.style.selectInput.cornerRadius,
          fontSize: props.style.selectInput.fontSize,
          fontWeight: props.style.selectInput.fontWeight,
          lineHeight: props.style.selectInput.lineHeight,
          paddingBottom: props.style.selectInput.py,
          paddingLeft: props.style.selectInput.px,
          paddingRight: props.style.selectInput.px,
          paddingTop: props.style.selectInput.py,
        }}
        ref={selectInput}
        type="text"
        value={value}
      />
    );
  };

  return (
    <div className="relative">
      {isFocused
        ? inputElement(inputText)
        : props.selected
        ? inputElement(
            props.selected.text
              ? props.selected.text[props.locale]
              : props.selected.i18n
              ? t(props.selected.i18n.keyword, {
                  ns: props.selected.i18n.namespace,
                })
              : ""
          )
        : inputElement(props.placeholder ?? "")}
      <div
        className={`${props.style.panel.backgroundColorClass} ${props.style.panel.borderColorClass} absolute z-20 flex flex-col items-stretch justify-items-stretch overflow-y-auto overflow-x-hidden transition`}
        ref={panel}
        style={{
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
                props.onSelect(item);
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
