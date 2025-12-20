use std::fs;
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Manager};

pub fn get_dir(app: &AppHandle, relative: impl AsRef<Path>) -> PathBuf {
    let mut path = app.path().app_data_dir().expect("app data dir not found");
    path.push(relative);
    fs::create_dir_all(&path).expect("failed to create directory");
    path
}
