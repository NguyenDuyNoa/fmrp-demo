export const Container = ({ children }) => {
    return <div className="3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-6 3xl:pb-10 2xl:px-4 2xl:pb-8 xl:px-4 xl:pb-10 px-4 lg:pb-10 space-y-1 overflow-hidden h-screen">
        {children}
    </div>
}
export const ContainerBody = ({ children }) => {
    return <div className="grid grid-cols gap-1 h-[100%] overflow-hidden">
        {children}
    </div>
}