import { TbFileReport } from "react-icons/tb"

const TitleHeader = (props) => {
    return <div className="flex items-center mt-1 mr-2 gap-2">
        <TbFileReport size={20} className='text-[#52575E]' />
        <h2 className=" 2xl:text-lg text-base text-[#52575E] capitalize">
            {props.title}
        </h2>
    </div>
}
export default TitleHeader