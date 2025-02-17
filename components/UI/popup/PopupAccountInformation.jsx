import PopupCustom from "@/components/UI/popup";
import { useDispatch, useSelector } from "react-redux";

const PopupAccountInformation = (props) => {
    const dispatch = useDispatch()

    const statePopupAccountInformation = useSelector((state) => state.statePopupAccountInformation);
    console.log("statePopupAccountInformation", statePopupAccountInformation);

    return (
        <PopupCustom
            title={"Thông tin tài khoản"}
            onClickOpen={() => { }}
            open={statePopupAccountInformation.open}
            onClose={() => {
                dispatch({ type: "statePopupAccountInformation", payload: { open: false } })
            }}
            classNameBtn={props?.className + "relative"}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
            <div className='w-[800px] max-w-[800px] h-[500px] grid grid-cols-2 bg-white rounded-xl relative'>

            </div>
        </PopupCustom>
    );
};

export default PopupAccountInformation;
