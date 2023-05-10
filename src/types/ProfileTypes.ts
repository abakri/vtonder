import { Choice } from "../static/Choice"

export type ProfilePromptType = {
    prompt: string,
    answer: string,
}

export type ProfileImageType = {
    id: string,
    filename: string,
}

export type ProfileType = {
    id: string
    name: string
    age: string
    choice: Choice | null
    bio: string
    session: string
    images: ProfileImageType[]
    prompts: ProfilePromptType[]
}
