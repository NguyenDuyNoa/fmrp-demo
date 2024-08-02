import MoreSelectedBadge from "./moreSelectedBadge";
import { components } from "react-select";
const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = props?.selectProps?.maxShowMuti == 0 ? 0 : props?.selectProps?.maxShowMuti || 2

    const overflow = getValue().slice(maxToShow).map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};
export default MultiValue;
