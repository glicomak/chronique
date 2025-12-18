import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function ContentPane({ currentEntry }: { currentEntry: String | null }) {
  const [entry, setEntry] = useState<Entry | null>(null);

  useEffect(() => {
    if (currentEntry === null) {
      return;
    }
    invoke<Entry>("get_entry", { id: currentEntry })
      .then((data) => setEntry(data))
      .catch((error) => console.error("Failed to fetch entry:", error));
  }, [currentEntry]);

  return (
    <main className="flex-1 bg-[#181717] p-4">
      {entry !== null ? (
        <>
          <h1 className="mb-4 text-2xl font-medium">{entry.title}</h1>
          <p>{entry.content}</p>
        </>
      ) : (
        <p>Click on an entry in the sidepane to view its content.</p>
      )}
    </main>
  )
}

export default ContentPane;
