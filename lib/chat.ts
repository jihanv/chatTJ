import { ChatDeepSeek } from "@langchain/deepseek";
import { PromptTemplate } from "@langchain/core/prompts";
import { combineDocuments, retriever } from "@/lib/utils";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
const llm = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0,
  maxTokens: 1500,
});

const standaloneQuestionTemplate =
  "Given a question, convert it to a standalone question. question: {question} standalone question:";

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate,
);

const answerTemplate = `あなたは、与えられた文脈をもとに英語についての質問に答える、親切で熱心なサポート教師です。できるだけ文脈の中から答えを見つけてください。どうしても答えが分からない場合は、「すみません、その質問の答えは分かりません。」と答え、質問者に先生へメールするよう案内してください。分からないのに答えを作らないでください。
context: {context}
question: {question}
answer:`;

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

const standaloneChain = RunnableSequence.from([
  standaloneQuestionPrompt,
  llm,
  new StringOutputParser(),
]);

const contextChain = RunnableSequence.from([retriever, combineDocuments]);

const finalAnswerChain = RunnableSequence.from([
  answerPrompt,
  llm,
  new StringOutputParser(),
]);

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

export async function askQuestion(question: string) {
  return await chain.invoke({ question });
}
