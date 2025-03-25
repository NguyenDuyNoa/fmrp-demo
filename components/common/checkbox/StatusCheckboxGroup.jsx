import { motion } from "framer-motion";
import CheckIcon from "@/components/icons/common/CheckIcon"; // Điều chỉnh path nếu cần

const StatusCheckboxGroup = ({ list = [], selected = [], onChange = () => { } }) => {
    return (
        <div className="flex flex-col">
            {list.map((item, index) => {
                const isChecked = selected.includes(item.value);
                const isFirst = index === 0;
                const isLast = index === list.length - 1;

                const borderClass = isLast
                    ? "border-transparent rounded-b-lg border-t-transparent"
                    : isFirst
                        ? "rounded-t-lg border-t-transparent"
                        : "border-t-transparent";

                return (
                    <label
                        key={item.value}
                        className={`hover:bg-[#F3F4F6] border-b border-[#F7F8F9] border-t flex items-center gap-3 cursor-pointer px-4 py-3 custom-transition ${borderClass}`}
                    >
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onChange(item.value)}
                            className="peer hidden"
                        />
                        <div className="w-4 h-4 rounded border border-[#D0D5DD] flex items-center justify-center peer-checked:text-white peer-checked:bg-[#1760B9] peer-checked:border-[#1760B9]">
                            <motion.span
                                className={`${isChecked ? "text-white" : "text-transparent"} size-3 `}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <CheckIcon className="size-full" />
                            </motion.span>
                        </div>
                        <span className={`3xl:text-sm text-xs font-normal px-2 py-1 rounded ${item.color}`}>
                            {item.label}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};

export default StatusCheckboxGroup;
