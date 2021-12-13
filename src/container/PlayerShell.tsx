import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Button from '../component/Button';
import Group from '../component/Group';
import MultilineInput from '../component/MultilineInput';
import PlayerScreen from '../component/PlayerScreen';
import { parseGameInputParser } from '../lib/game/GameInput';
import { parseGameOutputParser } from '../lib/game/GameOutput';
import { GameStateStore } from '../lib/game/GameStateStore';
import { RootState } from '../stores';
import '../style/base.scss';
import * as PlayerActions from '../stores/player/actions';
import * as AlertActions from '../stores/alert/actions';
import { GameState } from '../lib/game/GameState';
import IntRangeInput from '../component/IntRangeInput';
import Select from '../component/Select';
import {
  FillColorType,
  PlayerConfigOption,
  SkillViewMode,
} from '../stores/player/types';

import * as Case00 from '../lib/game/case00.json';
const kStdin = (Case00 as any).i;
const kStdout = (Case00 as any).o;
// import * as Case01 from '../lib/game/case01.json';
// const kStdin = (Case01 as any).i;
// const kStdout = (Case01 as any).o;

//

type Props = {};

type State = {
  stdinRaw: string;
  stdoutRaw: string;
  loading: boolean;
};

//

type StateProps = {
  gameStateStore: GameStateStore | null;
  gameState: GameState | null;
  score: number;
  currentTick: number;
  skillViewType: SkillViewMode;
  fillColorType: FillColorType;
  roomViewSize: number;
  alerts: string[];
};

type DispatchProps = {
  setGameStateStore: (gss: GameStateStore) => void;
  setCurrentTick: (t: number) => void;
  setPlayerConfig: (c: PlayerConfigOption) => void;
  setAlert: (s: string) => void;
};

type CombinedProps = Props & StateProps & DispatchProps;

//

function mapStateToProps(state: RootState): StateProps {
  const currentTick = state.player.currentTick;
  const gameState = state.player.game?.get(currentTick) || null;
  return {
    gameStateStore: state.player.game,
    gameState,
    score: gameState?.getScore() || 0,
    currentTick,
    skillViewType: state.player.config.skillViewMode,
    fillColorType: state.player.config.fillColorType,
    roomViewSize: state.player.config.roomViewSize,
    alerts: state.alert.alerts,
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    setGameStateStore: (gss: GameStateStore) =>
      dispatch(PlayerActions.setGameStateStore(gss)),
    setCurrentTick: (t: number) => dispatch(PlayerActions.setCurrentTick(t)),
    setPlayerConfig: (c: PlayerConfigOption) =>
      dispatch(PlayerActions.setPlayerConfig(c)),
    setAlert: (s: string) => dispatch(AlertActions.setAlerts(s)),
  };
}

//

class PlayerShell extends React.Component<CombinedProps, State> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = { stdinRaw: kStdin, stdoutRaw: kStdout, loading: false };

    this.setStdinRaw = this.setStdinRaw.bind(this);
    this.setStdoutRaw = this.setStdoutRaw.bind(this);
    this.loadInput = this.loadInput.bind(this);
  }

  //

  private setStdinRaw(value: string) {
    this.setState({ ...this.state, stdinRaw: value });
  }

  private setStdoutRaw(value: string) {
    this.setState({ ...this.state, stdoutRaw: value });
  }

  //

  private loadInput() {
    this.setState({ ...this.state, loading: true });

    (async () => {
      const input = parseGameInputParser(this.state.stdinRaw);
      if (input instanceof Error) {
        // TODO: integrate log
        console.warn(input);
        this.props.setAlert('[input] ' + input.message);
        this.setState({ ...this.state, loading: false });
        return;
      }
      const output = parseGameOutputParser(this.state.stdoutRaw, input);
      if (output instanceof Error) {
        console.warn(output);
        this.props.setAlert('[output] ' + output.message);
        this.setState({ ...this.state, loading: false });
        return;
      }
      const gss = new GameStateStore(input, output);
      const gssErr = gss.build();
      if (gssErr) {
        console.warn(gssErr);
        this.props.setAlert('[game] ' + gssErr.message);
        this.setState({ ...this.state, loading: false });
        return;
      }

      console.log('done!');
      this.props.setAlert('done!');

      this.props.setGameStateStore(gss);
      this.setState({ ...this.state, loading: false });
    })();
  }

  render(): JSX.Element {
    return (
      <div style={{ border: '1px solid #aaa' }}>
        <PlayerScreen
          gameState={this.props.gameState}
          roomViewSize={this.props.roomViewSize}
          skillViewMode={this.props.skillViewType}
          fillColorType={this.props.fillColorType}
        />
        {this.renderPanel()}
      </div>
    );
  }
  private renderPanel() {
    return (
      <>
        <Group>
          <div className="margin">
            <b>score : {this.props.score}</b>
          </div>
        </Group>
        <Group>
          <div className="row">
            <div className="flex cols margin" style={{ overflow: 'hidden' }}>
              <div className="fixedFlex">
                <b>STDIN</b>
              </div>
              <div className="flex cols">
                <MultilineInput
                  value={this.state.stdinRaw}
                  onChange={this.setStdinRaw}
                />
              </div>
            </div>
            <div className="flex cols margin" style={{ overflow: 'hidden' }}>
              <div className="fixedFlex">
                <b>STDOUT</b>
              </div>
              <div className="flex cols">
                <MultilineInput
                  value={this.state.stdoutRaw}
                  onChange={this.setStdoutRaw}
                />
              </div>
            </div>
            <div className="fixedFlex margin">
              <div>
                <b>CTRL</b>
              </div>
              <div>
                <Button onClick={this.loadInput} disabled={this.state.loading}>
                  Load STDIN/STDOUT
                </Button>
              </div>
              <div className="margin">
                <label>
                  <b>tick</b>
                  <IntRangeInput
                    min={0}
                    max={this.props.gameStateStore?.constT() || 0}
                    value={this.props.currentTick}
                    spin={10}
                    enableRange
                    onChange={this.props.setCurrentTick}
                  />
                </label>
              </div>
            </div>
          </div>
        </Group>
        <Group>
          <div className="row">
            <div className="fixedFlex margin">
              <div>
                <b>SKILL</b>
                <Select
                  value={this.props.skillViewType}
                  items={['none', 'kadomatsu', 'windows']}
                  onChange={(e) => {
                    this.props.setPlayerConfig({ skillViewMode: e as any });
                  }}
                />
              </div>
            </div>
            <div className="fixedFlex margin">
              <div>
                <b>COLOR</b>
                <Select
                  value={this.props.fillColorType}
                  items={['none', 'score', 'skill-diff', 'penalty']}
                  onChange={(e) => {
                    this.props.setPlayerConfig({ fillColorType: e as any });
                  }}
                />
              </div>
            </div>
            <div className="fixedFlex margin">
              <div>
                <b>SIZE</b>
                <Select
                  value={'' + this.props.roomViewSize}
                  items={['13', '25', '50']}
                  onChange={(e) => {
                    this.props.setPlayerConfig({ roomViewSize: +e });
                  }}
                />
              </div>
            </div>
          </div>
        </Group>
        <Group>
          <div className="fixedFlex margin">
            {this.props.alerts.length > 0 ? this.props.alerts[0] : null}
          </div>
        </Group>
      </>
    );
  }
}

export default connect<StateProps, DispatchProps, Props, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(PlayerShell);
