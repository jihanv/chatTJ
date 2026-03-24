"use server";

import { ChatFormState } from "@/lib/types";

export async function submitMessage(
  prevState: ChatFormState,
  formData: FormData,
): Promise<ChatFormState> {
  const message = formData.get("message");

  return {
    ...prevState,
    message: typeof message === "string" ? message : "",
  };
}
