import getVscApi from "./utils/getVscApi";
import { State } from "./StateProvider";
import {Builders} from "../../shared/Builders";

export type Component = {
    id: string,
    preview: string,
    html: string,
    config: object[]
};
export type Config = {
    [key: string]: Component[]
};

export default class StateService {
    private _state: State;

    constructor(state: State) {
        this._state = state;
    }

    changeCategory = (category: string) => {
        const state = this._state;
        this._setState({
            ...state,
            category,
        });
    };

    changeKey = (key: string) => {
        const state = this._state;
        this._setState({
            ...state,
            key,
        });
        // @ToDo load new config from node
    };

    changeBuilder = (key: string) => {
        const builder = Builders.getBuilder(key);
        if (builder === undefined) {
            return;
        }

        const state = this._state;
        this._setState({
            ...state,
            builder,
        });
        // @ToDo load new config from node
    };

    getComponents = (category?: string): Component[] => {
        const findingCategory = category === undefined ? this.getCategory() : category;
        const components = this._state.config[findingCategory];
        return components === undefined ? [] : components;
    };

    getComponent = (id: string, category?: string): Component | null => {
        const components = this.getComponents(category);
        const component = components.find((elem) => elem.id === id);
        return component ? component : null;
    };

    getCategories = () => {
        return Object.keys(this._state.config);
    };

    getCategory = () => {
        return this._state.category;
    };

    getKey = () => {
        return this._state.key;
    };

    getBuilder = () => {
        return this._state.builder;
    };

    private _setState = (state: State) => {
        getVscApi().setState(state);
        this._state = state;
    };
}
