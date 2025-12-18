use serde::{Deserialize, Serialize};
use chrono::prelude::*;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EntryMetadata {
    pub id: String,
    pub title: String,
    pub datetime: DateTime<Utc>,
    pub tags: Vec<String>
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Entry {
    pub id: String,
    pub title: String,
    pub datetime: DateTime<Utc>,
    pub tags: Vec<String>,
    pub content: String
}
