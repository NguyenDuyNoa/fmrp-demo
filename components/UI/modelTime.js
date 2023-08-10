import React, { useState, useEffect } from "react";
import PopupEdit from "/components/UI/popup";
import moment from "moment/moment";
import { Cd, Verify } from "iconsax-react";
import { useSelector } from "react-redux";

const PopupModelTime = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const data = useSelector((state) => state.auth);
    useEffect(() => {
        data.fail_expiration && sOpen(data.fail_expiration);
    }, [data]);
    console.log("data", data);

    return (
        // <div className={`${open ? props?.hidden : props?.hidden}`}>
        <>
            <PopupEdit
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
                <div className=" space-x-5 w-[830px] h-auto">
                    <div>
                        <div className="w-[830px] ">
                            <div className="flex items-center justify-between gap-5 ">
                                <div className="rounded-tl-xl rounded-bl-xl max-w-[420px] w-[420px] h-[400px] max-h-[400px] z-10">
                                    <img
                                        srcSet="/modelTime.png"
                                        className="w-full h-full object-cover rounded-tl-xl  rounded-bl-xl"
                                    />
                                </div>
                                <div className=" flex flex-col gap-4">
                                    <div className="flex items-center pt-2 gap-2">
                                        <h1 className=" text-gray-700 font-semibold text-[20px]">
                                            Khởi đầu chuyển đổi số ngay với phần
                                            mềm FMRP !
                                        </h1>
                                    </div>
                                    <div className="flex items-center">
                                        <div>
                                            <Verify
                                                size="18"
                                                color="green"
                                                className="animate-bounce"
                                            />
                                        </div>
                                        <h1 className="col-span-9 pb-2 px-2 text-gray-700 font-semibold text-[14px]">
                                            Chào mừng
                                            <span className="text-blue-500 uppercase mx-1">
                                                {props?.data?.user_full_name}
                                            </span>
                                            đến với FMRP! Hãy dành thời gian để
                                            khám phá các tính năng hữu ích mà
                                            FMRP mang lại nhé.
                                        </h1>
                                    </div>
                                    <div className="flex items-center">
                                        <div>
                                            <Verify
                                                size="18"
                                                color="green"
                                                className="animate-bounce"
                                            />
                                        </div>
                                        <h2 className="px-2 py-1 text-gray-700 font-semibold text-[14px]">
                                            FMRP mong rằng bạn sẽ tìm được giải
                                            pháp hiệu quả cho quá trình quản lý
                                            sản xuất của doanh nghiệp bạn.
                                        </h2>
                                    </div>
                                    <div className="flex items-center">
                                        <div>
                                            <Verify
                                                size="18"
                                                color="green"
                                                className="animate-bounce"
                                            />
                                        </div>
                                        <h2 className="px-2 py-1 text-gray-700 font-semibold text-[14px]">
                                            Thời gian dùng thử: Bắt đầu từ ngày
                                            <span className="text-blue-500 mx-1">
                                                {moment(
                                                    props?.data?.start_date
                                                ).format("DD/MM/YYYY")}
                                            </span>
                                            đến ngày
                                            <span className="text-blue-500 mx-1">
                                                {moment(
                                                    props?.data?.expiration_date
                                                ).format("DD/MM/YYYY")}
                                            </span>
                                            và kết thúc sau
                                            <span className="text-red-500 mx-1">
                                                {props?.data?.day_expiration}
                                            </span>
                                            ngày.
                                        </h2>
                                    </div>
                                    <div className="flex items-center">
                                        <div>
                                            <Verify
                                                size="18"
                                                color="green"
                                                className="animate-bounce"
                                            />
                                        </div>
                                        <h2 className="px-2 py-1 text-gray-700 font-semibold text-[14px] flex flex-col ">
                                            <span>
                                                Mã công ty:
                                                <span className="capitalize mx-1 text-blue-500">
                                                    {props?.data?.code_company}
                                                </span>
                                            </span>
                                            <span>
                                                Tên truy cập:
                                                <span className="capitalize mx-1 text-blue-500">
                                                    {props?.data?.user_email}
                                                </span>
                                            </span>
                                        </h2>
                                    </div>
                                    <div className="flex justify-end p-2">
                                        {/* <button>Bắt đầu trải nghiệm</button> */}
                                        <button
                                            type="button"
                                            onClick={_ToggleModal.bind(
                                                this,
                                                false
                                            )}
                                            className="px-5 py-2.5 font-medium bg-blue-50 hover:bg-blue-100 hover:text-blue-600 text-blue-500 rounded-lg text-sm"
                                        >
                                            Bắt đầu trải nghiệm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};
export default PopupModelTime;
