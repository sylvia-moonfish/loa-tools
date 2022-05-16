export default function GoToTopButton() {
  return (
    <div
      className="fixed right-[1.875rem] bottom-[8.75rem] flex h-[3.125rem] w-[3.125rem] cursor-pointer items-center justify-center rounded-full bg-loa-button"
      onClick={() => {
        if (window) {
          window.scrollTo(0, 0);
        }
      }}
    >
      <span className="material-symbols-outlined text-[2.25rem] text-loa-button-gray">
        keyboard_double_arrow_up
      </span>
    </div>
  );
}
