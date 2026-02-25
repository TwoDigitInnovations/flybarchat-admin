"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  Filter,
  Search,
  X,
  FilterIcon,
} from "lucide-react";
import moment from "moment";
import Table from "../../components/table";
import UserModel from "../../components/UserModel";
import { Api } from "@/services/service";
import { useRouter } from "next/navigation";

function UserManagement(props) {
  const router = useRouter();

  const [allUser, setAllUser] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useState({
    name: "",
    email: "",
  });

  const [selectedDate, setSelectedDate] = useState("");

  const fetchUsers = (page = 1, customParams = null) => {
    props.loader?.(true);

    const params = {
      page,
      limit: pagination.itemsPerPage,
      key: customParams?.name ?? searchParams.name,
      email: customParams?.email ?? searchParams.email,
      date: customParams?.date ?? selectedDate,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );

    const query = new URLSearchParams(filteredParams).toString();

    Api("get", `auth/getAllUser?${query}`, "", router)
      .then((res) => {
        props.loader?.(false);
        if (res?.status) {
          setAllUser(res.data || []);
          setPagination((prev) => ({
            ...prev,
            totalPages: res.totalPages,
            currentPage: page,
          }));
        }
      })
      .catch(() => props.loader?.(false));
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const updateStatusAPI = (id, status) => {
    props.loader?.(true);

    Api("post", "updateContactStatus", { id, status }, router)
      .then((res) => {
        props.loader?.(false);

        if (res?.status) {
          props.toaster?.({
            type: "success",
            message: "Status updated successfully",
          });
          fetchUsers(currentPage);
        } else {
          props.toaster?.({
            type: "error",
            message: res?.message || "Failed to update status",
          });
        }
      })
      .catch((err) => {
        props.loader?.(false);
        props.toaster?.({
          type: "error",
          message: err?.message || "Something went wrong",
        });
      });
  };

  const handleFilterChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1);
  };

  const handleReset = () => {
    const resetParams = { name: "", email: "", date: "" };

    setSearchParams({ name: "", email: "" });
    setSelectedDate("");
    setCurrentPage(1);

    fetchUsers(1, resetParams); // direct new values pass
  };

  const renderName = ({ value }) => (
    <div className="flex items-center justify-center">
      <User size={16} className="mr-2 text-gray-500" />
      <p className="font-medium">{value}</p>
    </div>
  );

  const renderEmail = ({ value }) => (
    <div className="flex items-center justify-center">
      <Mail size={16} className="mr-2 text-gray-500" />
      {value}
    </div>
  );

  const renderDate = ({ value }) => (
    <div className="flex justify-center">
      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
        {moment(value).format("DD MMM YYYY")}
      </span>
    </div>
  );

  const renderPhone = ({ value }) => (
    <div className="flex items-center justify-center">
      <Phone size={16} className="mr-2 text-gray-500" />
      {value}
    </div>
  );

  // -------- Status Toggle --------
  const renderStatus = ({ row }) => {
    const status = row.original.status;

    return (
      <div className="flex justify-center">
        <button
          onClick={() =>
            updateStatusAPI(
              row.original._id,
              status === "active" ? "suspended" : "active",
            )
          }
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            status === "active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status === "active" ? "Active" : "Suspended"}
        </button>
      </div>
    );
  };

  const renderActions = ({ row }) => (
    <div className="flex justify-center">
      <button
        className="flex items-center cursor-pointer px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100"
        onClick={() => {
          setPopupData(row.original);
          setIsOpen(true);
        }}
      >
        <Eye size={16} className="mr-1 text-indigo-600" />
        <span className="text-indigo-600 text-sm">View</span>
      </button>
    </div>
  );

  const columns = useMemo(
    () => [
      { Header: "NAME", accessor: "name", Cell: renderName },
      { Header: "EMAIL", accessor: "email", Cell: renderEmail },
      { Header: "DATE", accessor: "createdAt", Cell: renderDate },
      { Header: "PHONE", accessor: "phone", Cell: renderPhone },
      { Header: "STATUS", accessor: "status", Cell: renderStatus },
      { Header: "ACTION", Cell: renderActions },
    ],
    [pagination],
  );

  return (
    <section className="bg-secondary min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">User Management</h1>

        <div className="bg-white  shadow-sm border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">
            <FilterIcon className="inline mr-2" /> Search & Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={searchParams.name}
                onChange={handleFilterChange}
                placeholder="Search by name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={searchParams.email}
                onChange={handleFilterChange}
                placeholder="Search by email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-end gap-3">
              <button
                onClick={handleSearch}
                className="bg-primary cursor-pointer hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition"
              >
                Search
              </button>

              <button
                onClick={handleReset}
                className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-black px-5 py-2 rounded-lg font-medium transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white  shadow border overflow-hidden">
          {allUser.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-[500px] text-center">
              <img
                src="/empty-box.png"
                alt="No data"
                className="w-32 h-32 mb-4 opacity-60"
              />
              <h3 className="text-xl font-medium text-gray-700 mb-1">
                No User found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <Table
              columns={columns}
              data={allUser}
              pagination={pagination}
              currentPage={currentPage}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <UserModel
          user={popupData}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </section>
  );
}

export default UserManagement;
