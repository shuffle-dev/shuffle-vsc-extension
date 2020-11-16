import { Components, State } from './Types';

export enum Messages {
    SHUFFLE_STATE_STORE = 'shuffle-state:store',
    SHUFFLE_STATE_RESTORE = 'shuffle-state:restore',
    COMPONENTS_REQUEST = 'components:request',
    COMPONENTS_RESPONSE = 'components:response',
    COMPONENT_CODE_REQUEST = 'component:code:request',
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

export interface ComponentsRequestMessage extends Message {
    type: Messages.COMPONENTS_REQUEST
    url: string
}

export interface ComponentsResponseMessage extends Message {
    type: Messages.COMPONENTS_RESPONSE
    components: Components
}

export interface ComponentCodeRequestMessage extends Message {
    type: Messages.COMPONENT_CODE_REQUEST
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

