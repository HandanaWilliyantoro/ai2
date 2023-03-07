import React from 'react'

const SearchPagination = ({
    totalPage,
    currPage,
    setCurrPage,
    paginationRef
}) => {
  return (
    <div class="flex justify-center">
        <nav aria-label="Page navigation example">
            <ul ref={paginationRef} class="list-style-none flex mt-4">

                <li onClick={() => setCurrPage(currPage === 1 ? currPage : currPage - 1)}>
                    <a
                        class="relative block cursor-pointer rounded bg-transparent py-1.5 px-3 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                        aria-label="Previous"
                    >
                    <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>

                {totalPage && [...Array(totalPage)].map((e, i) => {
                    return <li onClick={() => setCurrPage(i+1)}>
                        <a class={`relative block cursor-pointer rounded bg-transparent py-1.5 px-3 text-sm text-neutral-600 transition-all duration-300 ${currPage === i+1 ? 'opacity-100 font-bold' : 'opacity-50'} hover:bg-neutral-100 hover:opacity-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white`}>
                            {i+1}
                        </a>
                    </li>
                })}
                
                <li onClick={() => setCurrPage(currPage === totalPage ? currPage : currPage + 1)}>
                    <a
                        class="relative block cursor-pointer rounded bg-transparent py-1.5 px-3 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                        href="#"
                        aria-label="Next"
                    ><span 
                        aria-hidden="true"
                    >
                        &raquo;
                    </span>
                    </a>
                </li>

            </ul>
        </nav>
    </div>
  )
}

export default SearchPagination