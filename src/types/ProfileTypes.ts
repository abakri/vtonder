
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
    age: number
    bio: string
    images: ProfileImageType[]
    prompts: ProfilePromptType[]
}