import { SetStateAction } from "react";
import { invoke } from "@tauri-apps/api/core";

import { Plus } from "lucide-react";

import TagItem from "./TagItem";

function TagManager({
  tags,
  setTags,
  isOpen,
  onClose
}: {
  tags: Tag[],
  setTags: React.Dispatch<SetStateAction<Tag[]>>,
  isOpen: boolean,
  onClose: () => void
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/75"
        onClick={onClose}
      />
      <div className="relative bg-(--color-bg-medium) rounded p-6 z-10">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-medium">Tag Management</h1>

          <button
            className="h-8 w-8 flex items-center justify-center rounded
                       hover:bg-white/10 transition-colors"
            aria-label="Create tag"
          >
            <Plus size={18} onClick={() =>
              invoke<Tag>("create_tag")
                .then((data) => setTags(prev => [data, ...prev]))
            } />
          </button>
        </div>

        {tags.length > 0 ? (
          <div className="flex flex-col gap-2">
            {tags
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(tag => (
                <TagItem key={tag.id} tag={tag} setTags={setTags} />
              ))
            }
          </div>
        ) : (
          <p>Create tags to view and edit them here.</p>
        )}
      </div>
    </div>
  );
}

export default TagManager;
