import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// document.addEventListener("submit", (e: SubmitEvent) => {
//   e.preventDefault();
//   progressConversation();
// });

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

const llm = new ChatOpenAI({
  model: "gpt-4.1",
  temperature: 0,
});

const standaloneQuestionTemplate =
  "Given a question, convert it to a standalone question. question: {question} standalone question:";

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate,
);

const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser())
  .pipe(retriever);

async function main() {
  const response = await standaloneQuestionChain.invoke({
    question:
      "「Clause」という概念がよく分かりません。それは何ですか？「Sentence」とはどう違うのですか？",
  });

  console.log(response);
}

main().catch(console.error);

async function progressConversation(): Promise<void> {
  const userInput = document.getElementById("user-input");
  if (!(userInput instanceof HTMLInputElement)) return;
  const chatbotConversation = document.getElementById(
    "chatbot-conversation-container",
  );
  if (!(chatbotConversation instanceof HTMLDivElement)) return;
  const question: string = userInput.value;
  userInput.value = "";

  const newHumanSpeechBubble: HTMLDivElement = document.createElement("div");
  newHumanSpeechBubble.classList.add("speech", "speech-human");
  chatbotConversation.appendChild(newHumanSpeechBubble);
  newHumanSpeechBubble.textContent = question;
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

  const newAiSpeechBubble: HTMLDivElement = document.createElement("div");
  newAiSpeechBubble.classList.add("speech", "speech-ai");
  chatbotConversation.appendChild(newAiSpeechBubble);
  const result: string = "";
  newAiSpeechBubble.textContent = result;
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}
