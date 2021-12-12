import React from 'react';
import { calcRoomScore, Room } from '../../lib/game/GameState';
import { SkillViewMode, FillColorType } from '../../stores/player/types';
import * as ColorFunctions from '@swiftcarrot/color-fns';

//

const kSX = [-1, 1, -1, 1];
const kSY = [-1, -1, 1, 1];

function hsv(h: number, s: number, v: number): string {
  return ColorFunctions.hsv2hex(h, s, v);
}

function selectScore(room: Room, type: FillColorType) {
  if (type === 'score') {
    return calcRoomScore(room) / 1200;
  } else if (type === 'penalty') {
    return 1 - room.penalty / 100;
  } else if (type === 'skill-diff') {
    const ma = Math.max(...room.players.map((e) => e.skill));
    const mi = Math.min(...room.players.map((e) => e.skill));
    return 1 - (ma - mi) / 50;
  } else {
    return null;
  }
}

function saturateScore(score: number) {
  return Math.max(0, Math.min(1, score));
}

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  room: Room;
  skillViewMode: SkillViewMode;
  fillColorType: FillColorType;
};

function RoomViewImpl(props: Props) {
  const score = selectScore(props.room, props.fillColorType);
  // note: svg 入れ子の方がReactとしては見通しが良い。
  // しかしどうしても重くなってしまうようで
  return (
    <>
      <rect
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        fill={
          score === null ? '#ccc' : hsv(20 + saturateScore(score) * 200, 80, 95)
        }
      />
      {props.skillViewMode === 'kadomatsu'
        ? renderKadomatsu(props)
        : props.skillViewMode === 'windows'
        ? renderWindows(props)
        : null}
    </>
  );
}
const RoomView = React.memo(RoomViewImpl);

function renderWindows(props: Props): JSX.Element[] {
  // assert players.length <= 4
  return props.room.players.map((p, i) => (
    <XRect
      x={props.x + props.width / 2}
      y={props.y + props.height / 2}
      width={(p.skill / 200) * props.width * kSX[i]}
      height={(p.skill / 200) * props.height * kSY[i]}
      key={p.id}
    />
  ));
}

function renderKadomatsu(props: Props): (JSX.Element | null)[] {
  const players = props.room.players.concat();
  const n = players.length;
  if (n > 2) {
    players.sort((l, r) => l.skill - r.skill);
    [players[0], players[1]] = [players[1], players[0]];
    [players[n - 2], players[n - 1]] = [players[n - 1], players[n - 2]];
  }
  return players.map((p, i) => (
    <XRect
      x={props.x + (i * props.width) / 4}
      y={props.y + (p.skill / 100) * props.height}
      width={props.width / 4}
      height={props.height - (p.skill / 100) * props.height}
      key={p.id}
    />
  ));
}

function XRect(props: {
  x: number;
  y: number;
  width: number;
  height: number;
}): JSX.Element {
  let { x, y, width, height } = props;
  if (width < 0) {
    x += width;
    width = -width;
  }
  if (height < 0) {
    y += height;
    height = -height;
  }
  return <rect x={x} y={y} width={width} height={height} fill="#fffb" />;
}

export default RoomView;
