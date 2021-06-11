import React from "react";

class ProfilePage extends React.Component {
  showMessage = () => {
    console.log("showMessage " + this.props.user);
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow, {this.props.user}</button>;
  }
}

export default ProfilePage;
