type Type = string;
type Callback = (message: any) => void;
type Listener = {
    type: Type,
    fun: Callback
};

export default class MessageManager {
    private _listeners: Listener[] = [];

    constructor() {
        window.addEventListener('message', (event) => {
            const message = event.data;
            this._listeners.forEach((listener) => {
                if (listener.type === message.type) {
                    listener.fun(message);
                }
            });
        });
    };

    addListener = (type: string, fun: (message: string) => void) => {
        this._listeners.push({
           type,
           fun
       });
    };
}
