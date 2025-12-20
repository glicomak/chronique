use crate::models::{Entry, EntryMetadata};
use crate::utils::get_dir;

use chrono::Utc;
use std::fs::{self, File};
use std::io::Write;
use tauri::AppHandle;
use uuid::Uuid;

#[tauri::command]
pub fn create_entry(app: AppHandle) -> Result<EntryMetadata, String> {
    let id = Uuid::new_v4().to_string();
    let entry_path = get_dir(&app, format!("entries/{id}"));

    let metadata = EntryMetadata {
        id,
        title: String::new(),
        datetime: Utc::now(),
        tags: vec![]
    };

    let mut metadata_path = entry_path.clone();
    metadata_path.push("metadata.json");
    let metadata_json = serde_json::to_string_pretty(&metadata).map_err(|e| e.to_string())?;
    let mut metadata_file = File::create(metadata_path).map_err(|e| e.to_string())?;
    metadata_file.write_all(metadata_json.as_bytes()).map_err(|e| e.to_string())?;

    let mut content_path = entry_path.clone();
    content_path.push("content.txt");
    File::create(content_path).map_err(|e| e.to_string())?;

    Ok(metadata)
}

#[tauri::command]
pub fn get_entries(app: AppHandle) -> Result<Vec<EntryMetadata>, String> {
    let entries_dir = get_dir(&app, "entries");

    let mut entries = Vec::new();
    let dir_iter = fs::read_dir(&entries_dir)
        .map_err(|e| e.to_string())?;

    for entry in dir_iter {
        let entry = match entry {
            Ok(e) => e,
            Err(_) => continue
        };

        let path = entry.path();
        if !path.is_dir() {
            continue;
        }

        let metadata_path = path.join("metadata.json");
        if !metadata_path.exists() {
            continue;
        }

        let contents = match fs::read_to_string(&metadata_path) {
            Ok(c) => c,
            Err(_) => continue
        };

        let metadata: EntryMetadata = match serde_json::from_str(&contents) {
            Ok(m) => m,
            Err(_) => continue
        };

        entries.push(metadata);
    }

    entries.sort_by(|a, b| b.datetime.cmp(&a.datetime));

    Ok(entries)
}

#[tauri::command]
pub fn get_entry(app: AppHandle, id: String) -> Result<Entry, String> {
    let entry_path = get_dir(&app, format!("entries/{id}"));

    let mut metadata_path = entry_path.clone();
    metadata_path.push("metadata.json");
    let metadata_str = std::fs::read_to_string(&metadata_path).map_err(|e| e.to_string())?;
    let metadata: EntryMetadata = serde_json::from_str(&metadata_str).map_err(|e| e.to_string())?;

    let mut content_path = entry_path;
    content_path.push("content.txt");
    let content = std::fs::read_to_string(&content_path).map_err(|e| e.to_string())?;

    Ok(Entry {
        id: metadata.id,
        title: metadata.title,
        datetime: metadata.datetime,
        tags: metadata.tags,
        content
    })
}

#[tauri::command]
pub fn update_entry(
    app: AppHandle,
    id: String,
    title: String,
    content: String
) -> Result<Entry, String> {
    let entry_path = get_dir(&app, format!("entries/{id}"));

    let mut metadata_path = entry_path.clone();
    metadata_path.push("metadata.json");
    let metadata_str = std::fs::read_to_string(&metadata_path).map_err(|e| e.to_string())?;
    let mut metadata: EntryMetadata = serde_json::from_str(&metadata_str).map_err(|e| e.to_string())?;

    metadata.title = title.clone();
    let updated_metadata_json = serde_json::to_string_pretty(&metadata).map_err(|e| e.to_string())?;
    let mut metadata_file = File::create(&metadata_path).map_err(|e| e.to_string())?;
    metadata_file.write_all(updated_metadata_json.as_bytes()).map_err(|e| e.to_string())?;

    let mut content_path = entry_path.clone();
    content_path.push("content.txt");
    let mut content_file = File::create(&content_path).map_err(|e| e.to_string())?;
    content_file.write_all(content.as_bytes()).map_err(|e| e.to_string())?;

    Ok(Entry {
        id,
        title: metadata.title,
        datetime: metadata.datetime,
        tags: metadata.tags,
        content
    })
}
