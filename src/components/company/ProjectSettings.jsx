import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect } from "react";
import CreateNewProject from "./components/CreateNewProjectModal";
import EditProjectModal from "./components/EditProjectModal";
import { useState } from "react";
import { fetchData } from "../../services/projectServices/GetProjects";
import Cookies from "js-cookie";
import { BiPen } from "react-icons/bi";
import { FaPen } from "react-icons/fa";

const columns = [
  { id: "photo", label: "", minWidth: 0 },
  { id: "name", label: "Name", minWidth: 150 },
  { id: "description", label: "Description", minWidth: 150 },
  { id: "projectStatus", label: "Status", minWidth: 150 },
  { id: "startDate", label: "Start Date", minWidth: 150 },
  { id: "endDate", label: "End Date", minWidth: 150 },
  { id: "action", label: "Actions", minWidth: 150, align: "center" },
];

function createData(id,name, description,projectStatus,startDate,endDate,  action,photo) {
  return {id,name,description,projectStatus, startDate,endDate, action, photo };
}

export default function ProjectSettings() {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openEditModal = (project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(Cookies.get("selectedCompanyId")); // Backend'den veri çekme
        console.log("result ::::: ",result);
        setData(result.result);
        console.log(result);
      } catch (error) {
        console.error("Veri çekme başarısız:", error);
      }
    };

    getData();
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (row) => {
    openEditModal(row);
  };

  // Verinin null veya undefined olup olmadığını kontrol ediyoruz
  const rows =
    data && Array.isArray(data)
      ? data.map((item) =>
          createData(
            item.id,
            item.name,
            item.description,
            item.projectStatus,
            item.startDate,
            item.endDate,
            item.action,
            item.photo
          )
        )
      : [];

  return (
    <div>
      {/* <h1 className="text-2xl font-primary font-medium my-5">Projeler</h1> */}
      <div className="flex justify-end">
        <button
          onClick={openModal}
          className="px-6 py-2 bg-colorFirst border rounded-md border-borderColor "
        >
          Yeni Proje
        </button>
        {isModalOpen && (
          <CreateNewProject closeModal={closeModal}></CreateNewProject>
        )}
        {isEditModalOpen && selectedProject && (
          <EditProjectModal
            closeModal={closeEditModal}
            project={selectedProject}
          />
        )}
      </div>
      <Paper
        sx={{ width: "100%", overflow: "hidden", border: "1px solid #EEEEEE" }}
        elevation={0}
      >
        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Eğer veri varsa, verileri göster, yoksa boş tablo */}
              {rows.length > 0 ? (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={
                            column.id === "photo"
                              ? { width: 60, padding: "0 8px" }
                              : { minWidth: column.minWidth }
                          }>
                            {column.id === "action" ? (
                              <button
                                onClick={() => handleEditClick(row)}
                                className="p-2  bg-borderColor text-primary rounded-lg hover:bg-gray-200"
                              >
                                <FaPen></FaPen>
                              </button>
                            ) : column.id === "photo" ? (
                              <img
                                src={value}
                                alt="Avatar"
                                className="border border-borderColor"
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "15%",
                                }}
                              />
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    {data === null
                      ? "Veriler yükleniyor..."
                      : "No Data Available"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
