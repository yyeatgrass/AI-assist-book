import { LazyStore } from "@tauri-apps/plugin-store";

const STORE_PATH = "settings.json";

let store: LazyStore | null = null;

async function getStore(): Promise<LazyStore> {
  if (!store) {
    store = new LazyStore(STORE_PATH);
  }
  return store;
}

export async function getApiKey(): Promise<string> {
  const s = await getStore();
  const value = await s.get<string>("apiKey");
  return value ?? "";
}

export async function setApiKey(key: string): Promise<void> {
  const s = await getStore();
  await s.set("apiKey", key);
  await s.save();
}

export async function getModel(): Promise<string> {
  const s = await getStore();
  const value = await s.get<string>("model");
  return value ?? "deepseek-chat";
}

export async function setModel(model: string): Promise<void> {
  const s = await getStore();
  await s.set("model", model);
  await s.save();
}
