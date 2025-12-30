use crate::models::EntryMetadata;
use crate::utils::get_dir;

use tauri::AppHandle;

#[tauri::command]
pub fn add_tag_to_entry(app: AppHandle, entry_id: String, tag_id: String) -> Result<(), String> {
    let entry_dir = get_dir(&app, format!("entries/{entry_id}"));
    let mut entry_metadata_path = entry_dir.clone();
    entry_metadata_path.push("metadata.json");

    let entry_metadata_str =
        std::fs::read_to_string(&entry_metadata_path).map_err(|e| e.to_string())?;
    let mut entry_metadata: EntryMetadata =
        serde_json::from_str(&entry_metadata_str).map_err(|e| e.to_string())?;
    if entry_metadata.tags.contains(&tag_id) {
        return Ok(());
    }
    entry_metadata.tags.push(tag_id.clone());

    let updated_entry_json =
        serde_json::to_string_pretty(&entry_metadata).map_err(|e| e.to_string())?;
    std::fs::write(&entry_metadata_path, updated_entry_json).map_err(|e| e.to_string())?;

    let tag_dir = get_dir(&app, format!("tags/{tag_id}"));
    let mut tag_entries_path = tag_dir.clone();
    tag_entries_path.push("entries.txt");

    let existing_entries = std::fs::read_to_string(&tag_entries_path).unwrap_or_default();
    if !existing_entries.lines().any(|line| line == entry_id) {
        use std::io::Write;
        let mut file = std::fs::OpenOptions::new()
            .append(true)
            .create(true)
            .open(tag_entries_path)
            .map_err(|e| e.to_string())?;

        writeln!(file, "{entry_id}").map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn remove_tag_from_entry(
    app: AppHandle,
    entry_id: String,
    tag_id: String,
) -> Result<(), String> {
    let entry_dir = get_dir(&app, format!("entries/{entry_id}"));
    let mut entry_metadata_path = entry_dir.clone();
    entry_metadata_path.push("metadata.json");
    let entry_metadata_str =
        std::fs::read_to_string(&entry_metadata_path).map_err(|e| e.to_string())?;
    let mut entry_metadata: EntryMetadata =
        serde_json::from_str(&entry_metadata_str).map_err(|e| e.to_string())?;

    let original_len = entry_metadata.tags.len();
    entry_metadata.tags.retain(|t| t != &tag_id);
    if entry_metadata.tags.len() != original_len {
        let updated_entry_json =
            serde_json::to_string_pretty(&entry_metadata).map_err(|e| e.to_string())?;

        std::fs::write(&entry_metadata_path, updated_entry_json).map_err(|e| e.to_string())?;
    }

    let tag_dir = get_dir(&app, format!("tags/{tag_id}"));
    let mut tag_entries_path = tag_dir.clone();
    tag_entries_path.push("entries.txt");
    let entries_str = match std::fs::read_to_string(&tag_entries_path) {
        Ok(s) => s,
        Err(_) => return Ok(()),
    };

    let filtered: Vec<&str> = entries_str
        .lines()
        .filter(|line| *line != entry_id)
        .collect();
    if filtered.len() != entries_str.lines().count() {
        let new_contents = filtered.join("\n");
        std::fs::write(tag_entries_path, new_contents + "\n").map_err(|e| e.to_string())?;
    }

    Ok(())
}
