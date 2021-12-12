import React from 'react';
import { GameState, Room } from '../lib/game/GameState';
import { SkillViewMode, FillColorType } from '../stores/player/types';
import RoomView from './player_parts/RoomView';

//

const kViewWidth = 650;
const kViewHeight = 320;

//

type Props = {
  gameState: GameState | null;
  roomViewSize: number;
  skillViewMode: SkillViewMode;
  fillColorType: FillColorType;
};

function PlayerScreenWrapper(props: { children?: JSX.Element }) {
  return (
    <svg
      style={{ backgroundColor: '#eee' }}
      viewBox={`0 0 ${kViewWidth} ${kViewHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      stroke="#111"
      fill="#fff"
      strokeWidth="0.5"
    >
      {props.children}
    </svg>
  );
}

class PlayerScreen extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    if (this.props.gameState === null) {
      return <PlayerScreenWrapper></PlayerScreenWrapper>;
    }
    const leveledRooms = this.props.gameState.getRooms().reduce(
      (s, room) => {
        s[room.players.length - 1].push(room);
        return s;
      },
      [[], [], [], []] as Room[][]
    );

    const size = this.props.roomViewSize; // 13 or 25 or 50
    const rows = Math.floor((kViewHeight - 3 * (size + 5)) / size);

    const li = leveledRooms.flatMap((rooms, i) =>
      renderRooms(
        this.props,
        rooms,
        i * (size + 5),
        size,
        i == 3 ? rows : 1,
        kViewWidth / size
      )
    ) as any; // TODO: remove
    return <PlayerScreenWrapper>{li}</PlayerScreenWrapper>;
  }
}

function renderRooms(
  parentProps: Props,
  rooms: Room[],
  y: number,
  size: number,
  rows: number,
  cols: number
): JSX.Element[] {
  return rooms
    .reverse()
    .map((room, i) => {
      const py = Math.floor(i / cols);
      const px = i % cols;
      if (rows <= py) return null;
      return (
        <RoomView
          x={size * px}
          y={y + size * py}
          width={size}
          height={size}
          room={room}
          key={`${room.id}/#${room.players.length}`}
          skillViewMode={parentProps.skillViewMode}
          fillColorType={parentProps.fillColorType}
        />
      );
    })
    .filter((e) => e !== null) as JSX.Element[];
}

export default PlayerScreen;
