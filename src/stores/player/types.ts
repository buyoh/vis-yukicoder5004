import { GameStateStore } from '../../lib/game/GameStateStore';

export type SkillViewMode = 'none' | 'kadomatsu' | 'windows';
export type FillColorType = 'none' | 'skill-diff' | 'penalty' | 'score';

export interface PlayerConfig {
  skillViewMode: SkillViewMode;
  fillColorType: FillColorType;
  roomViewSize: number;
  colorSaturationMin: number;
  colorSaturationMax: number;
}
export interface PlayerConfigOption {
  skillViewMode?: SkillViewMode;
  fillColorType?: FillColorType;
  roomViewSize?: number;
  // TODO:未実装。色の変化範囲を狭める機能。
  colorSaturationMin?: number;
  colorSaturationMax?: number;
}

export interface PlayerState {
  game: GameStateStore | null;
  currentTick: number;
  config: PlayerConfig;
}

export const SET_GAME_STATE_STORE = 'player/gameStateStore/set';
export const SET_CURRENT_TICK = 'player/currentTick/set';
export const SET_PLAYER_CONFIG = 'player/config/set';
export const SET_SKILL_VIEW_MODE = 'player';

interface SetGameStateStoreAction {
  type: typeof SET_GAME_STATE_STORE;
  game: GameStateStore;
}

interface SetCurrentTickAction {
  type: typeof SET_CURRENT_TICK;
  tick: number;
}

interface SetConfigAction {
  type: typeof SET_PLAYER_CONFIG;
  config: PlayerConfigOption;
}

export type PlayerActionTypes =
  | SetGameStateStoreAction
  | SetCurrentTickAction
  | SetConfigAction;
