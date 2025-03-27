import React, { useRef } from "react"
import { motion } from "framer-motion"
import { useAutoActiveTabWithUnderline } from "@/hooks/custom/tab/useAutoActiveTabWithUnderline"
import { ContainerFilterTab } from "@/components/UI/common/layout"

const TabSwitcherWithUnderline = ({ className, tabs = [], activeTab, onChange, renderLabel }) => {
    const { underlineProps, tabListRefs } = useAutoActiveTabWithUnderline({
        tabs,
        activeTab,
        onAutoActive: onChange,
    })

    return (
        <ContainerFilterTab className='relative w-full pb-2'>
            <div className={`${className} relative flex border-b border-[#D0D5DD] w-full`}>
                {
                    tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            ref={(el) => (tabListRefs.current[index] = el)}
                            onClick={() => onChange(tab)}
                            className="group relative px-4 py-2 3xl:text-base text-sm font-normal outline-none focus:outline-none min-w-fit"
                            style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                            {
                                renderLabel ? renderLabel(tab, activeTab) : (
                                    <span className={`${activeTab?.id === tab.id ? "text-[#0375F3]" : "text-[#9295A4]"} group-hover:text-[#0375F3] transition-all duration-200 ease-linear`}>
                                        <span>
                                            {tab.name}
                                        </span>

                                        {
                                            tab.count > 0 && (
                                                <span className="absolute top-0 right-0 translate-x-1/2 h-[16px] w-[16px] text-[11px] bg-[#9295A4] text-white rounded-full flex items-center justify-center">
                                                    {tab.count}
                                                </span>
                                            )
                                        }
                                    </span>
                                )
                            }
                        </button>
                    ))
                }

                {/* underline */}
                {
                    activeTab && activeTab?.id &&
                    <motion.div
                        layout
                        className="!ml-0 absolute -bottom-[1px] h-[2px] bg-[#0375F3]"
                        animate={{ left: underlineProps.left, width: underlineProps.width }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                }
            </div>
        </ContainerFilterTab>
    )
}

export default TabSwitcherWithUnderline
