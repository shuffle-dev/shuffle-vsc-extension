import VscApi from '../utils/VscApi';
import { Editors } from '../../../shared/Editors';
import { ComponentsRequestMessage, Messages } from '../../../shared/Messages';
import { PartialState, State, Component } from '../../../shared/Types';

export default class StateService {
    private _state: State;

    constructor(state: State) {
        this._state = state;
        VscApi.setState(state);
    }

    public fetchConfig = () => {
        const { activeEditor, apiKey } = this._state;
        // @ToDo change to create url with apiKey
        const url = activeEditor.url;

        const message : ComponentsRequestMessage = {
            type: Messages.COMPONENTS_REQUEST,
            url
        };

        VscApi.postMessage(message);
    };

    /**
     * Wrappers for VscApi
     */
    public setState = (state: State) => {
        this._state = state;
        VscApi.setState(state);
    };

    private _changeState = (state: PartialState) => {
        VscApi.changeState(state);
        this._state = VscApi.getState() as State;
    };

    /**
     * Wrappers for _changeState
     */
    public changeEditor = (id: string) => {
        const activeEditor = Editors.getEditor(id);

        if (activeEditor === undefined) {
            return;
        }

        this._changeState({ activeEditor });
    };

    public changeCategory = (category: string) => {
        this._changeState({ category });
    };

    public changeApiDetails = (apiKey: string, apiEmail: string) => {
        this._changeState({ apiKey, apiEmail });
    };

    /**
     * Getters for current state
     */
    public getApiKey = () => {
        return this._state.apiKey;
    };

    public getApiEmail = () => {
        return this._state.apiEmail;
    };

    public getActiveEditor = () => {
        return this._state.activeEditor;
    };

    public getCategory = () => {
        return this._state.category;
    };

    public getCategories = () => {
        return Object.keys(this._state.config);
    };

    public getComponents = (category?: string): Component[] => {
        const currentCategory = category === undefined ? this.getCategory() : category;
        const components = this._state.config[currentCategory];

        return components === undefined ? [] : components;
    };

    public getComponent = (id: string, category?: string): Component | null => {
        const components = this.getComponents(category);
        const component = components.find((elem) => elem.id === id);

        return component ? component : null;
    };
}
