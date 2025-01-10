import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

interface Props {
  columns: any[];
  data: any[];
  dataLength: number;
  itemsPerPage?: number;
  handlePageChange?: (page: number) => void;
  handleRowsPerPageChange?: (rowsPerPage: number) => void;
  loading?: boolean;
}

// Define custom styles
const customStyles: any = {
  header: {
    style: {
      backgroundColor: "#808080",
      color: "#fff",
      fontSize: "18px",
      fontWeight: "bold",
      textAlign: "center",
    },
  },
  rows: {
    style: {
      minHeight: "56px", // override the row height
      maxWidth: "auto",
    },
  },
  headCells: {
    style: {
      padding: "10px",
      backgroundColor: "#808080",
      color: "white",
      fontWeight: "600",
      textAlign: "center",
    },
  },
  cells: {
    style: {
      padding: "10px",
    },
  },
};

const Table = ({ columns, data, handlePageChange, handleRowsPerPageChange, itemsPerPage, dataLength, loading }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShow(true);
    }
  }, []);
  return (
    <div className="p-4">
      {show && (
        <DataTable
          columns={columns}
          data={data}
          customStyles={customStyles} // Apply custom styles
          pagination
          paginationServer
          paginationDefaultPage={1}
          paginationTotalRows={dataLength}
          paginationPerPage={itemsPerPage}
          paginationRowsPerPageOptions={[10, 20, 50]}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          progressPending={loading}
          highlightOnHover
          pointerOnHover
          responsive
          striped
        />
      )}
    </div>
  );
};

export default Table;
