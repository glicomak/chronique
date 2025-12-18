import React, { SetStateAction } from "react";
import { invoke } from "@tauri-apps/api/core";

import EntryItem from "./EntryItem";

function SidePane({
  entries,
  setEntries,
  setCurrentEntry
}: {
  entries: EntryMetadata[],
  setEntries: React.Dispatch<SetStateAction<EntryMetadata[]>>,
  setCurrentEntry: React.Dispatch<SetStateAction<string | null>>
}) {
  return (
    <aside className="w-[20%] bg-[#2d2d2e]">
      <h1 className="m-4 text-xl font-medium">CHRONIQUE</h1>
      <button
        className="mx-4 my-2 py-2 px-4 rounded bg-blue-500 text-white"
        onClick={() => invoke<EntryMetadata>("create_entry").then((data) => setEntries(prev => [data, ...prev]))}
      >
        New entry
      </button>
      {entries.map(entry => (
        <EntryItem entry={entry} setCurrentEntry={setCurrentEntry} />
      ))}
    </aside>
  )
}

export default SidePane;
