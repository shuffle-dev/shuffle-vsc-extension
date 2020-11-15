import VscApi from '../utils/VscApi';
import {PartialState, State} from './StateProvider';
import {Builders} from '../../../shared/Builders';
import {Component} from '../../../shared/Types';
import {ConfigRequestMessage, Messages} from '../../../shared/Messages';

export default class StateService {
    private _state: State;

    constructor(state: State) {
        this._state = state;
    }

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

        this._state = VscApi.getState() as State;
        const components = this._state.config[currentCategory];
        return components === undefined ? [] : components;
    };

    public getComponent = (id: string, category?: string): Component | null => {
        const components = this.getComponents(category);

        const component = components.find((elem) => elem.id === id);
        return component ? component : null;
    };

    public getCategories = () => {
        this._state = VscApi.getState() as State;
        return Object.keys(this._state.config);
    };

    public getCategory = () => {
        this._state = VscApi.getState() as State;
        return this._state.category;
    };

    public getApiKey = () => {
        this._state = VscApi.getState() as State;
        return this._state.apiKey;
    };

    public getBuilder = () => {
        this._state = VscApi.getState() as State;
        return this._state.builder;
    };

    private _changeState = (state: PartialState) => {
        VscApi.changeState(state);
        this._state = VscApi.getState() as State;
    };

    public fetchConfig = () => {
        this._state = VscApi.getState() as State;
        const { builder, apiKey } = this._state;
        // @ToDo change to create url with apiKey
        const url = builder.url;

        VscApi.postMessage({
            type: Messages.CONFIG_REQUEST,
            url,
        } as ConfigRequestMessage);
    };
}
