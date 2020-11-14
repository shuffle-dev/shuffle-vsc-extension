import { Config } from "./Types";

export enum Messages {
    CONFIG_REQUEST = 'config:reqquest',
    CONFIG_RESPONSE = 'config:response',
    SOURCE_REQUEST = 'source:reqquest',
}

export interface Message {
    type: Messages
}

export interface ConfigRequestMessage extends Message {
    type: Messages.CONFIG_REQUEST
    url: string
}

export interface ConfigResponseMessage extends Message {
    type: Messages.CONFIG_RESPONSE
    data: Config
}

export interface SourceRequestMessage extends Message {
    type: Messages.SOURCE_REQUEST
    data: string
}
