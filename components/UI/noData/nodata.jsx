import { motion } from "framer-motion";
import Image from "next/image";

const NoData = (props) => {
    const type = {
        'notificationheader': '/icon/noti.svg'
    }
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            {...props}
        >
            <div className={`mt-24 mx-auto ${props?.className ? props?.className : "max-w-[352px] "}`}>
                <div className="text-center">
                    <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                        <Image
                            width={1280}
                            height={1024}
                            alt="@nodata"
                            className={`${props?.classNameImage ? props?.classNameImage : ""} w-full h-full object-cover`}
                            src={type[props?.type] ?? "/data_empty.svg"}
                        />
                    </div>
                    <h1 className={`text-[#141522] opacity-90 font-medium ${props?.classNameTitle ? props?.classNameTitle : "text-base"}`}>Không tìm thấy các mục</h1>
                    <div className="flex items-center justify-around mt-6 ">
                        {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
export default NoData;
