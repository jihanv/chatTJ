import { ChatDeepSeek } from "@langchain/deepseek";
import { PromptTemplate } from "@langchain/core/prompts";
import { combineDocuments, retriever } from "@/lib/utils";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

type askQuestionInput = {
  question: string;
  history: string;
};

const llm = new ChatDeepSeek({
  model: "deepseek-reasoner",
  temperature: 0.4,
});

const standaloneQuestionTemplate = `Given a some conversation history, if any, and a question, convert the question to a standalone question. 
question: {question} 
history: {history}
standalone question:`;

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate,
);

const answerTemplate = `あなたは、与えられた文脈と会話履歴をもとに英語についての質問に答える、親切で熱心なサポート教師です。
回答は明確で簡潔にし、抽象的な説明は避けてください。
context を優先して答えてください。
history は、質問の意図を考えたり、質問が過去のやり取りを参照している場合にだけ使ってください。
最新の回答では、必要がない限り history の内容を明示的に繰り返したり言及したりする必要はありません。
どうしても答えが分からない場合は、「すみません、その質問の答えは分かりません。」と答え、質問者に先生へメールするよう案内してください。
分からないのに答えを作らないでください。
context: {context}
question: {question}
history:{history}
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
    retrieval_query: ({ question, history }) =>
      standaloneChain.invoke({ question, history }),
    original_input: new RunnablePassthrough(),
  },
  {
    context: ({ retrieval_query }) => contextChain.invoke(retrieval_query),
    question: ({ original_input }) => original_input.question,
    history: ({ original_input }) => original_input.history,
  },
  finalAnswerChain,
]);

export async function askQuestion({ question, history }: askQuestionInput) {
  return await chain.invoke({ question, history });
}
