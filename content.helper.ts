import { Content } from "@google/generative-ai";

export function createContent(messages: { role: 'user' | 'assistant'; content: string }[]): Content[] {
    return messages.map(msg => ({
        role: msg.role,
        parts: [
            {
                text: msg.content
            }
        ]
    }))
}