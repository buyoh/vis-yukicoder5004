import React from 'react';

//

type Props = {
  value: number;
  min: number;
  max: number;
  // onChangeを呼び出す頻度。nullで制限なし。0に近い非負整数ほど頻繁に呼び出される。
  spin?: number;
  enableRange?: boolean;
  onChange: (text: number) => void;
};

class IntRangeInput extends React.Component<Props, {}> {
  pendingValue: number | null;
  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.pendingValue = null;
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let v = parseInt(e.target.value);
    if (isNaN(v) || v < this.props.min) {
      v = this.props.min;
    } else if (v > this.props.max) {
      v = this.props.max;
    }
    if (this.props.spin === undefined) {
      this.props.onChange(v);
    } else {
      // TODO: 想定外の挙動を起こさないか要考察
      if (this.pendingValue === null) {
        setTimeout(() => {
          // never be null
          if (this.pendingValue !== null)
            this.props.onChange(this.pendingValue);
          this.pendingValue = null;
        }, this.props.spin);
      }
      this.pendingValue = v;
    }
  }

  render(): JSX.Element {
    // TODO:
    return (
      <>
        {this.props.enableRange ? (
          <input
            type="range"
            value={this.props.value}
            min={this.props.min}
            max={this.props.max}
            onChange={this.handleChange}
          />
        ) : (
          <></>
        )}

        <input
          size={6}
          type="number"
          step="1"
          value={this.props.value}
          min={this.props.min}
          max={this.props.max}
          onChange={this.handleChange}
        />
      </>
    );
  }
}

export default IntRangeInput;
