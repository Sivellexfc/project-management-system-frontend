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
import { getSubGroups } from "../../../services/groupServices/GetSubGroups";
import { getGroupMembers } from "../../../services/groupServices/GetGroupMembers";
import Cookies from 'js-cookie';

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "action", label: "Actions", minWidth: 170 },
];

function createData(name, startDate, group, subgroup, action) {
  return { name, startDate, group, subgroup, action };
}

export default function UserListBrief({ groupId,projectId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [users, setUsers] = React.useState(null);


  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getGroupMembers(projectId,Cookies.get("selectedCompanyId"),groupId);
      if (response.isSuccess) {
        console.log("users: "+ response);
        setUsers((prevUsers) => [...prevUsers, ...response.result]);
      }
      else {
        setError('Görevler yüklenirken bir hata oluştu.');
      }
    } catch (err) {
      setError('Görevler yüklenirken bir hata oluştu.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [groupId]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCreateSubGroup = () => {
    openModal();
  }

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
    users && Array.isArray(users)
      ? data.map((item) =>
          createData(
            item.name,
            item.startDate,
            item.group,
            item.subgroup,
            item.action
          )
        )
      : [];

  return (
    <div className="flex justify-center">
      {/* <h1 className="text-2xl font-primary font-medium my-5">Alt-gruplar</h1> */}
      {/* <div className="flex justify-end">
        <button className="px-6 py-2 bg-colorFirst border rounded-md border-borderColor ">
          Yeni Proje
        </button>
      </div> */}
      
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              <Button
                                onClick={() => handleEditClick(row)}
                                variant="outlined"
                              >
                                Düzenle
                              </Button>
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
                    {users === null
                      ? "Veriler yükleniyor..."
                      : "No Data Available"}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <button onClick={() => handleCreateSubGroup()} className="py-2 px-4 border-dashed border-2 border-borderColor rounded-lg">Oluştur</button>
                    {isModalOpen && <CreateSubGroupModal groupId={groupId} closeModal={closeModal}></CreateSubGroupModal>}
                  </TableCell>
                </TableRow>
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
