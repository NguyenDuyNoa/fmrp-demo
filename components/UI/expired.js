import React, { useState, useRef, useEffect } from "react";
import { NotificationBing } from "iconsax-react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { _ServerInstance as Axios } from "/services/axios";

const Expirred = () => {
    const router = useRouter();
    const [date, sDate] = useState({
        dateStart: null,
        dateEnd: null,
        dateLimit: null,
    });
    const [checkDate, sCheckDate] = useState(false);

    // const data = {
    //     dateStart: moment(new Date()).format("DD/MM/YYYY"),
    //     dateEnd: 10,
    // };
    const dispatch = useDispatch();
    // const startDate = new Date(data.dateStart);
    // startDate.setDate(startDate.getDate() + data.dateEnd);

    // const formattedEndDate = `${startDate.getDate()}/${
    //     startDate.getMonth() + 1
    // }/${startDate.getFullYear()}`;

    const data = useSelector((state) => state.auth);
    useEffect(() => {
        sCheckDate(data?.fail_expiration);
        sDate({
            dateStart: moment(data?.start_date).format("DD/MM/YYYY"),
            dateEnd: moment(data?.expiration_date).format("DD/MM/YYYY"),
            dateLimit: data?.day_expiration,
        });
    }, [data]);
    // const _ServerLang = () => {
    //     Axios(
    //         "GET",
    //         `/api_web/Api_Authentication/authentication?csrf_protection=true`,
    //         {},
    //         (err, response) => {
    //             if (!err) {
    //                 var data = response?.data?.info;
    //                 sCheckDate(data?.fail_expiration);
    //                 sDate({
    //                     dateStart: moment(data?.start_date).format(
    //                         "DD/MM/YYYY"
    //                     ),
    //                     dateEnd: moment(data?.expiration_date).format(
    //                         "DD/MM/YYYY"
    //                     ),
    //                     dateLimit: data?.day_expiration,
    //                 });
    //             }
    //         }
    //     );
    // };
    // useEffect(() => {
    //     _ServerLang();
    // }, []);

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
                    <div className="flex justify-between items-center bg-gray-100 p-1">
                        <div className="flex items-center gap-1">
                            <h2 className="font-medium 3xl:text-[14px] 2xl:text-[14px] xl:text-[12px] text-[13px] px-2">
                                Phiên bản dùng thử dành cho FOSO từ ngày
                                <span className="mx-1">
                                    {date?.dateStart} đến ngày {date?.dateEnd}
                                </span>
                                sẽ kết thúc sau
                                <span className="mx-1 font-semibold px-2.5 py-1 bg-gray-200 rounded text-center">
                                    {date?.dateLimit}
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
