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
    <div className="h-screen w-screen flex">
      <SidePane entries={entries} setEntries={setEntries} setCurrentEntry={setCurrentEntry} />
      <ContentPane id={currentEntry} setEntries={setEntries} />
    </div>
  );
}

export default App;
