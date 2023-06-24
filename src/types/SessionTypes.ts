export type SessionType = {
    id: string;
    name: string;
    open: boolean;
    prompts: string[];
}

export type CreateSession = {
  name: string;
}

export type ToggleSession = {
  id: string;
  newOpenState: boolean;
}
