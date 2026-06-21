mod commands;
mod models;
mod storage;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            commands::library::list_books,
            commands::library::import_book,
            commands::library::remove_book,
            commands::library::update_progress,
            commands::library::read_book_bytes,
            commands::ai::ai_explain,
        ])
        .setup(|app| {
            storage::ensure_app_dirs(app.handle())?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
