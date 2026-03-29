"use server";

import { askQuestion } from "@/lib/chat";
import { ChatFormState } from "@/lib/types";
import { combineConversation } from "@/lib/utils";

export async function submitMessage(
  prevState: ChatFormState,
  formData: FormData,
): Promise<ChatFormState> {
  const rawMessage = formData.get("message");
  const message = typeof rawMessage === "string" ? rawMessage : "";
  console.log(combineConversation(prevState));
  if (!message) {
    return {
      ...prevState,
    };
  }
  const response = await askQuestion({
    question: message,
    history: combineConversation(prevState),
  });
  return {
    ...prevState,
    messages: [
      ...prevState.messages,
      {
        role: "user",
        text: message,
      },
      {
        role: "assistant",
        text: response,
      },
    ],
  };
}
