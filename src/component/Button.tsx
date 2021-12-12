import React from 'react';

//

type Props = {
  disabled?: boolean;
  onClick: () => void;
};

class Button extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    this.props.onClick();
  }

  render(): JSX.Element {
    return (
      <button onClick={this.handleClick} disabled={this.props.disabled}>
        {this.props.children}
      </button>
    );
  }
}

export default Button;
