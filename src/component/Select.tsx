import React from 'react';

//

type Props = {
  items: string[];
  value: string;
  onChange: (v: string) => void;
};

class Select extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.props.onChange(e.target.value);
  }

  render(): JSX.Element {
    return (
      <select onChange={this.handleChange} value={this.props.value}>
        {this.props.items.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
    );
  }
}

export default Select;
