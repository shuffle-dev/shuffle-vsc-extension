import { State } from './Types';

export const initialState : State = {
    mode: 'demo',
    apiKey: '',
    apiEmail: '',
    editors: [],
    activeEditor: null,
    library: 0,
    category: '',
    components: {}
};