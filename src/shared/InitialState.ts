import { State } from './Types';
import { Builders } from './Builders';

export const initialState : State = {
    apiKey: '',
    builder: Builders.getDefault(),
    category: '',
    config: {}
};