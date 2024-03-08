import React, { useState, useEffect } from "react";
import Header from "./header";
import PopupModelTime from "components/UI/modelTime";
import { useSelector } from "react-redux";
import PopupAppTrial from "../UI/popup/PopupAppTrial";
import PopupAppRenewal from "../UI/popup/PopupAppRenewal";
import useStatusExprired from "@/hooks/useStatusExprired";

const Index = (props) => {
    // const [open, sOpen] = useState(false);
    // const data = useSelector((state) => state.auth);
    // useEffect(() => {
    //     data.fail_expiration && sOpen(data?.fail_expiration);
    // }, [data]);
    // console.log("open", open);

    return (
        <>
            <div>
                <Header />

                <div className=" overflow-hidden">
                    {/* <PopupModelTime hidden="hidden" open={open}></PopupModelTime> */}
                    {props.children}
                </div>
            </div>
            <PopupAppTrial />
            <PopupAppRenewal />
        </>
    );
};

export default Index;
