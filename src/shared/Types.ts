import { Message, Messages } from "./Messages";

export type Component = {
    id: string,
    preview: string,
    html: string,
    config: object[]
};

export type Config = {
    [key: string]: Component[]
};

export type MessageListener = {
    type: Messages,
    callback: (message: Message) => void
};
