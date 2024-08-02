import MoreSelectedBadge from "./moreSelectedBadge";
import { components } from "react-select";
const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = props?.selectProps?.maxShowMuti == 0 ? 0 : props?.selectProps?.maxShowMuti || 2
        .slice(maxToShow)
        .map((x) => x.label);

    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    console.log("props", maxToShow);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};
export default MultiValue;
