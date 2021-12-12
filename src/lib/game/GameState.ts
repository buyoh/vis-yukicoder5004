import { GameInput } from './GameInput';
import { TickAction } from './GameOutput';

export type Player = {
  id: number;
  roomId: number;
  skill: number;
  tick: number;
};

export type Room = {
  id: number;
  players: Player[];
  penalty: number; // E の値 になるはず
};

type InternalRoom = {
  players: number[];
  penalty: number;
};

export function calcRoomScore(room: Room): number {
  if (room.players.length <= 1) return 0;
  const w = [0, 0, 1, 3, 6][room.players.length];
  const ps = room.players.map((p) => p.skill);
  const sd = Math.max(...ps) - Math.min(...ps);
  const e = room.penalty;
  return Math.max(0, w * (200 - sd * sd) - e);
}

function clonePlayer(pp: Player[]) {
  return pp.map((p) => Object.assign({}, p));
}

export class GameState {
  private tick: number;
  private rooms: { [i: number]: InternalRoom };
  private players: Player[];
  constructor() {
    this.tick = 0;
    this.rooms = {};
    this.players = [];
  }

  getRooms(): Room[] {
    return Object.entries(this.rooms).map((room) => ({
      id: +room[0],
      players: room[1].players.map((p) => this.players[p]),
      penalty: room[1].penalty,
    }));
  }

  clone(): GameState {
    const a = new GameState();
    a.tick = this.tick;
    a.rooms = Object.fromEntries(
      Object.entries(this.rooms).map((e) => [
        e[0],
        { players: [...e[1].players], penalty: e[1].penalty },
      ])
    );
    a.players = clonePlayer(this.players);

    return a;
  }

  apply(input: GameInput, actions: TickAction): null | Error {
    const firstPlayerIndex = this.players.length;
    const newPlayers = input.loggedInPlayers[this.tick];

    this.players.push(
      ...newPlayers.map((skill, i) => ({
        id: firstPlayerIndex + i,
        roomId: firstPlayerIndex + i,
        skill,
        tick: this.tick,
      }))
    );
    for (let i = 0; i < newPlayers.length; ++i) {
      const playerId = firstPlayerIndex + i;
      this.rooms[playerId] = {
        players: [playerId],
        penalty: 0,
      };
    }

    for (const action of actions.unite) {
      if (action.length !== 2)
        return new RangeError('internal error: action.length != 2'); // never
      const err = this.unite(action[0], action[1]);
      if (err) return err;
    }

    this.tick += 1;

    return null;
  }

  applied(input: GameInput, actions: TickAction): GameState {
    const a = this.clone();
    const e = a.apply(input, actions);
    if (e instanceof Error) throw e;
    return a;
  }

  private unite(pid1: number, pid2: number): null | Error {
    const p1 = this.players[pid1];
    const p2 = this.players[pid2];
    if (!p1 || !p2 || pid1 === pid2)
      return new RangeError(`invalid pid:  p1 = ${pid1 + 1}, p2 = ${pid2 + 1}`);
    const riDst = p1.roomId;
    const riSrc = p2.roomId;
    // It's valid and we do nothing
    if (riDst == riSrc) return null;
    const rDst = this.rooms[riDst];
    const rSrc = this.rooms[riSrc];
    // if (rDst.length < rSrc.length) this.unite(pid2, pid1);

    rDst.penalty += rSrc.penalty;
    rDst.penalty += 2 * this.tick * rDst.players.length * rSrc.players.length;
    for (const pid1 of rDst.players)
      rDst.penalty -= this.players[pid1].tick * rSrc.players.length;
    for (const pid2 of rSrc.players)
      rDst.penalty -= this.players[pid2].tick * rDst.players.length;

    for (const pid of rSrc.players) {
      rDst.players.push(pid);
      this.players[pid].roomId = riDst;
    }
    delete this.rooms[riSrc];

    return null;
  }
}
