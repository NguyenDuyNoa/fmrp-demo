import { motion } from "framer-motion";
import Image from "next/image";

const nodataOld = (props) => {
    const type = {
        'notificationheader': '/icon/nodata-noti-final.svg',
        // 'notificationheader': '/icon/noti.svg',
        'dashboard': '/icon/task.svg',
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
                    <Image
                        width={1280}
                        height={1024}
                        alt="@nodata"
                        className={`${props?.classNameImage ? `${props?.classNameImage}` : "w-[90%] h-[90%]"} object-contain`}
                        src={type[props?.type] ?? "/icon/nodata_ok.svg"}
                        priority
                    />
                </div>
                <h1 className={`text-[#141522] opacity-90 font-medium ${props?.classNameTitle ? props?.classNameTitle : "text-sm"}`}>
                    {
                        props?.tpye === "table" ?
                            <span>Không tìm thấy dữ liệu</span>
                            :
                            <span>Không tìm thấy các mục</span>
                    }
                </h1>
            </div>
        </motion.div>
    );
};
export default nodataOld;
