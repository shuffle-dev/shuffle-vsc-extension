import { Message, Messages } from './Messages';
import {  BuilderType } from './Builders';

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

/**
 * Shuffle extension state
 */
type IState = { [index: string]: any };
export type State = IState & {
    apiKey: string,
    builder: BuilderType,
    category: string,
    config: Config,
};

export type PartialState = {
    [T in keyof State]?: State[T]
};
