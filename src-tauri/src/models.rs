use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookProgress {
    pub page: Option<u32>,
    pub cfi: Option<String>,
    pub percent: f32,
}

impl Default for BookProgress {
    fn default() -> Self {
        Self {
            page: None,
            cfi: None,
            percent: 0.0,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Book {
    pub id: String,
    pub title: String,
    pub format: String,
    pub file_name: String,
    pub added_at: String,
    pub last_read_at: Option<String>,
    pub progress: BookProgress,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LibraryData {
    pub books: Vec<Book>,
}

impl Default for LibraryData {
    fn default() -> Self {
        Self { books: Vec::new() }
    }
}
