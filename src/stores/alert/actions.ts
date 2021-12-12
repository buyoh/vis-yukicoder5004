import { SET_ALERT as SET_ALERT, AlertActionTypes } from './types';

export function setAlerts(text: string): AlertActionTypes {
  return {
    type: SET_ALERT,
    text,
  };
}
