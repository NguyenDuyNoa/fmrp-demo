 <div className="items-center flex mb-2  justify-center ">
                                                                        {e?.process.map((item, i) => {
                                                                            return (
                                                                                <div className="">
                                                                                    <div
                                                                                        className="group"
                                                                                        key={`process-${i}`}
                                                                                        // onClick={() =>
                                                                                        //     handleProgressBarClick(
                                                                                        //         item,
                                                                                        //         e?.id,
                                                                                        //         index
                                                                                        //     )
                                                                                        // }
                                                                                    >
                                                                                        {item?.code && (
                                                                                            <div>
                                                                                                <div
                                                                                                    // onClick={() =>
                                                                                                    //     handleProgressBarClick(
                                                                                                    //         item,
                                                                                                    //         e?.id,
                                                                                                    //         index
                                                                                                    //     )
                                                                                                    // }
                                                                                                    className="flex cursor-pointer items-center relative "
                                                                                                >
                                                                                                    {/* <motion.div
                                                                                                        whileHover={{
                                                                                                            scale: 1.8,
                                                                                                        }}
                                                                                                    >
                                                                                                        <div
                                                                                                            className={` ${
                                                                                                                item?.code ==
                                                                                                                    "production_plan" ||
                                                                                                                item?.code ==
                                                                                                                    "produced_at_company" ||
                                                                                                                item?.code ==
                                                                                                                    "import_warehouse" ||
                                                                                                                item?.code ==
                                                                                                                    "delivery"
                                                                                                                    ? `h-[10px] w-[10px] rounded-full bg-green-500 animate-bounce`
                                                                                                                    : `h-[10px] w-[10px] rounded-full bg-gray-400 animate-bounce`
                                                                                                            } `}
                                                                                                        ></div>
                                                                                                    </motion.div> */}
                                                                                                    <Popup
                                                                                                        trigger={
                                                                                                            <div className=" ">
                                                                                                                <motion.div
                                                                                                                    whileHover={{
                                                                                                                        scale: 1.8,
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <div
                                                                                                                        className={` ${
                                                                                                                            item?.code ==
                                                                                                                                "production_plan" ||
                                                                                                                            item?.code ==
                                                                                                                                "produced_at_company" ||
                                                                                                                            item?.code ==
                                                                                                                                "import_warehouse" ||
                                                                                                                            item?.code ==
                                                                                                                                "delivery"
                                                                                                                                ? `h-[10px] w-[10px] rounded-full bg-green-500 animate-bounce`
                                                                                                                                : `h-[10px] w-[10px] rounded-full bg-gray-400 animate-bounce`
                                                                                                                        } `}
                                                                                                                    ></div>
                                                                                                                </motion.div>
                                                                                                            </div>
                                                                                                        }
                                                                                                        position="top center"
                                                                                                        on={[
                                                                                                            "hover",
                                                                                                            "focus",
                                                                                                        ]}
                                                                                                    >
                                                                                                        <div className="flex flex-col transition-all duration-300 ease-linear bg-gray-700 px-2.5 py-0.5 rounded-xl">
                                                                                                            <div
                                                                                                                className={`text-center ${
                                                                                                                    item?.code ==
                                                                                                                        "production_plan" ||
                                                                                                                    item?.code ==
                                                                                                                        "produced_at_company" ||
                                                                                                                    item?.code ==
                                                                                                                        "import_warehouse" ||
                                                                                                                    item?.code ==
                                                                                                                        "delivery"
                                                                                                                        ? "text-green-500"
                                                                                                                        : "text-slate-500"
                                                                                                                } text-[13px]  leading-none px-2.5 py-1.5 font-semibold   text-white`}
                                                                                                            >
                                                                                                                {
                                                                                                                    dataLang[
                                                                                                                        item
                                                                                                                            ?.name
                                                                                                                    ]
                                                                                                                }
                                                                                                            </div>
                                                                                                            {item?.code ===
                                                                                                                "keep_stock" ||
                                                                                                            item?.code ===
                                                                                                                "delivery" ? (
                                                                                                                <p className="text-xs  p-0.5 border border-white text-white rounded-md font-normal">
                                                                                                                    Chưa
                                                                                                                    giữ
                                                                                                                    kho
                                                                                                                </p>
                                                                                                            ) : null}
                                                                                                            {item?.code ==
                                                                                                                "production_plan" ||
                                                                                                            item?.code ==
                                                                                                                "produced_at_company" ||
                                                                                                            item?.code ==
                                                                                                                "import_warehouse" ||
                                                                                                            item?.code ==
                                                                                                                "delivery" ? (
                                                                                                                <p className="text-xs py-1 text-white">
                                                                                                                    KHSX-030623012
                                                                                                                </p>
                                                                                                            ) : null}
                                                                                                        </div>
                                                                                                    </Popup>
                                                                                                    {item?.code !=
                                                                                                    "delivery" ? (
                                                                                                        <div
                                                                                                            className={`w-[35px] ${
                                                                                                                item?.code ==
                                                                                                                    "production_plan" ||
                                                                                                                item?.code ==
                                                                                                                    "produced_at_company" ||
                                                                                                                item?.code ==
                                                                                                                    "import_warehouse" ||
                                                                                                                item?.code ==
                                                                                                                    "delivery"
                                                                                                                    ? ` bg-green-500 h-0.5 `
                                                                                                                    : ` bg-gray-200 h-0.5 `
                                                                                                            }`}
                                                                                                        />
                                                                                                    ) : null}
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>

////
{/_ process product _/}
{e?.show && (
<div className="items-center flex pl-10 mb-8">
{e?.process.map((item, i) => {
return (
<>
<div
className="relative 3xl:mb-8 2xl:mb-7 xl:mb-5 mb-4 3xl:pt-4 2xl:pt-2 xl:pt-2 pt-1"
key={`process-${i}`} >
{item?.code && (
<>
<div className="flex items-center">
<div
className={`${
                                                                                                        item?.active ===
                                                                                                        false
                                                                                                            ? `h-3 w-3 rounded-full bg-gray-400`                                                                                                            :`h-3 w-3 rounded-full bg-green-500`                                                                                                    }`}
/>
{item?.code !==
"delivery" ? (
<div
className={`${
                                                                                                            item?.active ===
                                                                                                            false
                                                                                                                ? `sm:flex xl:w-40 w-32 bg-gray-200 h-0.5 dark:bg-gray-400`                                                                                                                :`sm:flex xl:w-40 w-32 bg-gray-200 h-0.5 dark:bg-green-500`
                                                                                                        }`}
/>
) : null}
</div>
<div className="mt-2 w-24">
<div className="3xl:max-w-[180px] lg:max-w-[150px] mb-2 xl:text-xs text-[10px] font-normal leading-none text-gray-400 dark:text-gray-500 absolute 3xl:translate-x-[-38%] 2xl:translate-x-[-40%] xl:translate-x-[-40%] translate-x-[-40%] 3xl:translate-y-[-10%] 2xl:translate-y-[-20%] xl:translate-y-[-20%] translate-y-[-20%]">
{
dataLang[
item?.name
]
}
</div>
</div>
</>
)}
{item?.code === "keep_stock" ||
item?.code === "delivery" ? (
<p className="3xl:max-w-[180px] 2xl:max-w-[150px] xl:max-w-[130px] max-w-[100px] 3xl:text-[12px] 2xl:text-[12px] xl:text-[10px] lg:text-[9px] absolute left-0 3xl:translate-x-[-40%] 2xl:translate-x-[-45%] xl:translate-x-[-45%] translate-x-[-45%] 3xl:translate-y-[100%] 2xl:translate-y-[120%] xl:translate-y-[110%] translate-y-[120%] p-0.5 border border-amber-600 text-amber-600 rounded-md font-normal">
Chưa giữ kho
</p>
) : null}
{item?.code == "production_plan" ||
item?.code ==
"produced_at_company" ||
item?.code == "import_warehouse" ||
item?.code == "delivery" ? (
<p className="3xl:w-[200px] 2xl:w-[200px] xl:w-[150px] w-[150px] 3xl:text-[12px] 2xl:text-[12px] xl:text-[10px] lg:text-[10px] absolute left-0 3xl:translate-x-[-25%] 2xl:translate-x-[-20%] xl:translate-x-[-25%] translate-x-[-25%] 3xl:translate-y-[50%] 2xl:translate-y-[60%] xl:translate-y-[60%] translate-y-[60%] font-normal">
KHSX-030623012
</p>
) : null}
</div>
</>
);
})}
</div>
)}
