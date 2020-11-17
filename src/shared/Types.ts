import { Message, Messages } from './Messages';

export type Component = {
    id: string,
    preview: string,
    code: string,
};

export type Components = {
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
    mode: string,
    apiKey: string,
    apiEmail: string,
    editors: Editor[],
    activeEditor: Editor | null,
    library: number,
    category: string,
    components: Components,
};

export type PartialState = {
    [T in keyof State]?: State[T]
};

export type ServerState = {
    mode: string,
    editors: Editor[],
    error: string
};
