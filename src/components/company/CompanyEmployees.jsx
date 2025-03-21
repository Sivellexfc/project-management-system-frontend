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

const columns = [
  { id: "avatar", label: "Avatar", minWidth: 100 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  { id: "startDate", label: "Start Date", minWidth: 170 },
  { id: "group", label: "Group", minWidth: 170 },
  { id: "subgroup", label: "Sub-group", minWidth: 170 },
  { id: "action", label: "Actions", minWidth: 170, align:"center" },
];


export default function CompanyEmployees() {

  const [datas, setDatas] = React.useState("");
  const [selectedUserId, setSelectedUserId] = React.useState("");

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
  }

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
      <Paper sx={{ width: "100%", overflow: "hidden",border: "1px solid #EEEEEE" }} elevation={0}>
        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                    align="center"
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody sx={{border: "1px solid #EEEEEE"}}>
              {datas.length > 0 ? (
                datas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "action" ? (
                            <div className="space-x-2 flex justify-center">
                            {/* Düzenle Butonu */}
                            <Button
                              onClick={() => handleEditClick(row)}
                              variant="outlined"
                              sx={{
                                font:"light",
                                minWidth: "auto",
                                height: "28px",
                                padding: "2px 8px",
                                fontSize: "0.8rem",
                                borderColor: "#eeeeee",
                                color: "gray",
                                "&:hover": {
                                  borderColor: "darkgray",
                                  color: "darkgray",
                                },
                              }}
                            >
                              Düzenle
                            </Button>

                            {/* Çöp Kutusu Butonu */}
                            <Button
                              onClick={() => {handleRemoveMember(row.id)}}
                              variant="text" // Border'ı kaldır
                              sx={{
                                minWidth: "auto",
                                height: "28px",
                                padding: "2px 8px",
                                color: "black", // Rengi siyah yap
                                border: "none", // Border tamamen kaldırıldı
                              }}
                            >
                              <BiTrash size={22} />
                            </Button>



                            {/* Ok Butonu */}
                            <Button
                              onClick={() => handleRemoveMember(row.id)}
                              className="ml-100 h-7 text-black"
                            >
                              <MdOutlineKeyboardArrowDown
                                className="w-6 h-6"
                                style={{ color: "black" }}
                              />
                            </Button>
                            
                          </div>
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
      {isRemoveMemberModalOpen && <RemoveUser userId={selectedUserId} closeRemoveMemberModal={closeRemoveMemberModal}></RemoveUser>}
    </div>
  );
}
