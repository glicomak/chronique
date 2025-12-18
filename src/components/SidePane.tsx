import React, { SetStateAction } from "react";
import { invoke } from "@tauri-apps/api/core";

import { Plus } from "lucide-react";

import EntryItem from "./EntryItem";

function SidePane({
  entries,
  setEntries,
  currentEntry,
  setCurrentEntry
}: {
  entries: EntryMetadata[],
  setEntries: React.Dispatch<SetStateAction<EntryMetadata[]>>,
  currentEntry: string | null,
  setCurrentEntry: React.Dispatch<SetStateAction<string | null>>
}) {
  return (
    <aside className="w-[20%] bg-(--color-bg-weak)">
      <div className="flex items-center justify-between m-4">
        <h1 className="text-xl font-medium">CHRONIQUE</h1>
        <button
          className="h-8 w-8 cursor-pointer flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          onClick={() =>
            invoke<EntryMetadata>("create_entry")
              .then((data) => setEntries(prev => [data, ...prev]))
          }
        >
          <Plus size={18} strokeWidth={2} />
        </button>
      </div>
      {entries.map(entry => (
        <EntryItem entry={entry} isCurrentEntry={entry.id === currentEntry} setCurrentEntry={setCurrentEntry} />
      ))}
    </aside>
  );
}

export default SidePane;
