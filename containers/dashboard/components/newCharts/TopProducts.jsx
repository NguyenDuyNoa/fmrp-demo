import CalendarDropdown from "@/components/common/dropdown/CalendarDropdown";
import Image from "next/image";
import React from "react";

const CardProduct = ({ name, quantity, percentageChange }) => {
  return (
    <div className="flex-1 rounded-2xl p-6 flex justify-between items-start shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12),0px_0px_2px_0px_rgba(145,158,171,0.20)]">
      <div className="flex flex-col">
        <h3 className="text-3xl font-bold text-typo-blue-3">{quantity}</h3>
        <p className="text-sm font-normal text-typo-black-1">{name}</p>
      </div>
      {percentageChange !== undefined && (
        <div className="flex items-center gap-1">
          <Image
            src={
              percentageChange >= 0
                ? "/dashboard/upGreen.svg"
                : "/dashboard/downRed.svg"
            }
            alt={percentageChange >= 0 ? "upGreen" : "downRed"}
            width={24}
            height={24}
          />
          <p className="text-sm font-medium text-typo-gray-3">
            {Math.abs(percentageChange)}%
          </p>
        </div>
      )}
    </div>
  );
};

const topProductsData = [
  {
    id: 1,
    name: "Áo sơ mi dài tay",
    quantity: 48,
    percentageChange: 8.2,
  },
  {
    id: 2,
    name: "Quần tây",
    quantity: 18,
    percentageChange: -5,
  },
  {
    id: 3,
    name: "Áo hoodie",
    quantity: 40,
    percentageChange: 12,
  },
  {
    id: 4,
    name: "Đầm maxi",
    quantity: 23,
    percentageChange: 3.5,
  },
  {
    id: 5,
    name: "Áo thun cổ tròn",
    quantity: 48,
    percentageChange: 4.7,
  },
];

const TopProducts = () => {
  return (
    <div className="px-4 md:px-8 lg:px-12 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <h2 className="capitalize text-lg font-medium text-typo-black-1">
          Top sản phẩm sản xuất nhiều nhất
        </h2>
        <CalendarDropdown />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6">
        {topProductsData.map((product) => (
          <CardProduct
            key={product.id}
            name={product.name}
            quantity={product.quantity}
            percentageChange={product.percentageChange}
          />
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
