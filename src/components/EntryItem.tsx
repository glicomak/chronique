import React, { SetStateAction } from "react";

function EntryItem({
  entry,
  isCurrentEntry,
  setCurrentEntry,
}: {
  entry: EntryMetadata,
  isCurrentEntry: boolean,
  setCurrentEntry: React.Dispatch<SetStateAction<string | null>>
}) {
  const datetimeObject = new Date(entry.datetime);
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(datetimeObject);
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(datetimeObject);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(datetimeObject);
  const datetimeFormatted = `${date} | ${day} | ${time}`

  return (
    <div
      className={`px-4 py-4 h-16 cursor-pointer grid grid-rows-2 items-center gap-y-4 ${
        isCurrentEntry ? "bg-(--color-bg-strong)": "hover:bg-(--color-bg-medium)"
      } transition-colors`}
      onClick={() => setCurrentEntry(entry.id)}
    >
      <p className={`text-sm leading-tight ${entry.title ? "" : "row-span-2 self-center"}`}>
        {datetimeFormatted}
      </p>
      {entry.title && (
        <p className="text-sm leading-tight">
          {entry.title}
        </p>
      )}
    </div>
  );
}

export default EntryItem;
