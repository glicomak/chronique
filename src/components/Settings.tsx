import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

import { FolderOpen } from "lucide-react";

function Settings({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    invoke<Settings>("get_settings")
      .then((data) => setSettings(data))
      .catch((error) => console.error("Failed to fetch settings:", error));
  }, []);

  const handleChooseFolder = async () => {
    const dataPath = await open({
      multiple: false,
      directory: true
    });

    if (typeof dataPath === "string") {
      invoke<Settings>("update_settings", { dataPath })
        .then((data) => setSettings(data))
        .catch((error) => console.error("Failed to update settings:", error));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/75"
        onClick={onClose}
      />

      <div className="relative bg-(--color-bg-medium) rounded p-6 z-10">
        <h1 className="text-lg font-medium mb-4">Settings</h1>

        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <p className="mb-2">Storage Location</p>

            <div className="flex items-center gap-2 rounded px-2 py-1
                            bg-(--color-bg-weak) text-sm font-mono text-white/90">
              <span className="truncate">
                {settings?.dataPath ?? "Not set"}
              </span>

              <button
                className="h-6 w-6 flex items-center justify-center rounded
                          hover:bg-white/10 transition-colors cursor-pointer"
                onClick={handleChooseFolder}
                title="Change folder"
              >
                <FolderOpen size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
