const ContainerPagination = ({ className, children }) => {
    return (
        <div className={`${className} flex space-x-5 items-center my-2 3xl:text-[18px] 2xl:text-[16px] xl:text-[14px] lg:text-[14px]`}>
            {children}
        </div>
    )
}
export default ContainerPagination