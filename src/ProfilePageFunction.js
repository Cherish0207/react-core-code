import React from "react";

function ProfilePage(props) {
  const handleClick = () => {
    console.log("handleClick--", props.user);
    setTimeout(() => {
      console.log("setTimeout--", props.user);
    }, 3000);
  };

  return <button onClick={handleClick}>Follow, {props.user}</button>;
}

export default ProfilePage;
