export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export type ChatFormState = {
  messages: ChatMessage[];
  errors?: {
    message?: string[];
  };
};

export const initialState: ChatFormState = {
  messages: [
    {
      role: "assistant",
      text: "どんな御用でしょうか？ :)",
    },
  ],
};
