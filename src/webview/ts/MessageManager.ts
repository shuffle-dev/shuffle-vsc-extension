type Type = string;
type Callback = (message: any) => void;
type Listener = {
    type: Type,
    fun: Callback
};

export default class MessageManager {
    private static _LISTENERS: Listener[] = [];

    static init() {
        window.addEventListener('message', (event) => {
            const message = event.data;
            MessageManager._LISTENERS.forEach((listener) => {
                if (listener.type === message.type) {
                    listener.fun(message);
                }
            });
        });
    };

    static on = (type: string, fun: (message: string) => void) => {
        MessageManager._LISTENERS.push({
           type,
           fun
       });
    };
}
