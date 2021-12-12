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
            </article>
          </div>
        </Provider>
      </React.StrictMode>
    );
  }
}

export default Index;
