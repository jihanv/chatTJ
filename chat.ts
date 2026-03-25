import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatDeepSeek } from "@langchain/deepseek";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { retriever } from "./lib/utils";
import { DocumentInterface } from "@langchain/core/documents";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
// document.addEventListener("submit", (e: SubmitEvent) => {
//   e.preventDefault();
//   progressConversation();
// });

// const llm = new ChatOpenAI({
//   model: "gpt-4.1",
//   temperature: 0,
// });

const llm = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0,
});

const standaloneQuestionTemplate =
  "Given a question, convert it to a standalone question. question: {question} standalone question:";

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate,
);

const answerTemplate = `あなたは、与えられた文脈をもとに英語についての質問に答える、親切で熱心なサポート教師です。できるだけ文脈の中から答えを見つけてください。どうしても答えが分からない場合は、「すみません、その質問の答えは分かりません。」と答え、質問者に先生へメールするよう案内してください。分からないのに答えを作らないでください。必ず、中学生にチャットで話しかけるようなやさしい話し方をしてください。
context: {context}
question: {question}
answer:`;

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

function combineDocuments(docs: DocumentInterface[]) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

// Get the standalonequestion
const standaloneChain = RunnableSequence.from([
  standaloneQuestionPrompt,
  llm,
  new StringOutputParser(),
]);

// Get Context
const contextChain = RunnableSequence.from([retriever, combineDocuments]);

// Get the answer
const finalAnswerChain = RunnableSequence.from([
  answerPrompt,
  llm,
  new StringOutputParser(),
]);
// const chain = standaloneQuestionPrompt
//   .pipe(llm)
//   .pipe(new StringOutputParser())
//   .pipe(retriever)
//   .pipe(combineDocuments);
const chain = RunnableSequence.from([
  {
    retrieval_query: standaloneChain,
    original_input: new RunnablePassthrough(),
  },
  {
    context: ({ retrieval_query }) => contextChain.invoke(retrieval_query),
    question: ({ original_input }) => original_input.question,
  },
  finalAnswerChain,
]);

async function main() {
  const response = await chain.invoke({
    question:
      "「Clause」という概念がよく分かりません。それは何ですか？「Sentence」とはどう違うのですか？どちらも主語と動詞を含んでいるので、その違いが分かりません。「Sentence は complete thought を表す」と言われても、曖昧でよく分かりません。",
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
  const response = await chain.invoke({
    question:
      "「Clause」という概念がよく分かりません。それは何ですか？「Sentence」とはどう違うのですか？どちらも主語と動詞を含んでいるので、その違いが分かりません。「Sentence は complete thought を表す」と言われても、曖昧でよく分かりません。",
  });

  const newAiSpeechBubble: HTMLDivElement = document.createElement("div");
  newAiSpeechBubble.classList.add("speech", "speech-ai");
  chatbotConversation.appendChild(newAiSpeechBubble);
  newAiSpeechBubble.textContent = response;
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}
