import React from "react";
import { Colorfilter, ColorsSquare, Map, UserAdd } from "iconsax-react";

const Stepper = ({ stepper, tabPage, label1, label2 }) => {
  const IconToShow1 = tabPage != 1 ? ColorsSquare : UserAdd;
  const IconToShow2 = tabPage != 1 ? Colorfilter : Map;

  return (
    <React.Fragment>
      <div className="flex items-center gap-1 group">
        <IconToShow1
          size="22"
          className={`${
            stepper.main ? "text-blue-600" : "text-gray-500"
          } group-hover:scale-105 transition-all ease-linear animate-pulse duration-700`}
        />
        <h3
          className={`${
            stepper.main ? "text-blue-600" : "text-gray-600"
          } font-semibold duration-700 3xl:text-sm 2xl:text-sm xl:text-xs text-xs`}
        >
          {label1}
        </h3>
      </div>
      <div
        className={`${
          tabPage == 1
            ? "3xl:w-[45%] 2xl:w-[30%] w-[25%]"
            : "3xl:w-[50%] 2xl:w-[40%] w-[35%]"
        }  h-2 bg-gray-200  rounded-xl relative duration-500 transition`}
      >
        <div
          style={{
            width: `${
              tabPage != 1
                ? stepper.main && !stepper.extra
                  ? "50%"
                  : stepper.main && stepper.extra
                  ? "100%"
                  : "0%"
                : stepper.main && !stepper.extra
                ? "50%"
                : stepper.main && stepper.extra
                ? "100%"
                : !stepper.main && stepper.extra
                ? "50%"
                : "0%"
            }`,
          }}
          className={`absolute  bg-blue-600 top-0 left-0 h-full rounded transition-all duration-500`}
        ></div>
      </div>
      <div className="flex items-center gap-1 group">
        <IconToShow2
          size="22"
          className={`${
            tabPage != 1
              ? stepper?.main && stepper?.extra
              : (!stepper?.main && stepper?.extra) ||
                (stepper?.main && stepper?.extra)
              ? "text-blue-600"
              : "text-gray-500"
          } group-hover:scale-105 duration-700 transition-all ease-linear animate-pulse`}
        />
        <h3
          className={`${
            tabPage != 1
              ? stepper?.main && stepper?.extra
              : (!stepper?.main && stepper?.extra) ||
                (stepper?.main && stepper?.extra)
              ? "text-blue-600"
              : "text-gray-600"
          } font-semibold 3xl:text-sm 2xl:text-sm xl:text-xs text-xs duration-700`}
        >
          {label2}
        </h3>
      </div>
    </React.Fragment>
  );
};

export default Stepper;
