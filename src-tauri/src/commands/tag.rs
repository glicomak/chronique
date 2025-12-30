use crate::models::Tag;
use crate::utils::get_dir;

use std::fs::{self, File};
use std::io::Write;
use tauri::AppHandle;
use uuid::Uuid;

#[tauri::command]
pub fn create_tag(app: AppHandle) -> Result<Tag, String> {
    let id = Uuid::new_v4().to_string();
    let tag_path = get_dir(&app, format!("tags/{id}"));

    let metadata = Tag {
        id,
        name: "Untitled".to_string(),
        bg_color: "#ffffff".to_string(),
        fg_color: "#000000".to_string(),
    };

    let mut metadata_path = tag_path.clone();
    metadata_path.push("metadata.json");
    let metadata_json = serde_json::to_string_pretty(&metadata).map_err(|e| e.to_string())?;
    let mut metadata_file = File::create(metadata_path).map_err(|e| e.to_string())?;
    metadata_file
        .write_all(metadata_json.as_bytes())
        .map_err(|e| e.to_string())?;

    let mut entries_path = tag_path.clone();
    entries_path.push("entries.txt");
    File::create(entries_path).map_err(|e| e.to_string())?;

    Ok(metadata)
}

#[tauri::command]
pub fn delete_tag(app: AppHandle, tag_id: String) -> Result<(), String> {
    let tags_dir = get_dir(&app, "tags");
    let entries_dir = get_dir(&app, "entries");

    let tag_path = tags_dir.join(&tag_id);
    let entries_list_path = tag_path.join("entries.txt");

    if entries_list_path.exists() {
        let contents = fs::read_to_string(&entries_list_path).map_err(|e| e.to_string())?;

        for entry_id in contents.lines() {
            let entry_metadata_path = entries_dir.join(entry_id).join("metadata.json");
            if !entry_metadata_path.exists() {
                continue;
            }

            let metadata_str = match fs::read_to_string(&entry_metadata_path) {
                Ok(c) => c,
                Err(_) => continue,
            };
            let mut metadata: crate::models::EntryMetadata =
                match serde_json::from_str(&metadata_str) {
                    Ok(m) => m,
                    Err(_) => continue,
                };

            let original_len = metadata.tags.len();
            metadata.tags.retain(|t| t != &tag_id);
            if metadata.tags.len() != original_len {
                let updated = serde_json::to_string_pretty(&metadata).map_err(|e| e.to_string())?;
                fs::write(entry_metadata_path, updated).map_err(|e| e.to_string())?;
            }
        }
    }

    if tag_path.exists() {
        fs::remove_dir_all(tag_path).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn get_tags(app: AppHandle) -> Result<Vec<Tag>, String> {
    let tags_path = get_dir(&app, "tags");

    let mut tags = Vec::new();
    let dir_iter = std::fs::read_dir(&tags_path).map_err(|e| e.to_string())?;

    for tag in dir_iter {
        let tag = match tag {
            Ok(e) => e,
            Err(_) => continue,
        };

        let path = tag.path();
        if !path.is_dir() {
            continue;
        }

        let metadata_path = path.join("metadata.json");
        if !metadata_path.exists() {
            continue;
        }

        let contents = match fs::read_to_string(&metadata_path) {
            Ok(c) => c,
            Err(_) => continue,
        };

        let metadata: Tag = match serde_json::from_str(&contents) {
            Ok(m) => m,
            Err(_) => continue,
        };

        tags.push(metadata);
    }

    tags.sort_by(|a, b| a.name.cmp(&b.name));

    Ok(tags)
}

#[tauri::command]
pub fn update_tag(
    app: AppHandle,
    id: String,
    name: String,
    bg_color: String,
    fg_color: String,
) -> Result<Tag, String> {
    let tag_path = get_dir(&app, format!("tags/{id}"));

    let mut metadata_path = tag_path.clone();
    metadata_path.push("metadata.json");

    let metadata_str = std::fs::read_to_string(&metadata_path).map_err(|e| e.to_string())?;
    let mut metadata: Tag = serde_json::from_str(&metadata_str).map_err(|e| e.to_string())?;

    metadata.name = name;
    metadata.bg_color = bg_color;
    metadata.fg_color = fg_color;

    let metadata_json = serde_json::to_string_pretty(&metadata).map_err(|e| e.to_string())?;
    std::fs::write(&metadata_path, metadata_json).map_err(|e| e.to_string())?;

    Ok(metadata)
}
