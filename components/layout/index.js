import React from "react";
import Header from "./header";
import PopupModelTime from "components/UI/modelTime";

const Index = (props) => {
    return (
        <div>
            <Header />
            <PopupModelTime />
            <div className="">{props.children}</div>
        </div>
    );
};

export default Index;
