import React from 'react';

const Index = React.memo(({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
      pageNumbers.push(i);
    }
    
      if(totalPosts <= postsPerPage){
        return null
      }

      return (
        <div>
          <ul className='flex space-x-1'>
            {pageNumbers.map(number => (
              <a key={number} onClick={() => paginate(number)} className={`${currentPage == number ? "bg-[#0F4F9E] text-white" : "bg-slate-200 hover:bg-[#e3e3e3]"} cursor-pointer w-8 h-8 flex flex-col justify-center items-center font-[600] rounded-md`}>
                {number}
              </a>
            ))}
          </ul>
        </div>
      );
});

export default Index;