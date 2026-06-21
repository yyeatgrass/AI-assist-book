use std::fs;
use std::path::PathBuf;

use tauri::{AppHandle, Manager};

use crate::models::LibraryData;

pub fn app_data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

pub fn books_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app_data_dir(app)?.join("books");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

pub fn library_path(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(app_data_dir(app)?.join("library.json"))
}

pub fn ensure_app_dirs(app: &AppHandle) -> Result<(), String> {
    books_dir(app)?;
    if !library_path(app)?.exists() {
        save_library(app, &LibraryData::default())?;
    }
    Ok(())
}

pub fn load_library(app: &AppHandle) -> Result<LibraryData, String> {
    let path = library_path(app)?;
    if !path.exists() {
        return Ok(LibraryData::default());
    }
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&content).map_err(|e| e.to_string())
}

pub fn save_library(app: &AppHandle, data: &LibraryData) -> Result<(), String> {
    let path = library_path(app)?;
    let content = serde_json::to_string_pretty(data).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}
