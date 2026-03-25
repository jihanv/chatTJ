export type ChatMessage = {
  role: "user" | "ChatTJ";
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
      role: "ChatTJ",
      text: "どんな御用でしょうか？ :)",
    },
  ],
};
