import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function ContentPane({
  id,
  setEntries,
  tagMap
}: {
  id: string | null,
  setEntries: React.Dispatch<SetStateAction<EntryMetadata[]>>
  tagMap: Record<string, Tag>
}) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [datetimeFormatted, setDatetimeFormatted] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    invoke<Entry>("get_entry", { id })
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags);

        const datetimeObject = new Date(data.datetime);
        const date = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }).format(datetimeObject);
        const day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(datetimeObject);
        const time = new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }).format(datetimeObject);

        setDatetimeFormatted(`${date} | ${day} | ${time}`);
        setIsDirty(false);
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    setEntries(prev =>
      prev.map(e =>
        e.id === id ? { ...e, title } : e
      )
    );
  }, [title, id, setEntries]);

  const saveEntry = useCallback(async () => {
    if (!id || !isDirty) return;

    await invoke("update_entry", { id, title, content });
    setIsDirty(false);
  }, [id, title, content, isDirty]);

  useEffect(() => {
    if (!isDirty || !id) return;

    const timeout = window.setTimeout(saveEntry, 3000);
    return () => clearTimeout(timeout);
  }, [title, content, isDirty, id, saveEntry]);

  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState<boolean>(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    setAvailableTags(Object.values(tagMap).filter(
      tag => !tags.includes(tag.id)
    ));
  }, [tags]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [content]);

  return (
    <main className="flex-1 bg-(--color-bg-strong) p-4">
      {id ? (
        <>
          <p className="mb-4">
            {isDirty ? (
              <span className="text-(--color-fg-danger)">Unsaved</span>
            ) : (
              <span className="text-(--color-fg-success)">Saved</span>
            )}
          </p>

          <input
            placeholder={datetimeFormatted}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsDirty(true);
            }}
            className="w-full mb-4 text-2xl font-medium outline-none placeholder:text-(--color-fg)"
          />

          {title !== "" && (
            <h2 className="text-lg mb-4">{datetimeFormatted}</h2>
          )}

          <div className="mb-6 flex flex-wrap items-center gap-2">
            {[...tags]
              .sort((a, b) => 
                (tagMap[a]?.name || "").localeCompare(tagMap[b]?.name || "")
              ).map(tagId => {
                const tag = tagMap[tagId];
                if (!tag) return null;

                return (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1 rounded px-2 py-0.5 text-sm"
                    style={{
                      backgroundColor: tag.bgColor,
                      color: tag.fgColor
                    }}
                  >
                    <span>{tag.name}</span>
                    <button
                      className="ml-1 rounded hover:bg-black/10 px-1 transition-all cursor-pointer"
                      onClick={() => {
                        invoke("remove_tag_from_entry", { entryId: id, tagId: tag.id });
                        setTags(prev => prev.filter(tid => tid !== tag.id));
                        setEntries(prev =>
                          prev.map(e =>
                            e.id === id
                              ? { ...e, tags: e.tags.filter(tid => tid !== tag.id) }
                              : e
                          )
                        );
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })
            }

            <div className="relative">
              <button
                className="h-6 w-6 flex items-center justify-center rounded
                          border border-dashed border-white/30 cursor-pointer
                          text-sm hover:bg-white/10 transition-all"
                onClick={() => setIsTagDropdownOpen(prev => !prev)}
              >
                +
              </button>

              {isTagDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-1 z-20
                            min-w-35 rounded bg-[#252526]
                            border border-white/10 shadow-lg"
                >
                  {availableTags.length === 0 ? (
                    <div className="px-2 py-1 text-sm text-white/50">
                      No tags
                    </div>
                  ) : (
                    availableTags.map(tag => (
                      <button
                        key={tag.id}
                        className="w-full text-left px-2 py-1 text-sm
                                  hover:bg-white/10 transition-colors"
                        onClick={() => {
                          invoke("add_tag_to_entry", { entryId: id, tagId: tag.id });
                          setTags(prev => [...prev, tag.id]);
                          setEntries(prev =>
                            prev.map(e =>
                              e.id === id
                                ? { ...e, tags: [...e.tags, tag.id] }
                                : e
                            )
                          );
                          setIsTagDropdownOpen(false);
                        }}
                      >
                        {tag.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsDirty(true);
            }}
            className="w-full resize-none overflow-hidden outline-none"
            rows={1}
          />
        </>
      ) : (
        <p>Click on an entry in the sidepane to view its content.</p>
      )}
    </main>
  );
}

export default ContentPane;
