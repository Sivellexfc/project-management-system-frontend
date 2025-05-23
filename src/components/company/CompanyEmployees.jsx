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
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import { alignProperty } from "@mui/material/styles/cssUtils";
import RemoveUser from "./components/RemoveUser";
import Cookies from "js-cookie";
import { FaPen } from "react-icons/fa";
import { getInitials } from "../../utils/GetInitials";
import { getRandomColor } from "../../utils/GetRandomColor";


const columns = [
  { id: "avatar", label: "", minWidth: 0, align: "center" },
  { id: "name", label: "Name", minWidth: 170, align: "left" },
  { id: "email", label: "Email", minWidth: 170, align: "left" },
  { id: "action", label: "Actions", minWidth: 170, align: "center" },
];

export default function CompanyEmployees() {
  const [datas, setDatas] = React.useState("");
  const [selectedUserId, setSelectedUserId] = React.useState("");

  

  useEffect(() => {
    const getData = async () => {
      console.log("başlıyor ,");
      try {
        const result = await fetchData(Cookies.get("selectedCompanyId")); // Backend'den veri çekme

        console.log(result);
        console.log("data : ", result);

        setDatas(result.result);
      } catch (error) {
        console.error("Veri çekme başarısız:", error);
      }
    };
    getData();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openRemoveMemberModal = () => setIsRemoveMemberModalOpen(true);
  const closeRemoveMemberModal = () => setIsRemoveMemberModalOpen(false);

  const handleRemoveMember = (userId) => {
    setSelectedUserId(userId);
    openRemoveMemberModal();
  };

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
      {/* <h1 className="text-2xl font-primary font-medium my-5">Üyeler</h1> */}
      <div className="flex justify-end">
        <button
          onClick={openModal}
          className="px-6 py-2 bg-colorFirst border rounded-md border-borderColor"
        >
          Yeni Üye
        </button>
        {isModalOpen && <AddEmployee closeModal={closeModal} />}
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
                    style={{ minWidth: column.minWidth }}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody sx={{ border: "1px solid #EEEEEE" }}>
              {datas.length > 0 ? (
                datas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={
                            column.id === "avatar"
                              ? { width: 60, padding: "0 8px",paddingLeft: 20 }
                              : { minWidth: column.minWidth }
                          }
                        >
                          {column.id === "action" ? (
                            <div className="space-x-2 flex justify-center">
                              {/* Düzenle Butonu */}
                              {/* Düzenle Butonu */}
                              <button
                                onClick={() => handleEditClick(row)}
                                className="w-8 h-8 bg-borderColor text-primary rounded-lg hover:bg-gray-200 flex items-center justify-center"
                              >
                                <FaPen size={16} />
                              </button>

                              {/* Silme Butonu */}
                              <button
                                onClick={() => handleRemoveMember(row.id)}
                                className="w-8 h-8 bg-borderColor text-primary rounded-lg hover:bg-gray-200 flex items-center justify-center"
                              >
                                <BiTrash size={16} />
                              </button>
                            </div>
                          ) : column.id === "avatar" ? (
                            <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                              row.id
                            )}`}
                            title={`${row.firstName} ${row.lastName}`}
                          >
                            {getInitials(row.firstName, row.lastName)}
                          </div>
                          ) : column.id === "name" ? (
                            <span className="font-semibold">
                              {row.firstName + " " + row.lastName}
                            </span>
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
      {isRemoveMemberModalOpen && (
        <RemoveUser
          userId={selectedUserId}
          closeRemoveMemberModal={closeRemoveMemberModal}
        ></RemoveUser>
      )}
    </div>
  );
}
