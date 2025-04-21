import Image from 'next/image';
import React from 'react'
import { twMerge } from 'tailwind-merge';

const Cardtable = ({
    imageURL,
    name,
    variation,
    code,
    typeProduct,
    typeTable,
    dataLang,
    date,
    classNameImage = "",
    classNameContent = ""
}) => {
    return (
        <div className=" w-full h-full flex flex-row items-start gap-x-2">
            <div className={twMerge("rounded bg-gray-100 2xl:size-14 size-10 shrink-0 overflow-hidden", classNameImage)}>
                <Image
                    alt="default"
                    src={imageURL || "/icon/default/default.png"}
                    width={200}
                    height={200}
                    quality={100}
                    className="size-full object-cover"
                />
            </div>
            <div className={twMerge("flex flex-col items-start justify-start gap-y-1 w-full", classNameContent)}>
                <h3 className="font-semibold text-[10px] xl:text-[12px] text-typo-black-1 xlg:text-sm">
                    {name}
                </h3>
                <p className="xlg:text-[10px] xl:text-[8px] text-[6px] font-normal text-typo-gray-2">
                    {variation || "(none)"}
                </p>
                {code && <p className="xlg:text-[10px] xl:text-[8px] text-[6px] font-normal text-typo-blue-2">
                    {typeTable === "temProducts" && 'LOT'} {code}
                </p>}
                {date && typeTable === "temProducts" && <p className="xlg:text-[10px] xl:text-[8px] text-[6px] font-normal text-typo-blue-2">
                    Date: {date}
                </p>}
                {typeTable === "products" && (
                    <div
                        className={twMerge(
                            "rounded xl:px-1 px-[2px] w-fit",
                            typeProduct === "semi_products"
                                ? "bg-background-green-1/20 text-typo-green-1 "
                                : "bg-background-blue-1/20 text-typo-blue-3 "
                        )}
                    >
                        <p className="xl:text-[6px] font-medium xlg:leading-4 leading-2 text-[4px]">
                            {typeProduct === "semi_products"
                                ? dataLang?.semi_products
                                : dataLang?.semi_products_outside}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cardtable