import React from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";

const LinkWarehouse = ({ warehouse_id, warehouse_name, open }) => {
    const wordsArray = warehouse_name?.split(" ");
    return (
        <h6
            className={`font-medium text-[9px] text-zinc-600 col-span-1 text-left`}
        >
            <Link
                href={`/warehouses/warehouse/${warehouse_id}`}
                className={`${
                    open
                        ? "text-[13px]"
                        : "3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]" ||
                          wordsArray?.length > 4
                        ? "3xl:text-[14px] 2xl:text-[11px] xl:text-[10px] text-[10px]"
                        : "3xl:text-base 2xl:text-[12.5px] xl:text-[11px]"
                } text-sky-700 font-semibold  hover:text-sky-500`}
            >
                {warehouse_name}
            </Link>
        </h6>
    );
};
export default LinkWarehouse;
