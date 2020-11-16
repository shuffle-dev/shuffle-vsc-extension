import { Config, State } from './Types';

export enum Messages {
    SHUFFLE_STATE_STORE = 'shuffle-state:store',
    SHUFFLE_STATE_RESTORE = 'shuffle-state:restore',
    CONFIG_REQUEST = 'config:reqquest',
    CONFIG_RESPONSE = 'config:response',
    SOURCE_REQUEST = 'source:reqquest',
    SHOW_ERROR = 'show:error',
    SHOW_INFORMATION = 'show:information',
}

export interface Message {
    type: Messages
}

export interface ShuffleStateStoreMessage extends Message {
    type: Messages.SHUFFLE_STATE_STORE
    state: State
}

export interface ShuffleStateRestoreMessage extends Message {
    type: Messages.SHUFFLE_STATE_RESTORE
    state: State
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

export interface ShowErrorMessage extends Message {
    type: Messages.SHOW_ERROR
    message: string
}

export interface ShowInformationMessage extends Message {
    type: Messages.SHOW_INFORMATION
    message: string
}

