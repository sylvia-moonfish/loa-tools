import * as React from "react";

export default function Checkbox(props: {
  boxSizeRem: number;
  checked: boolean;
  children: string;
  divClassName: string;
  onClick: () => void;
  textClassName: string;
}) {
  const uncheckedBoxSize = (props.boxSizeRem / 10) * 8;
  const uncheckedBoxMarginSize = props.boxSizeRem / 10;
  const uncheckedBoxRoundedSize = parseFloat(
    (props.boxSizeRem * 0.25).toFixed(2)
  );

  return (
    <div
      className={`${props.divClassName} flex cursor-pointer items-center`}
      onClick={props.onClick}
    >
      {props.checked ? (
        <span
          className="material-symbols-outlined filled-icon"
          style={{
            fontSize: `${props.boxSizeRem}rem`,
          }}
        >
          priority
        </span>
      ) : (
        <span
          style={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            borderRadius: `${uncheckedBoxRoundedSize}rem`,
            height: `${uncheckedBoxSize}rem`,
            margin: `${uncheckedBoxMarginSize}rem`,
            width: `${uncheckedBoxSize}rem`,
          }}
        />
      )}
      <div className={`${props.textClassName} overflow-hidden text-ellipsis`}>
        {props.children}
      </div>
    </div>
  );
}
