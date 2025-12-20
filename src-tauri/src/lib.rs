pub mod commands;
pub mod models;
pub mod utils;

use crate::commands::entry::{create_entry, get_entries, get_entry, update_entry};
use crate::commands::entry_tag::{add_tag_to_entry, remove_tag_from_entry};
use crate::commands::tag::{create_tag, get_tags, update_tag};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_entry, get_entries, get_entry, update_entry,
            add_tag_to_entry, remove_tag_from_entry,
            create_tag, get_tags, update_tag
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
