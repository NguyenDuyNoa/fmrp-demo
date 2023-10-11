{!e?.show && (
<div className="items-center flex  mb-8 col-span-4 justify-center ml-11">
{e?.process.map((item, i) => {
return (
<>
<div
className="relative py-8"
key={`process-${i}`}
onClick={() =>
handleProgressBarClick(i)
} >
{item?.code && (
<>
{/_ <div className="flex items-center  ">
<div
className={`${
                                                                                                            item?.code ==
                                                                                                                "production_plan" ||
                                                                                                            item?.code ==
                                                                                                                "produced_at_company" ||
                                                                                                            item?.code ==
                                                                                                                "import_warehouse" ||
                                                                                                            item?.code ==
                                                                                                                "delivery"
                                                                                                                ? `h-2 w-2 rounded-full bg-green-500`                                                                                                                :`h-2 w-2 rounded-full bg-gray-400`                                                                                                        }`}
/>
{item?.code !==
"delivery" ? (
<div
className={`${
                                                                                                                item?.code ==
                                                                                                                    "production_plan" ||
                                                                                                                item?.code ==
                                                                                                                    "produced_at_company" ||
                                                                                                                item?.code ==
                                                                                                                    "import_warehouse" ||
                                                                                                                item?.code ==
                                                                                                                    "delivery"
                                                                                                                    ? `sm:flex w-full bg-green-500 h-0.5 `                                                                                                                    :`sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-400`
                                                                                                            }`}
/>
) : null}
</div> _/}
{activeProcess ===
i && (
<div className="mt-2 w-[90px]">
<div
className={`${
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
                                                                                                            } mb-2 text-[11px] font-semibold leading-none  dark:text-gray-500 absolute 3xl:translate-x-[-38%] 2xl:translate-x-[-40%] xl:translate-x-[-40%] translate-x-[-40%] 3xl:translate-y-[-10%] 2xl:translate-y-[-20%] xl:translate-y-[-20%] translate-y-[-20%]`} >
{
dataLang[
item
?.name
]
}
</div>
</div>
)}
</>
)}
{/_ {item?.code ==
"production_plan" ||
item?.code ==
"produced_at_company" ||
item?.code ==
"import_warehouse" ||
item?.code == "delivery" ? (
<p className="text-indigo-700 3xl:w-[100px] 2xl:w-[100px] xl:w-[100px] w-[100px] text-[9.5px] absolute left-0 3xl:translate-x-[-25%] 2xl:translate-x-[-20%] xl:translate-x-[-25%] translate-x-[-25%] 3xl:translate-y-[100%] 2xl:translate-y-[120%] xl:translate-y-110%] translate-y-[120%] font-semibold">
KHSX-030623012
</p>
) : null} _/}
</div>
</>
);
})}
</div>
)}
