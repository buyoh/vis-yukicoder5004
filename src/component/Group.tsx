import React from 'react';

//

type Props = {};

class Group extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div
        style={{
          padding: '0.2em',
          margin: '1px',
          borderStyle: 'solid',
          borderWidth: '2px',
          borderColor: '#bbb',
          borderRadius: '3px',
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Group;
