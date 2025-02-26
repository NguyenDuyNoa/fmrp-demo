import { motion } from "framer-motion";
import Image from "next/image";

const NoData = (props) => {
    const type = {
        'notificationheader': '/icon/data_empty_noti.svg',
        // 'notificationheader': '/icon/noti.svg',
        'dashboard': '/icon/data_empty_dashboard-1.svg',
    }
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            {...props}
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div className={`h-full flex flex-col justify-center items-center gap-5 mx-auto ${props?.className ? `${props?.className} py-5` : "mt-24"}`}>
                <div className="flex flex-col items-center justify-center">
                    {/* bg-[#EBF4FF]  */}
                    <Image
                        width={1280}
                        height={1024}
                        alt="@nodata"
                        className={`${props?.classNameImage ? `${props?.classNameImage}` : "w-[83%] h-[83%]"} object-cover`}
                        // src={"/no_data.svg"}
                        src={type[props?.type] ?? "/no_data.svg"}
                    // src={type[props?.type] ?? "/data_empty.svg"}
                    />
                </div>
                <h1 className={`text-[#141522] opacity-90 font-medium ${props?.classNameTitle ? props?.classNameTitle : "text-sm"}`}>
                    Không tìm thấy các mục
                </h1>
                {/* <div className="flex items-center justify-around mt-6 ">
                        <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />    
                    </div> */}
            </div>
        </motion.div>
    );
};
export default NoData;
