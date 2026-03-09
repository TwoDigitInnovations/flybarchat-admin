import React, { useEffect, useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdDelete, MdEdit, MdOutlineImageNotSupported } from "react-icons/md";
import { Api, ApiFormData } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { DeleteModel } from "../../components/DeleteModel";

function BannerOffer(props) {
  const router = useRouter();

  const [bannerList, setBannerList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    image: "",
    price: "",
    offerprice: "",
  });

  useEffect(() => {
    getBanner();
  }, []);

  const getBanner = () => {
    props.loader(true);

    Api("get", "banner/get-banner-offer", "", router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          setBannerList(res?.data?.data || []);
        }
      },
      () => props.loader(false),
    );
  };

  const submit = async () => {
    const formData = new FormData();

    if (!form.image || form.price || form.offerprice) {
      toast.error("Please fill all the details");
    }

    if (form.image) formData.append("image", form.image);
    formData.append("price", form.price);
    formData.append("offerprice", form.offerprice);

    props.loader(true);

    let url = editId
      ? `banner/update-banner-offer/${editId}`
      : "banner/create-banner-offer";

    let method = editId ? "put" : "post";

    ApiFormData(method, url, formData, router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          toast.success(res.message);

          setShowModal(false);
          setEditId(null);

          setForm({
            image: "",
            price: "",
            offerprice: "",
          });

          getBanner();
        }
      },
      () => props.loader(false),
    );
  };

  const handleDelete = () => {
    props.loader(true);
    const id = editId;
    Api("delete", `banner/delete-banner-offer/${id}`, "", router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          toast.success("Deleted successfully");
          getBanner();
        }
      },
      () => props.loader(false),
    );
  };

  const editBanner = (item) => {
    setEditId(item._id);

    setForm({
      image: item.image,
      price: item.price,
      offerprice: item.offerprice,
    });
    setPreview(item.image);

    setShowModal(true);
  };

  return (
    <div className="bg-secondary min-h-screen md:p-6 p-4">
      \
      <div className="flex md:flex-row flex-col justify-between  gap-4 md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-semibold text-white">Banner Offers</h2>
          <p className="text-sm text-gray-300">Manage homepage banner offers</p>
        </div>

        <button
          onClick={() => {
            setEditId(null);
            setShowModal(true);
          }}
          className="bg-primary text-white px-6 py-2.5 rounded-lg shadow hover:scale-105 transition"
        >
          + Add Banner
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border">
        {bannerList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[68vh] text-gray-500">
            <MdOutlineImageNotSupported
              size={60}
              className="text-gray-400 mb-4"
            />

            <h3 className="text-lg font-semibold text-gray-700">
              No Banner Created
            </h3>

            <p className="text-sm mt-1 text-gray-500">
              You haven't added any banner offers yet.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Offer Price</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {bannerList.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-1">
                    <img
                      src={item.image}
                      className="w-28 h-28 object-contain rounded-lg shadow-sm"
                    />
                  </td>

                  <td className="p-4 font-medium">${item.price}</td>

                  <td className="p-4">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      ${item.offerprice}
                    </span>
                  </td>

                  <td className="p-4 flex items-center  gap-3">
                    <button
                      onClick={() => editBanner(item)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition"
                    >
                      <MdEdit size={18} />
                    </button>

                    <button
                      onClick={() => {
                        setConfirmOpen(true);
                        setEditId(item._id);
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
                    >
                      <MdDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-[420px] rounded-2xl shadow-xl md:p-6 p-5 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold text-gray-800">
                {editId ? "Update Banner" : "Add Banner"}
              </h3>

              <IoCloseCircleOutline
                className="text-2xl text-gray-500 hover:text-red-500 cursor-pointer"
                onClick={() => {
                  setEditId("");
                  setForm("");
                  setPreview("");
                  setShowModal(false);
                }}
              />
            </div>

            <div className="space-y-4">
              {/* File Upload */}
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                className="border rounded-lg p-2 w-full text-black 
          file:bg-primary file:text-white file:border-none 
          file:px-4 file:py-1 file:rounded file:mr-3"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setForm({ ...form, image: file });
                  setPreview(URL.createObjectURL(file));
                }}
              />

              {/* Image Preview */}
              {preview && (
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-40 object-contain rounded-lg border"
                  />
                </div>
              )}

              {/* Price */}
              <input
                type="number"
                placeholder="Price"
                className="border w-full p-2.5 rounded-lg text-black focus:ring-2 focus:ring-indigo-400 outline-none"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />

              {/* Offer Price */}
              <input
                type="number"
                placeholder="Offer Price"
                className="border w-full p-2.5 text-black rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                value={form.offerprice}
                onChange={(e) =>
                  setForm({
                    ...form,
                    offerprice: e.target.value,
                  })
                }
              />

              {/* Button */}
              <button
                onClick={submit}
                className="bg-primary text-white cursor-pointer w-full py-2.5 rounded-lg font-medium shadow hover:scale-105 transition"
              >
                {editId ? "Update Banner" : "Save Banner"}
              </button>
            </div>
          </div>
        </div>
      )}
      <DeleteModel
        isOpen={confirmOpen}
        setIsOpen={setConfirmOpen}
        title="Delete banner Offer"
        message={`Are you sure you want to delete this Offer?`}
        onConfirm={handleDelete}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </div>
  );
}

export default BannerOffer;
