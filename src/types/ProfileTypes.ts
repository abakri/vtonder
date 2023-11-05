import { Choice } from "../static/choice";

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
    choice: Choice;
    bio: string;
    session: string;
    images: ProfileImage[];
    prompts: ProfilePrompt[];
}
