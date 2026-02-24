"use client";

import React, { useEffect, useState } from "react";
import { Api, ApiFormData } from "@/services/service";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { toast } from "react-toastify";
import Compressor from "compressorjs";

function Createsong({ loader, fetchSong, ...props }) {
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
      setmusicFile(props.editData?.music || null);
    }
  });
  const [musicFile, setmusicFile] = useState(null);
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

  const handleMusicChange = (event, i) => {
    const file = event.target.files[0];
    if (!file) return;
    setmusicFile(file);
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.time ||
      !imageFile ||
      !musicFile
    ) {
      toast.error("All fields are required");
      return;
    }

    loader?.(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("time", formData.time);
    data.append("image", imageFile);
    data.append("music", musicFile);
   const id = props.editId;
    const url = props.editId ? `music/updateMusic/${id}` : "music/create-music";

    Api("post", url, data, router, true)
      .then((res) => {
        loader?.(false);

        if (res?.status) {
          toast.success(props.editId ? "music updated successfully" : "music created successfully");
          fetchSong();
          props.setOpenAddSong(false);
        } else {
          toast.error(res?.message || "Something went wrong");
        }
      })
      .catch((err) => {
        loader?.(false);
        toast.error(err?.message || "Something went wrong");
      });
  };
  const handleMusic = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setmusicFile(file);
  };
  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 md:px-0 px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-black mb-6">New song</h2>

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
                  <span className="text-red-600 font-medium">Browse image</span>
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
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">
            Music File
          </label>

          <input
            type="file"
            accept="audio/*"
            onChange={handleMusicChange}
            className="w-full border border-gray-300 text-black cursor-pointer rounded-lg px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-1">
            song Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter song name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

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
            onClick={() => props.setOpenAddSong(false)}
            className="px-5 py-2 border cursor-pointer border-gray-300 rounded-lg text-black hover:bg-gray-100"
          >
            Discard
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          >
            {props.editId ? "Update song" : "Add song"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Createsong;
