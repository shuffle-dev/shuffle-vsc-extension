import { Config } from "./Types";

export enum Messages {
    CONFIG_REQ = 'config:req',
    CONFIG_RES = 'config:res',
    SOURCE_REQ = 'source:req',
}

export interface Message {
    type: Messages
}

export interface ConfigReqMessage extends Message {
    type: Messages.CONFIG_REQ
    url: string
}

export interface ConfigResMessage extends Message {
    type: Messages.CONFIG_RES
    data: Config
}

export interface SourceReqMessage extends Message {
    type: Messages.SOURCE_REQ
    data: string
}
