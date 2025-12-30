use crate::models::Settings;
use crate::utils::{DATA_DIR_NAME, move_dir_contents, read_settings};

use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn get_settings(app: AppHandle) -> Result<Settings, String> {
    let settings = read_settings(&app);
    Ok(settings)
}

#[tauri::command]
pub fn update_settings(app: AppHandle, data_path: String) -> Result<Settings, String> {
    let mut settings = read_settings(&app);

    let old_path = PathBuf::from(&settings.data_path).join(DATA_DIR_NAME);
    let new_path = PathBuf::from(&data_path).join(DATA_DIR_NAME);

    if old_path == new_path {
        return Ok(settings);
    }
    fs::create_dir_all(&new_path).map_err(|e| e.to_string())?;
    if old_path.exists() {
        move_dir_contents(&old_path, &new_path)?;
        fs::remove_dir_all(&old_path).map_err(|e| e.to_string())?;
    }

    settings.data_path = data_path;
    let config_dir = app
        .path()
        .app_config_dir()
        .expect("config dir not found");
    let settings_path = config_dir.join("settings.json");
    let json = serde_json::to_string_pretty(&settings)
        .map_err(|e| e.to_string())?;
    fs::write(settings_path, json).map_err(|e| e.to_string())?;

    Ok(settings)
}
