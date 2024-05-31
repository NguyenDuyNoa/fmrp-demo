import React from "react";
import { Colorfilter, ColorsSquare, Map, UserAdd } from "iconsax-react";
import { TiTick } from "react-icons/ti";

const Stepper = ({ stepper, tabPage, label1, label2 }) => {
    const IconToShow1 = tabPage == 3 || tabPage == 4 ? ColorsSquare : UserAdd;
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
                        : tabPage == 2
                        ? "3xl:w-[70%] 2xl:w-[65%] xl:w-[63%] w-[53%] "
                        : tabPage == 3 || tabPage == 4
                        ? "3xl:w-[50%] 2xl:w-[40%] w-[35%]"
                        : "3xl:w-[50%] 2xl:w-[40%] w-[35%]"
                }  h-2 bg-gray-200  rounded-xl relative duration-500 transition `}
            >
                <div
                    style={{
                        width: `${
                            tabPage == 3 || tabPage == 4
                                ? stepper.main && !stepper.extra
                                    ? "50%"
                                    : stepper.main && stepper.extra
                                    ? "100%"
                                    : "0%"
                                : tabPage == 1
                                ? stepper.main && !stepper.extra
                                    ? "50%"
                                    : stepper.main && stepper.extra
                                    ? "100%"
                                    : !stepper.main && stepper.extra
                                    ? "50%"
                                    : "0%"
                                : tabPage == 2 && stepper.main && stepper.extra
                                ? "100%"
                                : "0%"
                        }`,
                    }}
                    className={`absolute  bg-blue-600 hover:bg-blue-300 top-0 left-0 h-full rounded transition-all ${
                        tabPage == 2 ? "duration-[1500ms]" : "duration-500"
                    }`}
                ></div>
                {tabPage == 2 && (
                    <TiTick
                        size={22}
                        color={stepper.main && stepper.extra ? "green" : "gray"}
                        className={`absolute -right-6 top-1/2 rounded transition-all duration-[1500ms] -translate-y-1/2 `}
                    />
                )}
            </div>
            {tabPage != 2 && (
                <div className="flex items-center gap-1 group">
                    <IconToShow2
                        size="22"
                        className={`${
                            // tabPage != 1
                            //     ? stepper?.main && stepper?.extra
                            //     : (!stepper?.main && stepper?.extra) ||
                            //       (stepper?.main && stepper?.extra)
                            //     ? "text-blue-600"
                            //     : "text-gray-500"
                            tabPage == 3 || tabPage == 4
                                ? stepper?.main && stepper?.extra
                                    ? " text-blue-600"
                                    : " text-gray-500"
                                : tabPage != 1
                                ? stepper?.main && stepper?.extra
                                : (!stepper?.main && stepper?.extra) ||
                                  (stepper?.main && stepper?.extra)
                                ? "text-blue-600"
                                : "text-gray-500"
                        } group-hover:scale-105 duration-700 transition-all ease-linear animate-pulse`}
                    />
                    <h3
                        className={`${
                            // tabPage != 1
                            //     ? stepper?.main && stepper?.extra
                            //     : (!stepper?.main && stepper?.extra) ||
                            //       (stepper?.main && stepper?.extra)
                            //     ? " text-blue-600"
                            //     : " text-gray-500"
                            tabPage == 3 || tabPage == 4
                                ? stepper?.main && stepper?.extra
                                    ? " text-blue-600"
                                    : " text-gray-500"
                                : tabPage != 1
                                ? stepper?.main && stepper?.extra
                                : (!stepper?.main && stepper?.extra) ||
                                  (stepper?.main && stepper?.extra)
                                ? "text-blue-600"
                                : "text-gray-500"
                        } font-semibold 3xl:text-sm 2xl:text-sm xl:text-xs text-xs duration-700`}
                    >
                        {label2}
                    </h3>
                </div>
            )}
        </React.Fragment>
    );
};

export default Stepper;
