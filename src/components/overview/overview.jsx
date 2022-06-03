import React from "react";
import PropTypes from "prop-types";

const cutToSpace = (text) => {
  const textArr = text.split(" ");
  if (text.split("")[text.length] === " ") {
    return text;
  }
  const popEl = textArr.pop();
  return [textArr.join(" "), popEl];
};

class Overview extends React.Component {
  constructor() {
    super();
    this.state = {
      text: "",
    };
    this.maxLineCount = 5;
    this.maxCharCount = 40;
  }

  static propTypes = {
    overview: PropTypes.string.isRequired,
  };

  static defaultProps = {
    overview: "",
  };

  ellipsis = (text) => {
    let endFlag = false;
    const textArr = text.split("");
    let lineCount = 0;
    let newText = "";
    let cutElement = "";
    textArr.forEach((char, index) => {
      if (lineCount < this.maxLineCount) {
        newText += char;
        if (index % this.maxCharCount === this.maxCharCount - 1) {
          [newText, cutElement] = cutToSpace(newText);
          if (lineCount === this.maxLineCount - 1) {
            newText += "\n";
          } else {
            newText += "\n";
            newText += cutElement;
          }
          lineCount += 1;
        }
      } else if (!endFlag) {
        endFlag = true;
        newText += "...";
      }
    });
    this.setState({
      text: newText,
    });
  };

  componentDidMount() {
    this.ellipsis(this.props.overview);
  }

  render() {
    return <span style={{ fontSize: 12 }}>{this.state.text}</span>;
  }
}

export default Overview;
