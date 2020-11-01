declare global {
    interface Window {
        vscApi: {
            getState: () => any;
            setState: (state: any) => void;
            postMessage: (message: any) => void;
        }
    }
}

export default () => {
    return window.vscApi;
};
