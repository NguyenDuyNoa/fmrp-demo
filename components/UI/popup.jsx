import React, { useEffect } from "react";
import { PopupParent } from "@/utils/lib/Popup";
import { Add as IconClose } from "iconsax-react";
import { Inter, Lexend_Deca } from "@next/font/google";
const deca = Lexend_Deca({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"] });

import 'simplebar-react/dist/simplebar.min.css';
import { Customscrollbar } from "./common/Customscrollbar";
import { useDispatch, useSelector } from "react-redux";

const Popup = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: "statePopupParent", payload: props.open });
    }, [props.open])
    return (
        <React.Fragment>
            <button className={props.classNameBtn} onClick={props.onClickOpen}>
                {props.button}
            </button>
            <PopupParent
                open={props.open}
                closeOnDocumentClick={props?.closeOnDocumentClick || false}
                onClose={props.onClose}
                lockScroll={props.lockScroll}
                repositionOnResiz
                // repositionOnResiz={props.repositionOnResiz}
                className={`${props.className} popup-edit`}
            >
                <div className={`${inter.className} bg-[#ffffff] ${props?.classNameModeltime} p-4 shadow-xl rounded-xl w-full`}>
                    <div className={`${props.classNameTittle ? props.classNameTittle : "items-center"} flex justify-between`}>
                        <h1 className="text-[#101828] font-medium !text-base !capitalize">
                            {props.title}
                        </h1>

                        {
                            (props?.type || !props.onClose)
                                ?
                                ""
                                :
                                <button
                                    onClick={props.onClose}
                                    className="flex flex-col items-center justify-center transition rounded-full outline-none w-7 h-7 bg-slate-200 hover:opacity-80 hover:scale-105"
                                >
                                    <IconClose className="rotate-45" />
                                </button>
                        }
                    </div>

                    {props.children}

                </div>
            </PopupParent>
        </React.Fragment>
    );
};

export default Popup;
