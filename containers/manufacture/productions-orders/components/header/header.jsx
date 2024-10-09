const Header = ({ dataLang }) => {
    return (
        <>
            <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                <h6 className="text-[#141522]/40">{dataLang?.materials_planning_manufacture || "materials_planning_manufacture"}</h6>
                <span className="text-[#141522]/40">/</span>
                <h6>{dataLang?.productions_orders || 'productions_orders'}</h6>
            </div>
            <div className="flex justify-between items-center">
                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                    {dataLang?.productions_orders || 'productions_orders'}
                </h2>
            </div>
        </>
    );
};
export default Header;
