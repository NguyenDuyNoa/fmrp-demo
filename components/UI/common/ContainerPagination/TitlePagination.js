const TitlePagination = ({ dataLang, totalItems }) => {

    return (
        <h6 className="">
            {dataLang?.display} {totalItems} {dataLang?.ingredient}
        </h6>
    )
}
export default TitlePagination