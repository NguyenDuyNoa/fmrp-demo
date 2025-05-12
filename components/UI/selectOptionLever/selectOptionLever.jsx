const SelectOptionLever = ({ value, label, level, code }) => {
    const dashPrefix =
        level === 1
            ? "-- "
            : level === 2
                ? "---- "
                : level === 3
                    ? "------ "
                    : level === 4
                        ? "-------- "
                        : "";
    return (
        // <div className="flex space-x-2 text-wrap">
        //     {level == 1 && <span>--</span>}
        //     {level == 2 && <span>----</span>}
        //     {level == 3 && <span>------</span>}
        //     {level == 4 && <span>--------</span>}
        //     <span className="2xl:max-w-[300px] max-w-[150px] w-fit">{label}</span>
        // </div>
        <div className="whitespace-pre-wrap text-wrap 2xl:max-w-[300px] max-w-[150px] w-fit">
            {`${dashPrefix}${label}`}
        </div>
    );
};
export default SelectOptionLever;
