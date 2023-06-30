export type SessionType = {
    id: string;
    name: string;
    open: boolean;
    prompts: string[];
    theme: string | null;
}

export type CreateSession = {
  name: string;
}

export type ToggleSession = {
  id: string;
  newOpenState: boolean;
}
