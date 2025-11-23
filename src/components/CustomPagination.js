// import { Pagination, TablePagination } from "@mui/material";
// import React, { useState } from "react";

// const EmptyActions = () => null;

// const CustomPagination = ({ total, onPageChange }) => {
//     const [page, setPage] = useState(1); // Pagination (1-based)
//     const [rowsPerPage, setRowsPerPage] = useState(10);

//     // Handle "All" case
//     const effectiveRowsPerPage = rowsPerPage === -1 ? total : rowsPerPage;

//     // Total pages
//     const pageCount = Math.ceil(total / effectiveRowsPerPage);

//     const handlePageChange = (event, newPage) => {
//         setPage(newPage);
//         onPageChange(newPage, effectiveRowsPerPage);
//     };

//     const handleRowsPerPageChange = (event) => {
//         const newRowsPerPage = parseInt(event.target.value, 10);
//         setRowsPerPage(newRowsPerPage);
//         setPage(1); // Reset to first page
//         onPageChange(1, newRowsPerPage === -1 ? total : newRowsPerPage);
//     };

//     return (
//         <div className="col-lg-12 d-flex align-items-center justify-content-center custom-pagination">
//             {/* Pagination Buttons */}
//             <Pagination
//                 count={pageCount}
//                 page={page}
//                 onChange={handlePageChange}
//                 color="primary"
//                 sx={{
//                     "& .Mui-selected": {
//                         backgroundColor: "#e8671e !important",
//                         color: "#fff",
//                     },
//                 }}
//             />

//             {/* Rows per page dropdown */}
//             <TablePagination
//                 className="row-per-page-pagination"
//                 rowsPerPageOptions={[10, 25, 50, { label: "All", value: -1 }]}
//                 component="div"
//                 count={total}
//                 rowsPerPage={rowsPerPage}
//                 page={page - 1} // TablePagination is 0-based
//                 onPageChange={(e, newPage) => handlePageChange(e, newPage + 1)}
//                 onRowsPerPageChange={handleRowsPerPageChange}
//                 ActionsComponent={EmptyActions}
//                 labelDisplayedRows={({ from, to, count }) => (
//                     <div className="mt-3">
//                       {`${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`}
//                     </div>
//                   )}
//             />
//         </div>
//     );
// };

// export default CustomPagination;
















import { Pagination, TablePagination } from "@mui/material";
import React, { useState, useEffect } from "react";

const EmptyActions = () => null;

const CustomPagination = ({ total, onPageChange, resetPage }) => {
  const [page, setPage] = useState(1); // 1-based
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handle "All" case
  const effectiveRowsPerPage = rowsPerPage === -1 ? total : rowsPerPage;

  // Total pages
  const pageCount = Math.ceil(total / effectiveRowsPerPage);

  // 🔄 Adjust page if total decreases (after delete)
  useEffect(() => {
    if ((page - 1) * effectiveRowsPerPage >= total && page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      onPageChange(newPage, effectiveRowsPerPage);
    }
  }, [total, effectiveRowsPerPage, page, onPageChange]);

  // 🔄 Reset page to 1 if parent triggers reset (e.g., filter applied)
  useEffect(() => {
    if (resetPage) {
      setPage(1);
      onPageChange(1, effectiveRowsPerPage);
    }
  }, [resetPage]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    onPageChange(newPage, effectiveRowsPerPage);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page
    onPageChange(1, newRowsPerPage === -1 ? total : newRowsPerPage);
  };

  return (
    <div className="col-lg-12 flex-column flex-md-row d-flex align-items-center justify-content-center custom-pagination">
      <Pagination
        count={pageCount}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{
          "& .Mui-selected": {
            backgroundColor: "#0CB9B8",
            color: "#fff",
          },
        }}
      />

      <TablePagination
        className="row-per-page-pagination"
        rowsPerPageOptions={[10, 25, 50, { label: "All", value: -1 }]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page - 1} // 0-based
        onPageChange={(e, newPage) => handlePageChange(e, newPage + 1)}
        onRowsPerPageChange={handleRowsPerPageChange}
        ActionsComponent={EmptyActions}
        labelDisplayedRows={({ from, to, count }) => (
          <div className="mt-3">
            {`${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`}
          </div>
        )}
      />
    </div>
  );
};

export default CustomPagination;




