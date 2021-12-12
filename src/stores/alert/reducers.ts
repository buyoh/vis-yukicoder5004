import { AlertState, AlertActionTypes, SET_ALERT } from './types';

const initialState: AlertState = {
  alerts: [],
};

export function alertReducer(
  state = initialState,
  action: AlertActionTypes
): AlertState {
  switch (action.type) {
    case SET_ALERT:
      return {
        alerts: [action.text],
      };
    default:
      return state;
  }
}
