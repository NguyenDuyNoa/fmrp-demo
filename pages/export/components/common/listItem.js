import { TiTick, TiTimes, TiArrowRight } from "react-icons/ti";
import Zoom from "./zoomElement";
const ListItem = ({ dataColumnNew, type, dataLang, HandlePushItem, isShow, dataEmty, sDataEmty }) => {
    return (
        <div className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-auto 3xl:h-[50vh] xxl:h-[26vh] 2xl:h-[40vh] xl:h-[26vh] lg:h-[28vh]">
            {dataColumnNew &&
                dataColumnNew.map((e, index) => {
                    return (
                        <div key={index} className="my-2 mx-2">
                            <Zoom>
                                <button
                                    onClick={() => HandlePushItem(e.value, type, dataEmty, sDataEmty)}
                                    class="group hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded-xl inline-flex justify-between gap-2 items-center text-sm font-medium hover:border-gray-200"
                                >
                                    <span className="3xl:text-[14px] xxl:text-[13px] 2xl:text-[11px] xl:text-[10px] text-[11px]">
                                        {dataLang[e.label] || e.label}
                                    </span>
                                    {isShow ? (
                                        <>
                                            <TiTick
                                                size="20"
                                                color="green"
                                                className="group-hover:hidden transition-all duration-200 ease-in-out"
                                            />
                                            <TiTimes
                                                size="20"
                                                color="red"
                                                className="group-hover:block hidden transition-all duration-200 ease-in-out"
                                            />
                                        </>
                                    ) : (
                                        <TiArrowRight size="20" color="gray" className="" />
                                    )}
                                </button>
                            </Zoom>
                        </div>
                    );
                })}
        </div>
    );
};
export default ListItem;
