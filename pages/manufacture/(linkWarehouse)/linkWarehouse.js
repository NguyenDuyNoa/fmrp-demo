import React from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";

const LinkWarehouse = ({ warehouse_id, warehouse_name }) => {
    const router = useRouter();
    return (
        <Link
            href={`/warehouses/warehouse/${warehouse_id}`}
            className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] text-sky-700 font-semibold  hover:text-sky-500"
        >
            {warehouse_name}
        </Link>
    );
};
export default LinkWarehouse;
