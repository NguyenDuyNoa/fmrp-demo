import React from "react";
import Popup from "reactjs-popup";

const Index = (props) => {
  return (
    <React.Fragment>
        <button className={props.classNameBtn} onClick={props.onClickOpen}>{props.button}</button>
        <Popup 
            open={props.open}
            closeOnDocumentClick
            onClose={props.onClose}
            className="popup-edit"
        >
            <div className=" bg-[#ffffff] p-4 shadow-xl rounded-xl ">
                <div className="header text-[#101828] font-medium text-xl flex justify-between items-center">
                    <h1>{props.title}</h1>
                    <button onClick={props.onClose}>&times;</button>
                </div>
                {props.children}
            </div>
        </Popup>
    </React.Fragment>
  );
};

export default Index;