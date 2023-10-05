import moment from "moment/moment";
import Image from "next/image";

const Step = ({ data }) => {
    return (
        <div>
            <div className="p-4 max-w-xl mx-auto">
                {data.dataStep.map((e, index) => (
                    <div className="flex gap-8">
                        <div className="pt-0 pb-8 flex-col flex items-end">
                            <p className="mb-2 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] text-[#667085]">
                                {e.time}
                            </p>
                            <p className="text-gray-600 dark:text-slate-400 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px]">
                                {moment(e.date).format("DD/MM/YYYY")}
                            </p>
                        </div>
                        <div className="flex-col flex items-center">
                            <div>
                                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#131313]/60">
                                    <div className="bg-[#646776] w-3 h-3 rounded-full"></div>
                                </div>
                            </div>
                            {!e.last && <div className="h-full w-[2px] border-[#13131382] border-dashed border"></div>}
                        </div>
                        <div className="pt-0 pb-8 w-full">
                            <div className="flex justify-between">
                                <p className="mb-2 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] text-[#667085]">
                                    SL hoàn thành
                                </p>
                                <p className="mb-2 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] text-[#0BAA2E]">
                                    {e.quantitySusce}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="mb-2 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] text-[#667085]">
                                    SL phế
                                </p>
                                <p className="mb-2 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] text-[#EE1E1E]">
                                    {e.quantityFalse}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-[24px] h-[24px]">
                                    <Image
                                        src={e.image}
                                        width={24}
                                        height={24}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-col justify-between">
                                    <p className="3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] text-[#1C1C1C]">
                                        {e.name}
                                    </p>
                                    <p className="mb-23xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] text-[#000000]/40">
                                        {e.position}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Step;
