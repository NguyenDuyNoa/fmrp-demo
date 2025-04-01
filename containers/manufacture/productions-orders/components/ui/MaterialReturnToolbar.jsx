import React from "react";
import AnimatedSearchInput from "@/components/common/search/AnimatedSearchInput";
import ButtonAnimationNew from "@/components/common/button/ButtonAnimationNew";
import ArrowCounterClockwiseIcon from "@/components/icons/common/ArrowCounterClockwiseIcon";
import ExcelFileComponent from "@/components/common/excel/ExcelFileComponent";
import { PiTable } from "react-icons/pi";

const MaterialReturnToolbar = ({
    isOpenSearch,
    toggleSearch,
    searchValue,
    onChangeSearch,
    onReload,
    dataLang,
    flagMaterialReturn,
    multiDataSet,
}) => {
    return (
        <div className="flex items-center justify-end gap-3">
            <AnimatedSearchInput
                isOpen={isOpenSearch}
                onToggle={toggleSearch}
                value={searchValue}
                onChange={onChangeSearch}
                placeholder={dataLang?.productions_orders_find || "Tìm kiếm..."}
            />

            <ButtonAnimationNew
                icon={
                    <div className="3xl:size-5 size-4">
                        <ArrowCounterClockwiseIcon className="size-full" />
                    </div>
                }
                onClick={onReload}
                title="Tải lại"
                className="3xl:h-10 h-9 xl:px-4 px-2 flex items-center gap-2 xl:text-sm text-xs font-normal text-[#0BAA2E] border border-[#0BAA2E] hover:bg-[#EBFEF2] hover:shadow-hover-button rounded-lg"
            />

            {flagMaterialReturn?.length > 0 && (
                <ExcelFileComponent
                    dataLang={dataLang}
                    filename={"Danh sách dữ liệu thu hồi NVL"}
                    multiDataSet={multiDataSet}
                    title="DSDL Thu hồi NVL"
                >
                    <ButtonAnimationNew
                        icon={
                            <div className="3xl:size-5 size-4">
                                <PiTable className="size-full" />
                            </div>
                        }
                        title="Xuất Excel"
                        className="3xl:h-10 h-9 xl:px-4 px-2 flex items-center gap-2 xl:text-sm text-xs font-normal text-[#0375F3] border border-[#0375F3] hover:bg-[#0375F3]/5 hover:shadow-hover-button rounded-lg"
                    />
                </ExcelFileComponent>
            )}
        </div>
    );
};

export default MaterialReturnToolbar;
