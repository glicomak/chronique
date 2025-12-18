import React, { SetStateAction, useEffect, useState } from "react";

import { invoke } from "@tauri-apps/api/core";

import EntryItem from "./EntryItem";

function SidePane({ setCurrentEntry }: { setCurrentEntry: React.Dispatch<SetStateAction<String | null>> }) {
  const [entries, setEntries] = useState<EntryMetadata[]>([]);

  useEffect(() => {
    invoke<EntryMetadata[]>("get_entries")
      .then((data) => setEntries(data))
      .catch((error) => console.error("Failed to fetch entries:", error));
  }, []);

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
