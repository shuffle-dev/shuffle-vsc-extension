import VscApi from '../utils/VscApi';
import { ComponentsRequestMessage, Messages } from '../../../shared/Messages';
import { PartialState, State, Component } from '../../../shared/Types';

export default class StateService {
    private _state: State;

    constructor(state: State) {
        this._state = state;
        VscApi.setState(state);
    }

    public fetchComponents = () => {
        const { activeEditor, library } = this._state;

        let url;

        if (activeEditor && activeEditor.libraries.length > library) {
            url = activeEditor.libraries[library].url;
        }

        if ( url ) {
            const message : ComponentsRequestMessage = {
                type: Messages.COMPONENTS_REQUEST,
                url
            };
    
            VscApi.postMessage(message);
        } 
    };

    /**
     * Wrappers for VscApi
     */
    public setState = (state: State) => {
        this._state = state;
        VscApi.setState(state);
    };

    public attachState = () => {
        this._state = VscApi.getState() as State;
    };

    private _changeState = (state: PartialState) => {
        VscApi.changeState(state);
        this._state = VscApi.getState() as State;
    };

    /**
     * Wrappers for _changeState
     */
    public changeEditor = (id: string) => {
        const activeEditor = this.getEditor(id);

        if (activeEditor === undefined) {
            return;
        }

        this._changeState({ activeEditor });
        this.changeLibrary(0);
    };

    public changeLibrary = (library: number) => {
        this._changeState({ library });
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
    public getMode = () => {
        return this._state.mode;
    };

    public getApiKey = () => {
        return this._state.apiKey;
    };

    public getApiEmail = () => {
        return this._state.apiEmail;
    };

    public getEditors = () => {
        return this._state.editors;
    };

    public getEditor = (id: string) => {
        return this.getEditors().find(item => id === item.id);
    };

    public getActiveEditor = () => {
        return this._state.activeEditor;
    };

    public getLibrary = () => {
        return this._state.library;
    };

    public getCategory = () => {
        return this._state.category;
    };

    public getCategories = () => {
        return Object.keys(this._state.components);
    };

    public getComponents = (category?: string): Component[] => {
        const currentCategory = category === undefined ? this.getCategory() : category;
        const components = this._state.components[currentCategory];

        return components === undefined ? [] : components;
    };

    public getComponent = (id: string, category?: string): Component | null => {
        const components = this.getComponents(category);
        const component = components.find((elem) => elem.id === id);

        return component ? component : null;
    };
}
