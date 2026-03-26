import "dotenv/config";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { DocumentInterface } from "@langchain/core/documents";
import { ChatFormState } from "./types";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });

const SUPABASE_PUBLIC_KEY = process.env.SUPABASE_PUBLIC_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

if (!SUPABASE_PUBLIC_KEY || !SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLIC_KEY");
}
const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents",
  queryName: "match_documents",
});

const retriever = vectorStore.asRetriever();

export { retriever };

export function combineDocuments(docs: DocumentInterface[]) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

export function combineConversation(history: ChatFormState) {
  return history.messages.map((message) => {
    return `${message.role}: ${message.text}`;
  });
}
