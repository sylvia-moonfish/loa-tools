import * as React from "react";

export default function Modal(props: {
  children: React.ReactElement;
  closeWhenClickedOutside: boolean;
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  style: { backgroundColor: string };
}) {
  return (
    <div>
      <div
        onClick={() => {
          if (props.closeWhenClickedOutside) props.setIsOpened(false);
        }}
        style={{
          backgroundColor: props.style.backgroundColor,
          display: props.isOpened ? undefined : "none",
          height: "100vh",
          left: "0",
          position: "fixed",
          top: "0",
          width: "100vw",
          zIndex: "998",
        }}
      ></div>
      <div
        className="transition"
        style={{
          left: "50%",
          maxHeight: "100vh",
          maxWidth: "100vw",
          overflowX: "auto",
          position: "fixed",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${
            props.isOpened ? "1, 1" : "0, 0"
          })`,
          zIndex: "999",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
