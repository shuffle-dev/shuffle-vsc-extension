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
    url: string
}
export interface ConfigResMessage extends Message {
    data: Config
}
export interface SourceReqMessage extends Message {
    data: string
}
