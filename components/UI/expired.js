import React, { useState, useRef, useEffect } from "react";
import { NotificationBing } from "iconsax-react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

const Expirred = () => {
    const router = useRouter();
    const data = {
        dateStart: moment(new Date()).format("DD/MM/YYYY"),
        dateEnd: 10,
    };
    const dispatch = useDispatch();
    const startDate = new Date(data.dateStart);
    startDate.setDate(startDate.getDate() + data.dateEnd);

    const formattedEndDate = `${startDate.getDate()}/${
        startDate.getMonth() + 1
    }/${startDate.getFullYear()}`;

    const [checkDate, sCheckDate] = useState(true);
    const [extend, sExtend] = useState(false);
    const _HandleExtend = () => {
        router.push("/settings/service-information");
    };

    useEffect(() => {
        dispatch({
            type: "trangthaiExprired",
            payload: checkDate,
        });
    }, [checkDate]);

    return (
        <React.Fragment>
            {checkDate ? (
                <div className="rounded relative">
                    <div className="flex justify-between items-center bg-gray-100 p-2.5">
                        <div className="flex items-center gap-1">
                            <h2 className="font-medium text-[14px] px-2">
                                Phiên bản dùng thử dành cho FOSO từ ngày
                                <span className="mx-1">
                                    {data.dateStart} đến ngày {formattedEndDate}
                                </span>
                                sẽ kết thúc sau
                                <span className="mx-1 font-semibold px-2.5 py-1 bg-gray-200 rounded text-center">
                                    2
                                </span>
                                ngày. Một số tính năng của bạn sẽ bị đóng.
                            </h2>
                            <NotificationBing
                                size="20"
                                color="red"
                                className="animate-bounce"
                            />
                        </div>
                        <div>
                            <button
                                onClick={_HandleExtend.bind(this)}
                                type="button"
                                className="relative inline-flex items-center justify-start px-3.5 py-1 overflow-hidden font-medium transition-all bg-red-500 rounded group"
                            >
                                <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-red-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                                </span>
                                <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full translate-y-full bg-red-600 rounded group-hover:mb-7 group-hover:translate-x-0"></span>
                                <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white text-[13.5px]">
                                    Gia hạn thêm
                                </span>
                            </button>
                        </div>
                    </div>
                    <span className="h-3 w-3 absolute bottom-1/2 -translate-y-1/5  left-0 -translate-x-2/4">
                        <span className="inline-flex relative rounded-full h-3 w-3 bg-red-500">
                            <span className="animate-ping  inline-flex h-full w-full rounded-full bg-red-400 opacity-75 absolute"></span>
                        </span>
                    </span>
                </div>
            ) : (
                // <div></div>
                ""
            )}
        </React.Fragment>
    );
};
export default Expirred;
