import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function ContentPane({
  id,
  setEntries
}: {
  id: string | null,
  setEntries: React.Dispatch<SetStateAction<EntryMetadata[]>>
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [datetimeFormatted, setDatetimeFormatted] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!id) return;

    invoke<Entry>("get_entry", { id })
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
        setIsDirty(false);

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
            <h2 className="mb-4 text-lg">{datetimeFormatted}</h2>
          )}

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
