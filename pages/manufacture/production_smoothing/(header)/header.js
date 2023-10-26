import Zoom from "components/UI/zoomElement/zoomElement";
import Image from "next/image";
import PopupAdd from "../(popupAdd)/popup";

const Header = ({ data, listStaff }) => {
    return (
        <>
            <div className="flex items-center justify-between">
                <div className={` flex space-x-3  xl:text-[14.5px] text-[12px]`}>
                    <h6 className="text-[#141522]/40">{"Sản xuất"}</h6>
                    <span className="text-[#141522]/40">/</span>
                    <h6>{"Điều độ sản xuất"}</h6>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-medium text-[#11315B]">Điều độ sản xuất</h1>
                <div>
                    <Zoom>
                        <PopupAdd data={data} listStaff={listStaff} className="text-left" />
                    </Zoom>
                </div>
            </div>
        </>
    );
};
export default Header;
