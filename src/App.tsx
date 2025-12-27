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
      .catch((error) => console.error("Failed to fetch tags:", error));
  }, []);

  useEffect(() => {
    const map: Record<string, Tag> = {};
    for (const tag of tags) {
      map[tag.id] = tag;
    }
    setTagMap(map);
  }, [tags]);

  function deleteEntry(entryId: string) {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));

    invoke("delete_entry", { entryId }).catch(err => {
      console.error("Failed to delete entry:", err);
    });
  }

  function deleteTag(tagId: string) {
    setTags(prev => prev.filter(tag => tag.id !== tagId));

    setTagMap(prev => {
      const { [tagId]: _, ...rest } = prev;
      return rest;
    });

    setEntries(prev =>
      prev.map(entry => ({
        ...entry,
        tags: entry.tags.filter(tid => tid !== tagId)
      }))
    );

    invoke("delete_tag", { tagId }).catch(err => {
      console.error("Failed to delete tag: ", err);
    });
  }

  return (
    <>
      <div className="h-screen w-screen flex">
        <SidePane setIsTagManagerOpen={setIsTagManagerOpen} entries={entries} setEntries={setEntries} currentEntry={currentEntry} setCurrentEntry={setCurrentEntry} deleteEntry={deleteEntry} tagMap={tagMap} />
        <ContentPane id={currentEntry} setEntries={setEntries} tagMap={tagMap} />
      </div>
      <TagManager tags={tags} setTags={setTags} deleteTag={deleteTag} isOpen={isTagManagerOpen} onClose={() => setIsTagManagerOpen(false)} />
    </>
  );
}

export default App;
