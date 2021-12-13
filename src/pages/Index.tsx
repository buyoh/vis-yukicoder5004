import React from 'react';

import { Provider } from 'react-redux';
import PlayerShell from '../container/PlayerShell';
import { rootStore } from '../stores';
import '../style/page.scss';

//

type Props = {};

type State = {};

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount(): void {
    (async () => {
      // const items = await CodeLib.fetchAll();
      // this.props.onFetchCodeLibData(items);
    })();
  }

  render(): JSX.Element {
    return (
      <React.StrictMode>
        <Provider store={rootStore}>
          <div id="page">
            <article>
              <h1>visualizer</h1>
              <p>
                <a href="https://yukicoder.me/problems/no/5004">
                  yukicoder - No.5004 Room Assignment
                </a>
                のビジュアライザです
              </p>
              <PlayerShell />
              <p>Chrome と Firefox 以外のブラウザは対応していません。</p>
              <p>
                不具合報告等は <a href="https://twitter.com/m_buyoh">twitter</a>{' '}
                か{' '}
                <a href="https://github.com/buyoh/vis-yukicoder5004/issues">
                  {' '}
                  GitHub の issue{' '}
                </a>{' '}
                へお願いします。
                <br />
                <strong>
                  私は作問関係者ではないため、問題の質問欄にビジュアライザ関連の内容を投稿しないでください。
                </strong>
              </p>
              <p>
                COLORについて。赤いほど悪く、青いほど良いです。
                <ul>
                  <li>
                    score: その部屋の価値が低いと赤く、高いと青くなります。
                  </li>
                  <li>
                    skill-diff:
                    その部屋のプレイヤーのスキルの差が大きいと赤く、小さいと青くなります。
                  </li>
                  <li>
                    penalty: 問題文中の E
                    の値です。大きいほど赤く、小さいほど青くなります。
                  </li>
                </ul>
              </p>
            </article>
          </div>
        </Provider>
      </React.StrictMode>
    );
  }
}

export default Index;
