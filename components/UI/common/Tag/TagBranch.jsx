const TagBranch = (props) => {
    return (
        <div key={props?.key} {...props} className={`${props?.className} 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase`}>
            {props.children}
        </div>
    )
}
export default TagBranch