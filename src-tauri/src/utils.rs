use crate::models::Settings;

use std::fs;
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Manager};

pub const DATA_DIR_NAME: &str = "chronique-data";

pub fn get_dir(app: &AppHandle, relative: impl AsRef<Path>) -> PathBuf {
    let settings = read_settings(app);
    let mut path = PathBuf::from(settings.data_path);
    path.push(DATA_DIR_NAME);
    path.push(relative);
    fs::create_dir_all(&path)
        .expect("failed to create directory");
    path
}

pub fn read_settings(app: &AppHandle) -> Settings {
    let mut settings_path = app
        .path()
        .app_data_dir()
        .expect("app data dir not found");
    fs::create_dir_all(&settings_path)
        .expect("failed to create app data dir");
    settings_path.push("settings.json");

    let default = Settings {
        data_path: app
            .path()
            .app_data_dir()
            .expect("app data dir not found")
            .to_string_lossy()
            .to_string(),
    };
    if !settings_path.exists() {
        let json = serde_json::to_string_pretty(&default)
            .expect("failed to serialize default settings");
        fs::write(&settings_path, json)
            .expect("failed to write settings.json");
        return default;
    }

    let contents = fs::read_to_string(&settings_path)
        .expect("failed to read settings.json");
    serde_json::from_str(&contents)
        .expect("invalid settings.json")
}

pub fn move_dir_contents(src: &Path, dst: &Path) -> Result<(), String> {
    fs::create_dir_all(dst).map_err(|e| e.to_string())?;

    for entry in fs::read_dir(src).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());

        if src_path.is_dir() {
            move_dir_contents(&src_path, &dst_path)?;
            fs::remove_dir(&src_path).map_err(|e| e.to_string())?;
        } else {
            fs::rename(&src_path, &dst_path)
                .or_else(|_| {
                    fs::copy(&src_path, &dst_path)
                        .and_then(|_| fs::remove_file(&src_path))
                })
                .map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}
