import React, { useState, useEffect } from "react";
import Header from "./header";
import PopupModelTime from "components/UI/modelTime";
import { useSelector } from "react-redux";

const Index = (props) => {
    const [open, sOpen] = useState(false);
    const data = useSelector((state) => state.auth);
    useEffect(() => {
        data?.fail_expiration && sOpen(data?.fail_expiration);
    }, [data]);
    return (
        <div>
            <Header />
            {open && <PopupModelTime />}
            <div className="">{props.children}</div>
        </div>
    );
};

export default Index;
