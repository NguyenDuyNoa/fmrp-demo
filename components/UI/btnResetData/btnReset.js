import { Refresh2 } from "iconsax-react";

const OnResetData = ({ sOnFetching }) => {
    const _HandleFresh = () =>
        sOnFetching(true) || sOnFetching((prev) => ({ ...prev, onFetching: true, onFetching_filter: true }));
    return (
        <div>
            <button
                onClick={_HandleFresh}
                type="button"
                className="bg-green-50 hover:bg-green-200 hover:scale-105 group p-2 rounded-md transition-all ease-in-out"
            >
                <Refresh2 className="group-hover:-rotate-45 transition-all ease-in-out" size="22" color="green" />
            </button>
        </div>
    );
};
export default OnResetData;
