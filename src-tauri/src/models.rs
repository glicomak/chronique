use chrono::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Entry {
    pub id: String,
    pub title: String,
    pub datetime: DateTime<Utc>,
    pub tags: Vec<String>,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EntryMetadata {
    pub id: String,
    pub title: String,
    pub datetime: DateTime<Utc>,
    pub tags: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Tag {
    pub id: String,
    pub name: String,
    pub bg_color: String,
    pub fg_color: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub data_path: String
}
