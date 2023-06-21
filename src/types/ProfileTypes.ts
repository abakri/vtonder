import { Choice } from "../static/Choice"

export type ProfilePrompt = {
    prompt: string,
    answer: string,
}

export type ProfileImage = {
    storageLocation: string;
}

export type ProfileType = {
    id: string;
    createdAt: Date;
    name: string;
    age: string;
    choice: Choice | null;
    bio: string;
    session: string;
    images: ProfileImage[];
    prompts: ProfilePrompt[];
}
