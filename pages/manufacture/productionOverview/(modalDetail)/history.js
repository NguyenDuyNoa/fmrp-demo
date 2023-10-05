import Image from "next/image";

const History = ({ data }) => {
    return (
        <>
            {data.dataHistory.map((e, index) => (
                <div key={index} className="grid grid-cols-12 my-2">
                    <div
                        className="col-span-2 
                    3xl:w-[60px] 3xl:h-[60px] xxl:w-[48px] xxl:h-[48px] 2xl:w-[45px] 2xl:h-[45px]
                    xl:w-[45px] xl:h-[45px]
                    lg:w-[40px] lg:h-[40px]
                     w-[60px] h-[60px] rounded-xl"
                    >
                        <Image
                            src={"/manufacture/Image.png"}
                            width={60}
                            height={60}
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                    <div className="col-span-8">
                        <h1 className="text-[#000000] font-semibold 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px]">
                            {e.title}
                        </h1>
                        <h1 className="3xl:text-[10px] xxl:text-[9px] 2xl:text-[9px] xl:text-[8px] lg:text-[8px] text-[10px] font-normal text-[#667085]">
                            {e.desriptions}
                        </h1>
                        <div className="flex items-center gap-4">
                            <h1 className="3xl:text-[10px] xxl:text-[9px] 2xl:text-[9px] xl:text-[8px] lg:text-[8px] text-[10px] font-normal text-[#667085]">
                                Số lượng đã xuất
                            </h1>
                            <h1 className="3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] font-medium text-[#141522]">
                                {e.number}
                            </h1>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};
export default History;
