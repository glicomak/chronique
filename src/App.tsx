import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import ContentPane from "./components/ContentPane";
import SidePane from "./components/SidePane";
import TagManager from "./components/TagManager";

import "./App.css";

function App() {
  const [entries, setEntries] = useState<EntryMetadata[]>([]);
  const [currentEntry, setCurrentEntry] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagMap, setTagMap] = useState<Record<string, Tag>>({});
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);

  useEffect(() => {
    invoke<EntryMetadata[]>("get_entries")
      .then((data) => setEntries(data))
      .catch((error) => console.error("Failed to fetch entries:", error));

    invoke<Tag[]>("get_tags")
      .then((data) => setTags(data))
      .catch((error) => console.error("Failed to fetch tags: ", error));
  }, []);

  useEffect(() => {
    const map: Record<string, Tag> = {};
    for (const tag of tags) {
      map[tag.id] = tag;
    }
    setTagMap(map);
  }, [tags]);


  return (
    <>
      <div className="h-screen w-screen flex">
        <SidePane setIsTagManagerOpen={setIsTagManagerOpen} entries={entries} setEntries={setEntries} currentEntry={currentEntry} setCurrentEntry={setCurrentEntry} />
        <ContentPane id={currentEntry} setEntries={setEntries} tagMap={tagMap} />
      </div>
      <TagManager tags={tags} setTags={setTags} isOpen={isTagManagerOpen} onClose={() => setIsTagManagerOpen(false)} />
    </>
  );
}

export default App;
