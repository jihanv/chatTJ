"use server";

import { ChatFormState } from "@/lib/types";

export async function submitMessage(
  prevState: ChatFormState,
  _formData: FormData,
): Promise<ChatFormState> {
  return prevState;
}
