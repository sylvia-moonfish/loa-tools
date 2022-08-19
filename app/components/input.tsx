import * as React from "react";

export default function Input(props: {
  disabled?: boolean;
  invalid?: boolean;
  onChange: (text: string) => void;
  placeholder?: string;
  style: {
    additionalClass?: string;
    backgroundColorClass: string;
    cornerRadius: string;
    fontSize: string;
    fontWeight: string;
    inactiveTextColorClass?: string;
    invalid?: { outlineColorClass: string; outlineWidth: string };
    lineHeight: string;
    px: string;
    py: string;
    textColorClass: string;
  };
  text: string;
  type: "text" | "number" | "datetime-local";
}) {
  const [isFocused, setIsFocused] = React.useState(false);

  const input = React.useRef<HTMLInputElement>(null);

  function focusIn() {
    setIsFocused(true);
  }

  function focusOut() {
    setIsFocused(false);
  }

  React.useEffect(() => {
    if (input.current) {
      input.current.addEventListener("focusin", focusIn);
      input.current.addEventListener("focusout", focusOut);
    }

    return () => {
      if (input.current) {
        input.current.removeEventListener("focusin", focusIn);
        input.current.removeEventListener("focusout", focusOut);
      }
    };
  });

  const inputElement = (value: string) => {
    return (
      <input
        className={`${
          props.text && props.text.length > 0
            ? props.style.textColorClass
            : `${props.style.inactiveTextColorClass ?? ""} `
        } ${props.style.additionalClass} ${props.style.backgroundColorClass} ${
          props.invalid && props.style.invalid
            ? props.style.invalid.outlineColorClass
            : ""
        }`}
        disabled={props.disabled}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
        style={{
          borderRadius: props.style.cornerRadius,
          fontSize: props.style.fontSize,
          fontWeight: props.style.fontWeight,
          lineHeight: props.style.lineHeight,
          outlineStyle:
            props.invalid && props.style.invalid ? "solid" : undefined,
          outlineWidth:
            props.invalid && props.style.invalid
              ? props.style.invalid.outlineWidth
              : undefined,
          paddingBottom: props.style.py,
          paddingLeft: props.style.px,
          paddingRight: props.style.px,
          paddingTop: props.style.py,
        }}
        ref={input}
        type={props.type}
        value={value}
      />
    );
  };

  return (
    <>
      {isFocused || props.text.length > 0
        ? inputElement(props.text)
        : inputElement(props.placeholder ?? "")}
    </>
  );
}
