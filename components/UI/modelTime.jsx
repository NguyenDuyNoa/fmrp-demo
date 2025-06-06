import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { Verify } from "iconsax-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PopupCustom from "@/components/UI/popup";

const PopupModelTime = (props) => {
    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const data = useSelector((state) => state.auth);

    useEffect(() => {
        data.trial && sOpen(data.trial);
    }, [data]);

    return (
        // <div className={`${open ? props?.hidden : props?.hidden}`}>
        <>
            <PopupCustom
                // title={"Khởi đầu chuyển đổi số ngay với phần mềm FMRP !"}
                // button={"props?.name"}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                // classNameModeltime="bg-logo"
                classNameModeltime="!p-0"
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className + "relative"}
                type={true}
            >
                <div className=" space-x-5 w-[900px] h-auto">
                    <div>
                        <div className="w-[900px]">
                            <div className="flex items-center justify-between gap-5 ">
                                <div className="rounded-tl-xl rounded-bl-xl 3xl:max-w-[520px] 3xl:w-[520px] xxl:max-w-[530px] xxl:w-[500px] 2xl:max-w-[500px] 2xl:w-[500px] max-w-[500px] w-[500px]  h-full max-h-full z-10">
                                    <img
                                        srcSet="/modelTime.png"
                                        className="object-cover w-full h-full rounded-tl-xl rounded-bl-xl"
                                    />
                                </div>
                                <div className="flex flex-col gap-6 ">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h1 className="text-gray-700 font-semibold text-[20px]">
                                            Khởi đầu chuyển đổi số ngay với phần mềm FMRP !
                                        </h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <Verify size="18" color="green" className="animate-bounce" />
                                        </div>
                                        <h1 className="col-span-9 pb-2  text-gray-700 font-semibold text-[14px] text-ju">
                                            Chào mừng
                                            <span className="mx-1 text-blue-500 uppercase">{data?.user_full_name}</span>
                                            đến với FMRP! Hãy dành thời gian để khám phá các tính năng hữu ích mà FMRP
                                            mang lại nhé.
                                        </h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <Verify size="18" color="green" className="animate-bounce" />
                                        </div>
                                        <h2 className=" py-1 text-gray-700 font-semibold text-[14px] text-ju">
                                            FMRP mong rằng bạn sẽ tìm được giải pháp hiệu quả cho quá trình quản lý sản
                                            xuất của doanh nghiệp bạn.
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <Verify size="18" color="green" className="animate-bounce" />
                                        </div>
                                        <h2 className=" py-1 text-gray-700 font-semibold text-[14px] text-ju">
                                            Thời gian dùng thử: Bắt đầu từ ngày
                                            <span className="mx-1 text-blue-500">
                                                {formatMoment(data?.start_date, FORMAT_MOMENT.DATE_SLASH_LONG)}
                                            </span>
                                            đến ngày
                                            <span className="mx-1 text-blue-500">
                                                {formatMoment(data?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG)}
                                            </span>
                                            và kết thúc sau
                                            <span className="mx-1 text-red-500">{data?.day_expiration}</span>
                                            ngày.
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <Verify size="18" color="green" className="animate-bounce" />
                                        </div>
                                        <h2 className=" py-1 text-gray-700 font-semibold text-[14px] text-ju flex flex-col ">
                                            <span>
                                                Mã công ty:
                                                <span className="mx-1 text-blue-500 capitalize">
                                                    {data?.code_company}
                                                </span>
                                            </span>
                                            <span>
                                                Tên truy cập:
                                                <span className="mx-1 text-blue-500 capitalize">
                                                    {data?.user_email}
                                                </span>
                                            </span>
                                        </h2>
                                    </div>
                                    <div className="flex justify-end p-1 mt-10">
                                        {/* <button>Bắt đầu trải nghiệm</button> */}
                                        <button
                                            type="button"
                                            onClick={_ToggleModal.bind(this, false)}
                                            className="py-3 text-sm font-medium text-blue-500 rounded-lg px-7 bg-blue-50 hover:bg-blue-100 hover:text-blue-600"
                                        >
                                            Bắt đầu trải nghiệm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupCustom>
        </>
    );
};
export default PopupModelTime;
