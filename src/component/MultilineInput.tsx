import React from 'react';

//

type Props = {
  value: string;
  onChange: (text: string) => void;
  cols?: number;
  rows?: number;
};

class MultilineInput extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.props.onChange(e.target.value);
  }

  render(): JSX.Element {
    return (
      <textarea
        style={{
          display: 'block',
          flex: '1 1 auto',
        }}
        onChange={this.handleChange}
        value={this.props.value}
        cols={this.props.cols}
        rows={this.props.rows}
      ></textarea>
    );
  }
}

export default MultilineInput;
