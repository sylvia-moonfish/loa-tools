import * as React from "react";

export default function Checkbox(props: {
  isChecked: boolean;
  onClick: () => void;
  style: {
    gap: string | undefined;
    box: {
      backgroundColorClass: string;
      checkColorClass: string;
      size: number;
    };
    text?: {
      fontSize: string;
      fontWeight: string;
      lineHeight: string;
    };
  };
  text?: string;
}) {
  return (
    <div
      className="flex cursor-pointer items-center"
      onClick={props.onClick}
      style={{ gap: props.style.gap }}
    >
      <div
        className={`${props.style.box.backgroundColorClass} flex items-center justify-center`}
        style={{
          borderRadius: `${props.style.box.size / 4}rem`,
          height: `${props.style.box.size}rem`,
          width: `${props.style.box.size}rem`,
        }}
      >
        {props.isChecked && (
          <span
            className={`${props.style.box.checkColorClass} material-symbols-outlined`}
            style={{
              fontSize: `${props.style.box.size}rem`,
            }}
          >
            check
          </span>
        )}
      </div>
      {props.text && (
        <div
          style={{
            fontSize: props.style.text?.fontSize,
            fontWeight: props.style.text?.fontWeight,
            lineHeight: props.style.text?.lineHeight,
          }}
        >
          {props.text}
        </div>
      )}
    </div>
  );
}
