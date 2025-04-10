import { twMerge } from "tailwind-merge";

import React from "react";

const ProgressBar = ({ current, total, name }) => {
  const percent = Math.floor((current / total) * 100);
  const isFull = current >= total;

  const formatNumber = (value) => {
    const number = Number(value);

    if (isNaN(number)) return "0"; // fallback nếu không phải số

    const fixed = number.toFixed(1); // giữ 1 số thập phân
    return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
  };

  return (
    <div className="w-full max-w-md mx-auto text-center px-2">
      <div className="relative h-2 bg-background-gray-1 rounded-full overflow-hidden">
        <div
          className={twMerge(
            `h-full rounded-full transition-all duration-500 min-w-0`,
            isFull ? "bg-linear-bg-progress-full" : "bg-background-blue-2"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 xl:text-[10px] text-[8px] font-normal text-typo-gray-3">{`${formatNumber(
        current
      )}/${formatNumber(total)} ${name}`}</p>
    </div>
  );
};

export default ProgressBar;
