import { Config } from './Types';

export enum Messages {
    SHUFFLE_STATE_STORE = 'shuffle-state:store',
    CONFIG_REQUEST = 'config:reqquest',
    CONFIG_RESPONSE = 'config:response',
    SOURCE_REQUEST = 'source:reqquest',
}

export interface Message {
    type: Messages
}

export interface ShuffleStateStoreMessage extends Message {
    type: Messages.SHUFFLE_STATE_STORE
    state: {}
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
