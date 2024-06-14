import { ArrowLeft, ArrowRight } from "iconsax-react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const Index = React.memo(({ postsPerPage, paginate, totalPosts, currentPage }) => {
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        setPageCount(Math.ceil(totalPosts / (+postsPerPage || 25)));
    }, [postsPerPage, totalPosts]);

    const handlePageClick = (event) => {
        paginate(event.selected + 1);
    };

    return (
        <ReactPaginate
            nextLabel={
                <>
                    <ArrowRight size="18" color="blue" />
                </>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel={
                <>
                    <ArrowLeft size="18" color="blue" />
                </>
            }
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
            forcePage={currentPage - 1}
        />
    );
});
export default Index;
