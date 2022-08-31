import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
export default function Pagination({ props }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    console.log(props);
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(props.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(props.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, props]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % props.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="chicken-list">
        {currentItems.map((chicken) => {
          return (
            <div>
              <h1>{chicken.id}</h1>
            </div>
          );
        })}
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </>
  );
}
