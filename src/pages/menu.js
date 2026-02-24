"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import Table from "../../components/table";
import { Api } from "@/services/service";
import { useRouter } from "next/navigation";
import { DeleteModel } from "../../components/DeleteModel";
import CreateMenu from "../../components/AddMenu";
import { toast } from "react-toastify";

function MenuPage(props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [allMenu, setAllMenu] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [openAddMenu, setOpenAddMenu] = useState(false);
  const fetchMenu = (page = 1) => {
    props.loader?.(true);

    Api("get", "menu/getAllMenu", "", router)
      .then((res) => {
        props.loader?.(false);

        if (res?.status) {
          setAllMenu(res.data || []);
        }
      })
      .catch(() => props.loader?.(false));
  };

  useEffect(() => {
    fetchMenu(currentPage);
  }, [currentPage]);

  const renderImage = ({ row }) => (
    <div className="flex justify-center">
      <img
        src={row.original.image || "/placeholder.png"}
        alt="menu"
        className="w-12 h-12 object-contain"
      />
    </div>
  );

  const renderName = ({ value }) => (
    <div className="text-center font-medium text-gray-800">{value}</div>
  );

  const renderPrice = ({ value }) => (
    <div className="text-center text-gray-700">${value}</div>
  );

  const renderVideoTime = ({ value }) => (
    <div className="text-center text-gray-600">{value} Minutes</div>
  );

  // Actions
  const renderActions = ({ row }) => (
    <div className="flex justify-center gap-2">
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200"
        onClick={() => {
          setEditId(row.original._id);
          setEditData(row.original);
          setOpenAddMenu(true);
        }}
      >
        <Edit size={16} className="text-gray-700 cursor-pointer" />
      </button>

      <button
        className="p-2 bg-gray-100 rounded hover:bg-red-100"
        onClick={() => setConfirmOpen(true) || setDeleteId(row.original._id)}
      >
        <Trash2 size={16} className="text-red-500 cursor-pointer" />
      </button>
    </div>
  );

  const handleDelete = (id) => {
    props.loader?.(true);

    Api("delete", `menu/deleteMenu/${id}`, " ", router)
      .then((res) => {
        props.loader?.(false);

        if (res?.status) {
          toast.success("Menu deleted successfully");
          fetchMenu(currentPage);
          setConfirmOpen(false);
        }
      })
      .catch(() => props.loader?.(false));
  };

  const columns = useMemo(
    () => [
      { Header: "Image", accessor: "image", Cell: renderImage },
      { Header: "Menu Name", accessor: "name", Cell: renderName },
      { Header: "Price", accessor: "price", Cell: renderPrice },
      {
        Header: "Video Call Time",
        accessor: "time",
        Cell: renderVideoTime,
      },
      { Header: "Action", Cell: renderActions },
    ],
    [],
  );

  return (
    <section className="bg-secondary min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-white">Menu</h1>

          <button
            onClick={() => setOpenAddMenu(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg shadow cursor-pointer"
          >
            <Plus size={18} />
            Add Menu
          </button>
        </div>

        {/* Table */}
        <div className="bg-white  shadow border overflow-hidden">
          {allMenu.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-[650px]">
              <img
                src="/empty-box.png"
                alt="No data"
                className="w-28 mb-3 opacity-60"
              />
              <h2 className="text-gray-500">No Menu Found</h2>
              <p className="text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <Table
              columns={columns}
              data={allMenu}
              pagination={pagination}
              currentPage={currentPage}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>

        <DeleteModel
          isOpen={confirmOpen}
          setIsOpen={setConfirmOpen}
          title="Delete menu"
          message={`Are you sure you want to delete this menu?`}
          onConfirm={() => handleDelete(deleteId)}
          yesText="Yes, Delete"
          noText="Cancel"
        />

        {openAddMenu && (
          <CreateMenu
            loader={props.loader}
            fetchMenu={fetchMenu}
            editId={editId}
            setOpenAddMenu={setOpenAddMenu}
            setEditId={setEditId}
            editData={editData}
          />
        )}
      </div>
    </section>
  );
}

export default MenuPage;
