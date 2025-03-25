import { Refresh2 } from "iconsax-react";

const OnResetData = ({ sOnFetching, ...res }) => {
    const _HandleFresh = () => {
        sOnFetching(true) || sOnFetching((prev) => ({ ...prev, onFetching: true, onFetching_filter: true }));
    }

    return (
        <div {...res}>
            <button
                {...res}
                onClick={_HandleFresh}
                type="button"
                className="bg-green-50 hover:bg-green-200 hover:scale-105 group xxl:p-2.5 p-2 rounded-md transition-all ease-in-out"
            >
                <Refresh2 className="transition-all ease-in-out group-hover:-rotate-45" size={18} color="#008000" />
            </button>
        </div>
    );
};
export default OnResetData;
