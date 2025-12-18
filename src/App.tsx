import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import ContentPane from "./components/ContentPane";
import SidePane from "./components/SidePane";

import "./App.css";

function App() {
  const [entries, setEntries] = useState<EntryMetadata[]>([]);
  const [currentEntry, setCurrentEntry] = useState<string | null>(null);

  useEffect(() => {
    invoke<EntryMetadata[]>("get_entries")
      .then((data) => setEntries(data))
      .catch((error) => console.error("Failed to fetch entries:", error));
  }, []);

  return (
    <div className="h-screen w-screen text-(--color-fg) flex">
      <SidePane entries={entries} setEntries={setEntries} currentEntry={currentEntry} setCurrentEntry={setCurrentEntry} />
      <ContentPane id={currentEntry} setEntries={setEntries} />
    </div>
  );
}

export default App;
