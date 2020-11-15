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
        console.log('CHANGE API KEY' + apiKey);
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
        const findingCategory = category === undefined ? this.getCategory() : category;
        const components = this._state.config[findingCategory];
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
