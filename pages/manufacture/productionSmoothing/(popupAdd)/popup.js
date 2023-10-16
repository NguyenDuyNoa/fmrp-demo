import { Add } from "iconsax-react";
import PopupEdit from "/components/UI/popup";
import { useState } from "react";
import Image from "next/image";

const PopupAdd = (props) => {
    const [isOpenPopup, sIsOpenPopup] = useState(false);
    const handleOpenPopup = (e) => sIsOpenPopup(e);
    console.log(props.idParent, props.idChild);
    return (
        <PopupEdit
            title={""}
            button={
                <button
                    type="button"
                    className="outline-none  my-2 border-dashed border-[#9295A4] border-2 py-4 px-12 rounded-md bg-[#FAFAFA]"
                >
                    <div className="">
                        {/* <Add size="22" color="#3A3E4C" className="font-semibold" /> */}
                        <Image
                            alt=""
                            src="/productionSmoothing/add.png"
                            width={12}
                            height={14}
                            className="w-full h-full"
                        />
                    </div>
                </button>
            }
            onClickOpen={() => handleOpenPopup(true)}
            open={isOpenPopup}
            onClose={() => handleOpenPopup(false)}
            // classNameBtn={props?.className}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
            <div className=" space-x-5 3xl:w-[700px] 2xl:w-[600] xl:w-[500px] lg:w-[500px] w-[700px] 3xl:h-auto  2xl:h-auto xl:h-auto lg:h-[400px] h-[500px] ">
                <div></div>
            </div>
        </PopupEdit>
    );
};
export default PopupAdd;
