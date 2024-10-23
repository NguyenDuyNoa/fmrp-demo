const Progress = ({ multipleProgress }) => {
    {
        return (
            <div className="w-full bg-sky-100 rounded-lg dark:bg-gray-700">
                <div
                    className="bg-sky-500 transition-all duration-1000 ease-linear text-[11px] font-medium text-sky-100 text-center leading-none rounded-lg"
                    style={{
                        width: multipleProgress + "%",
                    }}
                >
                    {multipleProgress + "%"}
                </div>
            </div>
        );
    }
};
export default Progress;
