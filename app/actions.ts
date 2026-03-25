"use server";

import { askQuestion } from "@/lib/chat";
import { ChatFormState } from "@/lib/types";

export async function submitMessage(
  prevState: ChatFormState,
  formData: FormData,
): Promise<ChatFormState> {
  const rawMessage = formData.get("message");
  const message = typeof rawMessage === "string" ? rawMessage : "";

  if (!message) {
    return {
      ...prevState,
    };
  }
  const response = await askQuestion(message);
  return {
    ...prevState,
    messages: [
      ...prevState.messages,
      {
        role: "user",
        text: message,
      },
      {
        role: "ChatTJ",
        text: response,
      },
    ],
  };
}
