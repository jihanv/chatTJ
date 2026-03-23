export type ChatFormState = {
  message: string;
  errors?: {
    message?: string[];
  };
};

export const initialState: ChatFormState = {
  message: "",
};
