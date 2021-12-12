import { createStore, combineReducers } from 'redux';
import { alertReducer } from './alert/reducers';
import { playerReducer } from './player/reducers';

export const rootReducer = combineReducers({
  alert: alertReducer,
  player: playerReducer,
});

export const rootStore = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
