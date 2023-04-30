import * as React from "react";

export default function Button(props: {
  disabled?: boolean;
  onClick?: () => void;
  style: {
    additionalClass: string;
    backgroundColorClass: string;
    cornerRadius: string;
    disabledBackgroundColorClass?: string;
    disabledTextColorClass?: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    px: string;
    py: string;
    textColorClass: string;
  };
  text: string | React.ReactElement;
}) {
  return (
    <div
      className={`${props.style.additionalClass} ${
        props.disabled && props.style.disabledBackgroundColorClass
          ? props.style.disabledBackgroundColorClass
          : props.style.backgroundColorClass
      } ${
        props.disabled && props.style.disabledTextColorClass
          ? props.style.disabledTextColorClass
          : props.style.textColorClass
      } ${
        props.disabled ? "cursor-not-allowed" : "cursor-pointer"
      } text-center`}
      onClick={() => {
        if (!props.disabled && props.onClick) props.onClick();
      }}
      style={{
        borderRadius: props.style.cornerRadius,
        fontSize: props.style.fontSize,
        fontWeight: props.style.fontWeight,
        lineHeight: props.style.lineHeight,
        paddingBottom: props.style.py,
        paddingLeft: props.style.px,
        paddingRight: props.style.px,
        paddingTop: props.style.py,
      }}
    >
      {props.text}
    </div>
  );
}
