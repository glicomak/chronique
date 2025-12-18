import React, { SetStateAction } from "react";

function EntryItem({ entry, setCurrentEntry }: { entry: EntryMetadata, setCurrentEntry: React.Dispatch<SetStateAction<String | null>> }) {
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

  return (
    <div className="px-4 py-2 cursor-pointer" onClick={() => setCurrentEntry(entry.id)}>
      <p>{date} | {day} | {time}</p>
      <p>{entry.title}</p>
    </div>
  )
}

export default EntryItem;
