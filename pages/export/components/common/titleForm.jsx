const TitleForm = ({ title }) => {
    return (
        <>
            <h1 className="p-2 my-1 shadow font-semibold text-zinc-600  rounded text-center 3xl:text-[14px] xxl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px]">
                {title}
            </h1>
        </>
    );
};
export default TitleForm;
