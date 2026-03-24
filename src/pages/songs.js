"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import Table from "../../components/table";
import { Api } from "@/services/service";
import { useRouter } from "next/navigation";
import { DeleteModel } from "../../components/DeleteModel";
import Createsong from "../../components/AddSong";

function songPage(props) {
  const router = useRouter();

  const [allsong, setAllSong] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openAddSong, setOpenAddSong] = useState(false);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const fetchsong = (page = 1) => {
    props.loader?.(true);

    Api("get", "music/getAllMusic", "", router)
      .then((res) => {
        props.loader?.(false);

        if (res?.status) {
          setAllSong(res.data || []);
        }
      })
      .catch(() => props.loader?.(false));
  };

  useEffect(() => {
    fetchsong(currentPage);
  }, [currentPage]);

  const renderImage = ({ row }) => (
    <div className="flex justify-center">
      <img
        src={row.original.image || "/placeholder.png"}
        alt="song"
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

  const musicRender = ({ value }) => (
    <div className="flex justify-center">
      {value ? (
        <audio controls>
          <source src={value} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p className="text-sm text-gray-500">No music file</p>
      )}
    </div>
  );

  const renderActions = ({ row }) => (
    <div className="flex justify-center gap-2">
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          setEditId(row.original._id);
          setEditData(row.original);
          setOpenAddSong(true);
        }}
      >
        <Edit size={16} className="text-gray-700" />
      </button>

      <button
        className="p-2 bg-gray-100 rounded hover:bg-red-100 cursor-pointer"
        onClick={() => setConfirmOpen(true) || setDeleteId(row.original._id)}
      >
        <Trash2 size={16} className="text-red-500" />
      </button>
    </div>
  );

  const handleDelete = (id) => {
    props.loader?.(true);

    Api("delete", `music/deleteMusic/${id}`, { id }, router)
      .then((res) => {
        props.loader?.(false);

        if (res?.status) {
          props.toaster?.({
            type: "success",
            message: "song deleted successfully",
          });
          setConfirmOpen(false);
          fetchsong(currentPage);
        }
      })
      .catch(() => props.loader?.(false));
  };

  const columns = useMemo(
    () => [
      { Header: "Image", accessor: "image", Cell: renderImage },
      { Header: "song Name", accessor: "name", Cell: renderName },
      { Header: "Price", accessor: "price", Cell: renderPrice },
      {
        Header: "Song",
        accessor: "music",
        Cell: musicRender,
      },
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-white">Songs</h1>

          <button
            onClick={() => setOpenAddSong(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg shadow cursor-pointer"
          >
            <Plus size={18} />
            Add songs
          </button>
        </div>

        <div className="bg-white  shadow border overflow-hidden">
          {allsong.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-[650px]">
              <img
                src="/empty-box.png"
                alt="No data"
                className="w-28 mb-3 opacity-60"
              />
              <h2 className="text-gray-500">No song Found</h2>
              <p className="text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <Table
              columns={columns}
              data={allsong}
              pagination={pagination}
              currentPage={currentPage}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </div>

      <DeleteModel
        isOpen={confirmOpen}
        setIsOpen={setConfirmOpen}
        title="Delete Song"
        message={`Are you sure you want to delete this song?`}
        onConfirm={() => handleDelete(deleteId)}
        yesText="Yes, Delete"
        noText="Cancel"
      />

      {openAddSong && (
        <Createsong
          loader={props.loader}
          fetchSong={fetchsong}
          setOpenAddSong={setOpenAddSong}
          setEditId={setEditId}
          editData={editData}
          setEditData={setEditData}
          editId={editId}
        />
      )}
    </section>
  );
}

export default songPage;
