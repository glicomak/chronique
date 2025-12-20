import { SetStateAction, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import { Save } from "lucide-react";

function TagItem({
  tag,
  setTags
}: {
  tag: Tag,
  setTags: React.Dispatch<SetStateAction<Tag[]>>
}) {
  const id = tag.id;

  const [name, setName] = useState<string>(tag.name);
  const [bgColor, setBgColor] = useState<string>(tag.bgColor);
  const [fgColor, setFgColor] = useState<string>(tag.fgColor);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-2 rounded px-2 py-1">
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setIsDirty(true);
        }}
        className="flex-1 bg-transparent outline-none text-sm"
      />

      <input
        type="color"
        value={bgColor}
        onChange={(e) => {
          setBgColor(e.target.value);
          setIsDirty(true);
        }}
        className="h-6 w-6 cursor-pointer rounded border-none bg-transparent p-0"
      />

      <input
        type="color"
        value={fgColor}
        onChange={(e) => {
          setFgColor(e.target.value);
          setIsDirty(true);
        }}
        className="h-6 w-6 cursor-pointer rounded border-none bg-transparent p-0"
      />

      <button
        className={`h-7 w-7 flex items-center justify-center rounded transition-colors
          ${isDirty
            ? "hover:bg-white/10 cursor-pointer"
            : "opacity-40 cursor-default pointer-events-none"
        }`}
        onClick={() => {
          invoke<Tag>("update_tag", { id, name, bgColor, fgColor })
            .then((savedTag) => {
              setTags(prev => prev.map(tag => tag.id === savedTag.id ? savedTag : tag));
            });
          setIsDirty(false);
        }}
      >
        <Save size={14} />
      </button>
    </div>
  );
}

export default TagItem;
