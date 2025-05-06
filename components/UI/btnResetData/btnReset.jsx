import RefreshIcon from "@/components/icons/common/Refresh";

const OnResetData = ({ sOnFetching, ...res }) => {
  const _HandleFresh = () => {
    sOnFetching(true) ||
      sOnFetching((prev) => ({
        ...prev,
        onFetching: true,
        onFetching_filter: true,
      }));
  };

  return (
    <div {...res}>
      <button
        {...res}
        onClick={_HandleFresh}
        type="button"
        className="bg-white hover:bg-green-50 group py-3 px-4 rounded-md transition-all ease-in-out flex items-center gap-2 border border-green-01"
      >
        <RefreshIcon
          className="transition-all ease-in-out group-hover:-rotate-45 size-5"
          color="#008000"
        />
        <span className="text-green-01 text-sm font-normal whitespace-nowrap">
          Tải lại
        </span>
      </button>
    </div>
  );
};
export default OnResetData;
