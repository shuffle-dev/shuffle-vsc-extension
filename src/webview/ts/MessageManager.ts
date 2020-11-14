import { MessageListener } from '../../shared/Types';
import { Message, Messages } from '../../shared/Messages';

export default class MessageManager {
    private static _listeners: MessageListener[] = [];

    static init() {
        window.addEventListener('message', ({ data }) => {
            MessageManager._listeners
                .filter(({ type }) => data.type === type)
                .forEach(({ fun }) => fun(data));
        });
    };

    static on = (type: Messages, fun: (message: Message) => void) => {
        MessageManager._listeners.push({ type, fun });
    };
}
