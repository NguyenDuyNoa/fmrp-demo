export const Customscrollbar = (props) => {
    return (
        <div className={`${props.className ?
            props.className :
            "min:h-[200px] 3xl:h-[83%] xxl:h-[74%] 2xl:h-[76%] xl:h-[72%] lg:h-[82%] max:h-[400px] pb-2"}
             overflow-x-hidden overflow-y-auto
            scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100`}>
            {props.children}
        </div>
    )
}