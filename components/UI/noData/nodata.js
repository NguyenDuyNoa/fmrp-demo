import { SearchNormal1 as Icon } from "iconsax-react";
import { motion } from "framer-motion";
const NoData = (props) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className=" max-w-[352px] mt-24 mx-auto">
                <div className="text-center">
                    <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                        <Icon />
                    </div>
                    <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
                    <div className="flex items-center justify-around mt-6 ">
                        {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
export default NoData;
