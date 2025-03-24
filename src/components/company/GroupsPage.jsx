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
import { useEffect } from "react";
import { useState } from "react";
import AddGroup from "./components/AddGroup";
import { fetchData } from "../../services/groupServices/GetCompanyGroups";
import { BiArrowToBottom, BiEdit, BiTrash } from "react-icons/bi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import SubGroupsPage from "./SubGroupsPage";
import UserListBrief from "./components/UsersListBrief";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },

  { id: "action", label: "Actions", minWidth: 170, align: "center" },
];

function createData(id, name, startDate, group, subgroup, action) {
  return { id, name, startDate, group, subgroup, action };
}

export default function GroupsPage() {
  const { projectId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal'ı açıp kapatma state'i
  const [selectedGroup, setSelectedGroup] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [data, setData] = React.useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(Cookies.get("selectedCompanyId")); // Backend'den veri çekme
        console.log(result);
        console.log("data : ", data);
        setData(result);
      } catch (error) {
        console.error("Veri çekme başarısız:", error);
      }
    };
    getData();
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const handleGroupClick = (groupId) => {
    setSelectedGroup(groupId);
    console.log("groupıd : " + groupId);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (row) => {
    // Düzenleme işlemi
    console.log("Editing", row);
  };

  // Verinin null veya undefined olup olmadığını kontrol ediyoruz
  const rows =
    data && Array.isArray(data)
      ? data.map((item) =>
          createData(
            item.id,
            item.name,
            item.startDate,
            item.group,
            item.subgroup,
            item.action
          )
        )
      : [];

  return (
    <div className="">
      {/* <h1 className="text-2xl font-primary my-5 font-medium">Gruplar</h1> */}
      <div className="flex justify-end mb-10">
        <button
          onClick={openModal}
          className="px-6 py-2 bg-colorFirst border rounded-md border-borderColor "
        >
          Yeni Üye
        </button>
        {isModalOpen && <AddGroup closeModal={closeModal}></AddGroup>}
      </div>

      <div className="flex gap-10">
        <div className="flex-2 w-full">
          {" "}
          <h1 className="font-primary text-2xl font-light">Gruplar</h1>
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              border: "1px solid #EEEEEE",
            }}
            elevation={0}
          >
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} align="center">
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ border: "1px solid #EEEEEE" }}>
                  {/* Eğer veri varsa, verileri göster, yoksa boş tablo */}
                  {rows.length > 0 ? (
                    rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow
                          sx={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedGroup === row.id ? "#f0f0f0" : "inherit",
                          }}
                          hover
                          onClick={() => handleGroupClick(row.id)} // Grup seçme işlemi
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell
                                sx={{ padding: "8px 24px" }}
                                key={column.id}
                                align={column.align}
                              >
                                {column.id === "action" ? (
                                  <div className="space-x-2 flex justify-center">
                                    {/* Düzenle Butonu */}
                                    <Button
                                      onClick={() => handleEditClick(row)}
                                      variant="outlined"
                                      sx={{
                                        font: "light",
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
                                      onClick={() => handleEditClick(row)}
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
                                      onClick={() => handleEditClick(row)}
                                      className="ml-100 h-7 text-black"
                                    >
                                      <MdOutlineKeyboardArrowDown
                                        className="w-6 h-6"
                                        style={{ color: "black" }}
                                      />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center  gap-2">
                                    <div
                                      className="w-6 h-6 rounded-full flex items-center"
                                      style={{ backgroundColor: row.color }}
                                    ></div>
                                    <span className="text-primary text-center">
                                      {value}
                                    </span>
                                  </div>
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

        <div className="flex-2 w-full">
          <h1 className="font-primary text-2xl font-light">Alt gruplar</h1>
          {selectedGroup ? (
            <SubGroupsPage groupId={selectedGroup} />
          ) : (
            <div className="h-fit flex items-center justify-center border border-borderColor rounded-sm text-gray-500">
              <span>Bir grup seçin</span>
            </div>
          )}
        </div>

        <div className="flex-2 w-full">
          <h1 className="font-primary text-2xl font-light">Çalışanlar</h1>
          {selectedGroup ? (
            <UserListBrief groupId={selectedGroup} projectId={projectId} />
          ) : (
            <div className="h-fit flex items-center justify-center border border-borderColor rounded-sm text-gray-500">
              <span>Bir grup seçin</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
