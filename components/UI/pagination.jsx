import { ArrowLeft, ArrowRight, ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
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
            nextLabel={<ArrowRight size="22" color="blue" />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel={<ArrowLeft size="22" color="blue" />}
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

// const Index = React.memo(
//   ({ postsPerPage, totalPosts, paginate, currentPage }) => {
//     const [displayedPages, setDisplayedPages] = useState([]);

//     const pageNumbers = Math.ceil(totalPosts / postsPerPage);
//     const maxDisplayedPages = 10; // Số trang tối đa hiển thị
//     const maxVisiblePages = 5; // Số trang hiển thị trước và sau trang hiện tại

//     useEffect(() => {
//       const calculateDisplayedPages = () => {
//         const pages = [];
//         let startPage;
//         let endPage;

//         if (pageNumbers <= maxDisplayedPages) {
//           startPage = 1;
//           endPage = pageNumbers;
//         } else {
//           if (Number(currentPage) <= maxVisiblePages) {
//             startPage = 1;
//             endPage = maxDisplayedPages;
//           } else if (Number(currentPage) > pageNumbers - maxVisiblePages) {
//             startPage = pageNumbers - maxDisplayedPages + 1;
//             endPage = pageNumbers;
//           } else {
//             startPage = Number(currentPage) - Math.floor(maxDisplayedPages / 2);
//             endPage =
//               Number(currentPage) + Math.ceil(maxDisplayedPages / 2) - 1;
//           }
//         }

//         for (let i = startPage; i <= endPage; i++) {
//           pages.push(i);
//         }

//         setDisplayedPages(pages);
//       };

//       calculateDisplayedPages();
//     }, [Number(currentPage), maxDisplayedPages, maxVisiblePages, pageNumbers]);

//     const handlePrev = () => {
//       if (Number(currentPage) > 1) {
//         paginate(Number(currentPage) - 1);
//       }
//     };

//     const handleNext = () => {
//       if (Number(currentPage) < pageNumbers) {
//         paginate(Number(currentPage) + 1);
//       }
//     };

//     const handleFirstPage = () => {
//       paginate(1);
//     };

//     const handleLastPage = () => {
//       paginate(pageNumbers);
//     };

//     return (
//       <div>
//         <ul className="flex space-x-1">
//           {Number(currentPage) > 1 && (
//             <a
//               onClick={handlePrev}
//               className="bg-slate-200 hover:bg-[#e3e3e3] cursor-pointer w-8 h-8 flex flex-col justify-center items-center font-[600] rounded-md"
//             >
//               <ArrowLeft size="22" color="blue" />
//             </a>
//           )}

//           {Number(currentPage) > maxVisiblePages + 1 && (
//             <a
//               onClick={handleFirstPage}
//               className="bg-slate-200 hover:bg-[#e3e3e3] cursor-pointer w-8 h-8 flex flex-col justify-center items-center font-[600] rounded-md"
//             >
//               1
//             </a>
//           )}

//           {Number(currentPage) > maxVisiblePages + 2 && (
//             <a className="bg-slate-200 hover:bg-[#e3e3e3] cursor-pointer w-8 h-8 flex flex-col justify-center items-center font-[600] rounded-md">
//               ...
//             </a>
//           )}

//           {displayedPages.map((number) => (
//             <a
//               key={number}
//               onClick={() => paginate(number)}
//               className={`${Number(currentPage) === number
//                 ? "bg-[#0F4F9E] text-white"
//                 : "bg-slate-200 hover:bg-[#e3e3e3]"
//                 } cursor-pointer w-8 h-8 flex flex-col justify-center items-center font-[600] rounded-md transition duration-200 ease-in-out`}
//             >
//               {number}
//             </a>
//           ))}

//           {Number(currentPage) < pageNumbers - maxVisiblePages - 1 && (
//             <a className="bg-slate-200 hover:bg-[#e3e3e3] cursor-pointer w-8 h-8 flex flex-col justify-center items-center font-[600] rounded-md">
//               ...
//             </a>
//           )}

//           {Number(currentPage) < pageNumbers - maxVisiblePages && (
//             <a
//               onClick={handleLastPage}
//               className="bg-slate-200 hover:bg-[#e3e3e3] cursor-pointer w-8 h-8 flex flex-col justify-center items-center font-[600] rounded-md"
//             >
//               {pageNumbers}
//             </a>
//           )}

//           {Number(currentPage) < pageNumbers && (
//             <a
//               onClick={handleNext}
//               className="bg-slate-200 hover:bg-[#e3e3e3] cursor-pointer w-8 h-8 flex flex-col justify-center items-center font-[600] rounded-md"
//             >
//               <ArrowRight size="22" color="blue" />
//             </a>
//           )}
//         </ul>
//       </div>
//     );
//   }
// );

export default Index;
