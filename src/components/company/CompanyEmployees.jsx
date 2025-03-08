import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import AddEmployee from "./components/InviteUser";
import { fetchData } from "../../services/companyServices/GetCompanyEmployees";
import KanbanCardLabel from "../Kanban/KanbanCardLabel";

const columns = [
  { id: "avatar", label: "Avatar", minWidth: 100 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  { id: "startDate", label: "Start Date", minWidth: 170 },
  { id: "group", label: "Group", minWidth: 170 },
  { id: "subgroup", label: "Sub-group", minWidth: 170 },
  { id: "action", label: "Actions", minWidth: 170 },
];

const datas = [
  {
    avatar:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    name: "Musluhan Çavuş",
    startDate: "09-10-2025",
    group: "Developer",
    subgroup: "Frontend Developer",
    action: "Düzenle",
  },
];

export default function CompanyEmployees() {

  const [datas, setDatas] = React.useState("");

  useEffect(() => {
      const getData = async () => {
        console.log("başlıyor ,")
        try {
          const result = await fetchData("3"); // Backend'den veri çekme

          console.log(result)
          console.log("data : ", datas)


          setDatas(result.result);
        } catch (error) {
          console.error("Veri çekme başarısız:", error);
        }
      };
      getData();
    }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (row) => {
    console.log("Editing", row);
  };

  return (
    <div>
      <h1 className="text-2xl font-primary font-medium my-5">Üyeler</h1>
      <div className="flex justify-end">
        <button
          onClick={openModal}
          className="px-6 py-2 bg-colorFirst border rounded-md border-borderColor"
        >
          Yeni Üye
        </button>
        {isModalOpen && <AddEmployee closeModal={closeModal} />}
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {datas.length > 0 ? (
                datas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.id === "action" ? (
                            <Button
                              onClick={() => handleEditClick(row)}
                              variant="outlined"
                            >
                              {row.action}
                            </Button>
                          ) : column.id === "avatar" ? (
                            <img
                              src={row.avatar}
                              alt="Avatar"
                              className="w-10 h-10 rounded-full"
                            />
                          ) : column.id === "name" ? (
                            <span className="font-semibold">{row.firstName +" "+ row.lastName}</span>
                          ) : column.id === "subgroup" ? (
                            <KanbanCardLabel
                              text={row.subgroup}
                              color="#27C356"
                            ></KanbanCardLabel>
                          ) : (
                            <span className="font-light">{row[column.id]}</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No Data Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={datas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
