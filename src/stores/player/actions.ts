import { GameStateStore } from '../../lib/game/GameStateStore';
import {
  PlayerActionTypes,
  PlayerConfigOption,
  SET_CURRENT_TICK,
  SET_GAME_STATE_STORE,
  SET_PLAYER_CONFIG,
} from './types';

export function setGameStateStore(game: GameStateStore): PlayerActionTypes {
  return {
    type: SET_GAME_STATE_STORE,
    game,
  };
}

export function setCurrentTick(tick: number): PlayerActionTypes {
  return {
    type: SET_CURRENT_TICK,
    tick,
  };
}

export function setPlayerConfig(config: PlayerConfigOption) {
  return {
    type: SET_PLAYER_CONFIG,
    config,
  };
}
