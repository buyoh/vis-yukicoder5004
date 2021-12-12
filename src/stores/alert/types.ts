export interface AlertState {
  alerts: string[];
}

export const SET_ALERT = 'alert/gameStateStore/set';

interface AddAlertAction {
  type: typeof SET_ALERT;
  text: string;
}

export type AlertActionTypes = AddAlertAction;
