import React, { SetStateAction, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import { Plus, Settings, Tags } from "lucide-react";

import EntryItem from "./EntryItem";

function SidePane({
  setIsTagManagerOpen,
  setIsSettingsOpen,
  entries,
  setEntries,
  currentEntry,
  setCurrentEntry,
  deleteEntry,
  tagMap
}: {
  setIsTagManagerOpen: React.Dispatch<SetStateAction<boolean>>,
  setIsSettingsOpen: React.Dispatch<SetStateAction<boolean>>,
  entries: EntryMetadata[],
  setEntries: React.Dispatch<SetStateAction<EntryMetadata[]>>,
  currentEntry: string | null,
  setCurrentEntry: React.Dispatch<SetStateAction<string | null>>,
  deleteEntry: (entryId: string) => void,
  tagMap: Record<string, Tag>
}) {
  const [filterTagId, setFilterTagId] = useState<string | null>(null);

  return (
    <aside className="w-[20%] bg-(--color-bg-weak) flex flex-col h-screen">
      <div className="shrink-0">
        <div className="flex items-center justify-between m-4">
          <h1 className="text-xl font-medium">CHRONIQUE</h1>
          <div className="flex items-center gap-1">
            <button
              className="h-8 w-8 flex items-center justify-center rounded
                        hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings size={18} strokeWidth={2} />
            </button>
            <button
              className="h-8 w-8 flex items-center justify-center rounded
                        hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setIsTagManagerOpen(true)}
            >
              <Tags size={18} strokeWidth={2} />
            </button>
            <button
              className="h-8 w-8 flex items-center justify-center rounded
                        hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() =>
                invoke<EntryMetadata>("create_entry")
                  .then((data) => setEntries(prev => [data, ...prev]))
              }
            >
              <Plus size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="m-4">
          <select
            className="w-full bg-(--color-bg-medium) text-sm rounded px-2 py-1
                      outline-none cursor-pointer"
            value={filterTagId ?? ""}
            onChange={(e) =>
              setFilterTagId(e.target.value === "" ? null : e.target.value)
            }
          >
            <option value="">All</option>

            {Object.values(tagMap)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {entries
          .filter(entry =>
            filterTagId ? entry.tags.includes(filterTagId) : true
          )
          .map(entry => (
            <EntryItem
              key={entry.id}
              entry={entry}
              isCurrentEntry={entry.id === currentEntry}
              setCurrentEntry={setCurrentEntry}
              deleteEntry={deleteEntry}
              tagMap={tagMap}
            />
        ))}
      </div>
    </aside>
  );
}

export default SidePane;
