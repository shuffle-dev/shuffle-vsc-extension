import { MessageListener } from '../../shared/Types';
import { Message, Messages } from "../../shared/Messages";

export default class MessageManager {
    private static _LISTENERS: MessageListener[] = [];

    static init() {
        window.addEventListener('message', ({ data }) => {
            MessageManager._LISTENERS
                .filter(({ type }) => data.type === type)
                .forEach(({ fun }) => fun(data));
        });
    };

    static on = (type: Messages, fun: (message: Message) => void) => {
        MessageManager._LISTENERS.push({
           type,
           fun
       });
    };
}
