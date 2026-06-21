use std::fs;
use std::path::Path;

use chrono::Utc;
use tauri::AppHandle;
use uuid::Uuid;

use crate::models::{Book, BookProgress};
use crate::storage::{books_dir, load_library, save_library};

fn infer_format(path: &Path) -> Option<String> {
    path.extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_lowercase())
        .filter(|e| e == "pdf" || e == "epub")
}

fn infer_title(path: &Path) -> String {
    path.file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("Untitled")
        .to_string()
}

#[tauri::command]
pub fn list_books(app: AppHandle) -> Result<Vec<Book>, String> {
    let data = load_library(&app)?;
    Ok(data.books)
}

#[tauri::command]
pub fn import_book(app: AppHandle, source_path: String) -> Result<Book, String> {
    let source = Path::new(&source_path);
    if !source.exists() {
        return Err("File does not exist".into());
    }

    let format = infer_format(source).ok_or("Only PDF and EPUB files are supported")?;
    let id = Uuid::new_v4().to_string();
    let file_name = format!("{}.{}", id, format);
    let dest = books_dir(&app)?.join(&file_name);

    fs::copy(source, &dest).map_err(|e| e.to_string())?;

    let title = infer_title(source);
    let now = Utc::now().to_rfc3339();

    let book = Book {
        id,
        title,
        format,
        file_name,
        added_at: now.clone(),
        last_read_at: None,
        progress: BookProgress::default(),
    };

    let mut data = load_library(&app)?;
    data.books.push(book.clone());
    save_library(&app, &data)?;

    Ok(book)
}

#[tauri::command]
pub fn remove_book(app: AppHandle, id: String) -> Result<(), String> {
    let mut data = load_library(&app)?;
    let book = data
        .books
        .iter()
        .find(|b| b.id == id)
        .ok_or("Book not found")?;

    let file_path = books_dir(&app)?.join(&book.file_name);
    if file_path.exists() {
        fs::remove_file(file_path).map_err(|e| e.to_string())?;
    }

    data.books.retain(|b| b.id != id);
    save_library(&app, &data)?;
    Ok(())
}

#[tauri::command]
pub fn update_progress(
    app: AppHandle,
    id: String,
    page: Option<u32>,
    cfi: Option<String>,
    percent: f32,
) -> Result<(), String> {
    let mut data = load_library(&app)?;
    let book = data.books.iter_mut().find(|b| b.id == id).ok_or("Book not found")?;

    book.progress.page = page;
    book.progress.cfi = cfi;
    book.progress.percent = percent;
    book.last_read_at = Some(Utc::now().to_rfc3339());

    save_library(&app, &data)?;
    Ok(())
}

#[tauri::command]
pub fn read_book_bytes(app: AppHandle, id: String) -> Result<Vec<u8>, String> {
    let data = load_library(&app)?;
    let book = data.books.iter().find(|b| b.id == id).ok_or("Book not found")?;
    let path = books_dir(&app)?.join(&book.file_name);
    fs::read(path).map_err(|e| e.to_string())
}
