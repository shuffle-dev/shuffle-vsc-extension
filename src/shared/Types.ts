import { Message, Messages } from './Messages';
import {  EditorType } from './Editors';

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
export type UILibrary = {
    name: string,
    url: string
};

export type Editor = {
    id: string,
    name: string,
    libraries: UILibrary[]
};

type IState = { [index: string]: any };
export type State = IState & {
    apiKey: string,
    apiEmail: string,
    editors: Editor[],
    activeEditor: EditorType,
    category: string,
    config: Config,
};

export type PartialState = {
    [T in keyof State]?: State[T]
};
