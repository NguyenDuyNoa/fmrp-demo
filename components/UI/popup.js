import React from "react";
import Popup from "reactjs-popup";
import Head from "next/head";

import {Add as IconClose} from "iconsax-react"
import { Lexend_Deca } from "@next/font/google";
const deca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

const Index = (props) => {
  return (
    <React.Fragment>
        <button className={props.classNameBtn} onClick={props.onClickOpen}>{props.button}</button>
        <Popup 
            open={props.open}
            closeOnDocumentClick={false}
            onClose={props.onClose}
            className={`popup-edit`}
        >
			<div className="2xl:mt-50 mt-36">
				<div className={`${deca.className} bg-[#ffffff] p-4 shadow-xl rounded-xl `}>
					<div className="flex justify-between items-center">
						<h1 className="text-[#101828] font-medium 2xl:text-xl text-lg">{props.title}</h1>
						<button onClick={props.onClose} className="outline-none w-7 h-7 bg-slate-200 hover:opacity-80 hover:scale-105 transition rounded-full flex flex-col justify-center items-center"><IconClose className="rotate-45" /></button>
					</div>
					{props.children}
				</div>
			</div>
        </Popup>
    </React.Fragment>
  );
};

export default Index;