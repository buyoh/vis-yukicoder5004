import {
  SET_GAME_STATE_STORE,
  PlayerActionTypes,
  PlayerState,
  SET_CURRENT_TICK,
  SET_PLAYER_CONFIG,
} from './types';

const initialState: PlayerState = {
  game: null,
  currentTick: 0,
  config: {
    skillViewMode: 'kadomatsu',
    fillColorType: 'score',
    roomViewSize: 25,
    colorSaturationMin: 0,
    colorSaturationMax: 0,
  },
};

export function playerReducer(
  state = initialState,
  action: PlayerActionTypes
): PlayerState {
  switch (action.type) {
    case SET_GAME_STATE_STORE:
      return {
        ...state,
        game: action.game,
        currentTick: action.game.constT(),
      };
    case SET_CURRENT_TICK: {
      const kT = state.game === null ? 0 : state.game.constT();
      const currentTick = Math.max(0, Math.min(kT, action.tick));
      return {
        ...state,
        currentTick,
      };
    }
    case SET_PLAYER_CONFIG: {
      const c = Object.fromEntries(
        Object.entries(action.config).filter((kv) => kv[1] !== undefined)
      ) as any;
      return {
        ...state,
        config: { ...state.config, ...c },
      };
    }
    default:
      return state;
  }
}
