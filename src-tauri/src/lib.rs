pub mod commands;
pub mod models;

use crate::commands::entry::{create_entry, get_entries, get_entry, update_entry};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![create_entry, get_entries, get_entry, update_entry])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
