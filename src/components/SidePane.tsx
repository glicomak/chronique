import React, { SetStateAction } from "react";
import { invoke } from "@tauri-apps/api/core";

import { Plus, Tags } from "lucide-react";

import EntryItem from "./EntryItem";

function SidePane({
  setIsTagManagerOpen,
  entries,
  setEntries,
  currentEntry,
  setCurrentEntry,
  deleteEntry,
  tagMap
}: {
  setIsTagManagerOpen: React.Dispatch<SetStateAction<boolean>>,
  entries: EntryMetadata[],
  setEntries: React.Dispatch<SetStateAction<EntryMetadata[]>>,
  currentEntry: string | null,
  setCurrentEntry: React.Dispatch<SetStateAction<string | null>>,
  deleteEntry: (entryId: string) => void,
  tagMap: Record<string, Tag>
}) {
  return (
    <aside className="w-[20%] bg-(--color-bg-weak)">
      <div className="flex items-center justify-between m-4">
        <h1 className="text-xl font-medium">CHRONIQUE</h1>
        <div className="flex items-center gap-1">
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
      {entries.map(entry => (
        <EntryItem key={entry.id} entry={entry} isCurrentEntry={entry.id === currentEntry} setCurrentEntry={setCurrentEntry} deleteEntry={deleteEntry} tagMap={tagMap} />
      ))}
    </aside>
  );
}

export default SidePane;
