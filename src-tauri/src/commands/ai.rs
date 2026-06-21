use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
}

#[derive(Debug, Serialize)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Debug, Deserialize)]
struct ChatResponse {
    choices: Vec<ChatChoice>,
}

#[derive(Debug, Deserialize)]
struct ChatChoice {
    message: ChatMessageOut,
}

#[derive(Debug, Deserialize)]
struct ChatMessageOut {
    content: String,
}

#[derive(Debug, Serialize)]
pub struct ExplainResult {
    explanation: String,
}

const SYSTEM_PROMPT: &str = "你是一个阅读助理。请默认使用简洁、通俗易懂的中文来解释用户提供的文字，并解释其中可能不熟悉的术语。请使用 Markdown 格式来组织你的回答（例如使用标题、要点列表、**加粗** 等），让内容清晰易读。除非原文比较复杂，否则尽量保持简短。不要添加原文没有暗示的信息。如果用户用其他语言提问，则用用户提问所使用的语言回答。";

#[tauri::command]
pub async fn ai_explain(
    text: String,
    context: Option<String>,
    api_key: String,
    model: String,
) -> Result<ExplainResult, String> {
    if api_key.trim().is_empty() {
        return Err("API key is required. Add it in Settings.".into());
    }

    if text.trim().is_empty() {
        return Err("No text selected.".into());
    }

    let user_content = if let Some(ctx) = context.filter(|c| !c.trim().is_empty()) {
        format!("Passage:\n{}\n\nSurrounding context:\n{}", text, ctx)
    } else {
        format!("Passage:\n{}", text)
    };

    let body = ChatRequest {
        model,
        messages: vec![
            ChatMessage {
                role: "system".into(),
                content: SYSTEM_PROMPT.into(),
            },
            ChatMessage {
                role: "user".into(),
                content: user_content,
            },
        ],
    };

    let client = reqwest::Client::new();
    let response = client
        .post("https://api.deepseek.com/chat/completions")
        .header("Authorization", format!("Bearer {}", api_key.trim()))
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if !response.status().is_success() {
        let status = response.status();
        let err_body = response.text().await.unwrap_or_default();
        return Err(format!("DeepSeek API error ({}): {}", status, err_body));
    }

    let parsed: ChatResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    let explanation = parsed
        .choices
        .first()
        .map(|c| c.message.content.clone())
        .unwrap_or_else(|| "No explanation returned.".into());

    Ok(ExplainResult { explanation })
}
