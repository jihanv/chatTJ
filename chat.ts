import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { retriever } from "./lib/utils";
import { DocumentInterface } from "@langchain/core/documents";
// document.addEventListener("submit", (e: SubmitEvent) => {
//   e.preventDefault();
//   progressConversation();
// });

const llm = new ChatOpenAI({
  model: "gpt-4.1",
  temperature: 0,
});

const standaloneQuestionTemplate =
  "Given a question, convert it to a standalone question. question: {question} standalone question:";

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate,
);

function combineDocuments(docs: DocumentInterface[]) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

const chain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser())
  .pipe(retriever)
  .pipe(combineDocuments);

async function main() {
  const response = await chain.invoke({
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
