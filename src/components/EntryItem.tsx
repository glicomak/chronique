import React, { SetStateAction, useState } from "react";

import { Trash } from "lucide-react";

function EntryItem({
  entry,
  isCurrentEntry,
  setCurrentEntry,
  deleteEntry,
  tagMap
}: {
  entry: EntryMetadata,
  isCurrentEntry: boolean,
  setCurrentEntry: React.Dispatch<SetStateAction<string | null>>,
  deleteEntry: (entryId: string) => void,
  tagMap: Record<string, Tag>
}) {
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState<boolean>(false);

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
      className={`px-4 py-3 transition-colors h-21 ${
        isCurrentEntry
          ? "bg-(--color-bg-strong)"
          : "hover:bg-(--color-bg-medium)"
      }`}
    >
      <div className="flex items-center justify-between h-full">
        <div
          className="flex flex-col justify-center gap-1 cursor-pointer"
          onClick={() => setCurrentEntry(entry.id)}
        >
          <p className="text-sm leading-tight">
            {datetimeFormatted}
          </p>

          {entry.title && (
            <p className="text-sm leading-tight font-medium truncate">
              {entry.title}
            </p>
          )}

          {entry.tags.length > 0 && (
            <div className="flex gap-1 mt-1">
              {[...entry.tags]
                .sort((a, b) => 
                  (tagMap[a]?.name || "").localeCompare(tagMap[b]?.name || "")
                ).map(tagId => {
                  const tag = tagMap[tagId];
                  if (!tag) return null;
                  return (
                    <div
                      key={tagId}
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: tag.bgColor }}
                      title={tag.name}
                    />
                  );
                })
              }
            </div>
          )}
        </div>

        <button
          className={`ml-3 h-7 w-7 shrink-0 flex items-center justify-center rounded
                    hover:bg-white/10 transition-colors
                    ${!isCurrentEntry
                      ? "hover:bg-white/10 cursor-pointer"
                      : "opacity-40 cursor-default pointer-events-none"}
                    ${isDeleteConfirmed && "text-(--color-fg-danger)"}`}
          onClick={() => {
            if (isCurrentEntry) {
              return;
            }
            if (isDeleteConfirmed) {
              deleteEntry(entry.id);
              setIsDeleteConfirmed(false);
            } else {
              setIsDeleteConfirmed(true);
              setTimeout(() => setIsDeleteConfirmed(false), 2000);
            }
          }}
        >
          <Trash size={14} />
        </button>
      </div>
    </div>
  );
}

export default EntryItem;
