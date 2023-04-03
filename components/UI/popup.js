import React from "react";
import Popup from "reactjs-popup";
import Head from "next/head";

import {Add as IconClose} from "iconsax-react"

const Index = (props) => {
  return (
    <React.Fragment>
        <Head>
            <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap" rel="stylesheet"/>
        </Head>
        <React.Fragment>
            <button className={props.classNameBtn} onClick={props.onClickOpen}>{props.button}</button>
            <Popup 
                open={props.open}
                closeOnDocumentClick={false}
                onClose={props.onClose}
                className="popup-edit"
                contentStyle={{
                    fontFamily: 'Lexend Deca, sans-serif'
                }}
            >
                <div className=" bg-[#ffffff] p-4 shadow-xl rounded-xl 2xl:mt-28 mt-36">
                    <div className="text-[#101828] font-medium text-xl flex justify-between items-center">
                        <h1>{props.title}</h1>
                        <button onClick={props.onClose} className="outline-none w-7 h-7 bg-slate-200 hover:opacity-80 hover:scale-105 transition rounded-full flex flex-col justify-center items-center"><IconClose className="rotate-45" /></button>
                    </div>
                    {props.children}
                </div>
            </Popup>
        </React.Fragment>
    </React.Fragment>
  );
};

export default Index;