import VscApi from '../utils/VscApi';
import { Builders } from '../../../shared/Builders';
import { ConfigRequestMessage, Messages } from '../../../shared/Messages';
import { PartialState, State, Component } from '../../../shared/Types';

export default class StateService {
    private _state: State;

    constructor(state: State) {
        this._state = state;
        VscApi.setState(state);
    }

    public setState = (state: State) => {
        this._state = state;
        VscApi.setState(state);
    };

    public changeCategory = (category: string) => {
        this._changeState({ category });
    };

    public changeApiKey = (apiKey: string) => {
        this._changeState({ apiKey });
    };

    public changeBuilder = (id: string) => {
        const builder = Builders.getBuilder(id);
        if (builder === undefined) {
            return;
        }

        this._changeState({ builder });
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

    public getCategories = () => {
        return Object.keys(this._state.config);
    };

    public getCategory = () => {
        return this._state.category;
    };

    public getApiKey = () => {
        return this._state.apiKey;
    };

    public getBuilder = () => {
        return this._state.builder;
    };

    private _changeState = (state: PartialState) => {
        VscApi.changeState(state);
        this._state = VscApi.getState() as State;
    };

    public fetchConfig = () => {
        const { builder, apiKey } = this._state;
        // @ToDo change to create url with apiKey
        const url = builder.url;

        VscApi.postMessage({
            type: Messages.CONFIG_REQUEST,
            url,
        } as ConfigRequestMessage);
    };
}
