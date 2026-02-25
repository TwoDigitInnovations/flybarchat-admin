"use client";

import React, { useEffect, useState } from "react";
import { Api, ApiFormData } from "@/services/service";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { toast } from "react-toastify";
import Compressor from "compressorjs";

function CreateMenu({ loader, fetchMenu, ...props }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    time: "",
  });

  useEffect(() => {
    if (props.editId) {
      setFormData({
        name: props.editData?.name || "",
        price: props.editData?.price || "",
        time: props.editData?.time || "",
      });
      setImageFile(props.editData?.image || null);
      setPreview(props.editData?.image || null);
    }
  }, [props.editId, props.editData]);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (event, i) => {
    const file = event.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.time || !imageFile) {
      toast.error("All fields are required");
      return;
    }

    loader?.(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("time", formData.time);
    data.append("image", imageFile);
    const id = props.editId;
    const url = props.editId ? `menu/updateMenu/${id}` : "menu/create-menu";

    Api("post", url, data, router, true)
      .then((res) => {
        loader?.(false);

        if (res?.status) {
          toast.success(
            props.editId
              ? "Menu updated successfully"
              : "Menu created successfully",
          );

          fetchMenu();
          props.setOpenAddMenu(false);
          props.setEditId(null);
        } else {
          toast.error(res?.message || "Something went wrong");
        }
      })
      .catch((err) => {
        loader?.(false);
        toast.error(err?.message || "Something went wrong");
      });
  };

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 md:px-0 px-4">
      <div className=" overflow-y-scroll h-[90%] scrollbar-hide">
        <div className="bg-white w-full min-w-xl rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-6">New Menu</h2>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Image
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="mx-auto h-24 object-contain"
                />
              ) : (
                <>
                  <UploadCloud className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">
                    Drag image here or{" "}
                    <span className="text-red-600 font-medium">
                      Browse image
                    </span>
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Menu Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter menu name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Buying Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-1">
              Video Call Time (Minutes)
            </label>
            <input
              type="number"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="Enter time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => props.setOpenAddMenu(false)}
              className="px-5 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-100"
            >
              Discard
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-red-600 text-white cursor-pointer rounded-lg hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
            >
              {props.editId ? "Update Menu" : "Add Menu"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateMenu;
