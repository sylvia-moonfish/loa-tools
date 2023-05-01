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
        borderRadius: props.style.cornerRadius
          ? props.style.cornerRadius
          : undefined,
        fontSize: props.style.fontSize ? props.style.fontSize : undefined,
        fontWeight: props.style.fontWeight ? props.style.fontWeight : undefined,
        lineHeight: props.style.lineHeight ? props.style.lineHeight : undefined,
        paddingBottom: props.style.py ? props.style.py : undefined,
        paddingLeft: props.style.px ? props.style.px : undefined,
        paddingRight: props.style.px ? props.style.px : undefined,
        paddingTop: props.style.py ? props.style.py : undefined,
      }}
    >
      {props.text}
    </div>
  );
}
