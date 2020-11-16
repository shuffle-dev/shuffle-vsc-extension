import { State } from './Types';
import { Editors } from './Editors';

export const initialState : State = {
    apiKey: '',
    apiEmail: '',
    editors: [],
    activeEditor: Editors.getDefault(),
    category: '',
    components: {}
};