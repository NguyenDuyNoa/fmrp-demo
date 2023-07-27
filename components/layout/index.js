import React from "react";
import Header from "./header";

const Index = (props) => {
  return (
    <div>
      <Header />
      <div>{props.children}</div>
    </div>
  );
};

export default Index;
