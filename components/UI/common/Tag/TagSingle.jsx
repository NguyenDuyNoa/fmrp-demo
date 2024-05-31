export const TagSingle = ({ name, className }) => {
    console.log("name", name);
    return <h3 className={`${className} 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px]  text-center font-medium text-lime-500  rounded-xl py-1 px-3 max-w-[100px] min-w-[70px]  bg-lime-200 `}>
        {name}
    </h3>
}