import * as React from "react";

export default function Dropdown(props: {
  button: React.ReactElement;
  disabled?: boolean;
  fullWidth?: boolean;
  horizontalAlignment: "left" | "center" | "right";
  horizontalPanelAnchor: "left" | "center" | "right";
  origin:
    | "origin-center"
    | "origin-top"
    | "origin-top-right"
    | "origin-right"
    | "origin-bottom-right"
    | "origin-bottom"
    | "origin-bottom-left"
    | "origin-left"
    | "origin-top-left";
  panel: React.ReactElement;
  verticalAlignment: "top" | "center" | "bottom";
  verticalPanelAnchor: "top" | "center" | "bottom";
}) {
  const [isOpened, setIsOpened] = React.useState(false);

  React.useEffect(() => {
    if (window && isOpened) {
      window.addEventListener(
        "click",
        () => {
          setIsOpened(false);
        },
        { once: true }
      );
    }
  }, [isOpened]);

  return (
    <div className="relative">
      <div
        onClick={() => {
          if (!props.disabled && !isOpened) {
            setIsOpened(true);
          }
        }}
      >
        {props.button}
      </div>
      <div
        className={`${isOpened ? "scale-y-100 " : "scale-y-0 "}${
          props.horizontalAlignment === "center" ? "left-2/4 " : ""
        }${props.horizontalAlignment === "right" ? "left-full " : ""}${
          props.horizontalPanelAnchor === "center" ? "-translate-x-2/4 " : ""
        }${
          props.horizontalPanelAnchor === "right" ? "-translate-x-full " : ""
        }${props.verticalAlignment === "top" ? "top-0 " : ""}${
          props.verticalAlignment === "center" ? "top-2/4 " : ""
        }${props.verticalPanelAnchor === "center" ? "-translate-y-2/4 " : ""}${
          props.verticalPanelAnchor === "bottom" ? "-translate-y-full " : ""
        }${props.fullWidth ? "w-full " : ""}${
          props.origin
        } absolute z-10 transition`}
      >
        {props.panel}
      </div>
    </div>
  );
}
