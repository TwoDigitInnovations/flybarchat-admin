import React, { useState, useRef, useEffect } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { useRouter } from "next/router";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Api, ApiFormData } from "@/services/service";
import Compressor from "compressorjs";
import { toast } from "react-toastify";

function Settings(props) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const bannerFileRef = useRef(null);
  const [carouselImg, setCarouselImg] = useState([]);
  const [singleImg, setSingleImg] = useState("");
  const selectRef = useRef(null);
  const [id, setId] = useState("");

  useEffect(() => {
    getsetting();
  }, []);

  const handleImageChange = (event) => {
    console.log(event.target.files[0]);
    
    const file = event.target.files[0];
    if (!file) return;

    new Compressor(file, {
      quality: 0.6,
      success: (compressedResult) => {
      
        const fileSizeInMb = compressedResult.size / (1024 * 1024);

        if (fileSizeInMb > 2) {
          toast.error(
            "Compressed file is still too large. Please choose a smaller image.",
          );
          return;
        }

        const data = new FormData();
        data.append("file", compressedResult);

        props.loader(true);

        ApiFormData("post", "auth/fileupload", data, router).then(
          (res) => {
            props.loader(false);

            if (res.status) {
              setSingleImg(res.data.file);
              toast.success(res.data.message);
            }
          },
          (err) => {
            props.loader(false);
            console.log(err);
            toast.error(err.message);
          },
        );
      },

      error(err) {
        console.log(err);
        toast.error("Image compression failed");
      },
    });
  };

  const submit = (e) => {
    e.preventDefault();

    props.loader(true);
    let data = {
      id: id,
      carousel: carouselImg,
    };

    Api("post", "setting/updateSetting", data, router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          setSubmitted(false);
          toast.success(res?.message || "Settings updated successfully");
          getsetting();
        } else {
          props.loader(false);
          toast.error(res?.data?.message || "Something went wrong");
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(
          err?.data?.message || err?.message || "Something went wrong",
        );
      },
    );
  };

  const getsetting = async () => {
    props.loader(true);
    Api("get", "setting/getsetting", "", router).then(
      (res) => {
        props.loader(false);
        console.log(res.status);

        if (res?.status) {
          setId(res?.data.setting[0]?._id || "");
          setCarouselImg(res?.data.setting[0]?.carousel || []);
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(err?.message || "Something went wrong");
      },
    );
  };

  const closeBannerIcon = (item) => {
    const filteredImages = carouselImg.filter((f) => f.image !== item.image);
    setCarouselImg(filteredImages);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-secondary min-h-screen p-6 md:p-10">
        <h2 className="text-gray-800 font-bold text-white md:text-3xl text-xl mb-4 flex items-center">
          <span className="w-1 h-8 bg-primary  rounded mr-3"></span>
          Settings
        </h2>

        <section className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <form className="w-full" onSubmit={submit}>
            <div className="space-y-6">
              <div className="relative w-full">
                <label className="text-gray-700 text-lg font-medium mb-2 block">
                  Images
                </label>
                <div className="border border-gray-300 hover:border-[#F38529] transition-colors rounded-lg p-3 w-full bg-white flex justify-start items-center">
                  <input
                    className="outline-none bg-transparent w-full text-gray-700"
                    type="text"
                    placeholder="Enter image URL"
                    value={singleImg}
                    onChange={(text) => {
                      setSingleImg(text.target.value);
                    }}
                  />
                  <div
                    className="ml-2 cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-md transition-colors"
                    onClick={() => {
                      bannerFileRef.current.click();
                    }}
                  >
                    <MdOutlineFileUpload className="text-gray-700 h-6 w-6" />
                  </div>
                  <input
                    type="file"
                    ref={bannerFileRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {submitted && carouselImg.length === 0 && (
                  <p className="text-red-600 mt-1 text-sm">
                    Banner image is required
                  </p>
                )}
              </div>

              <div className="flex md:flex-row flex-col justify-between items-end gap-4">
                <p className="text-gray-800 text-[14px] md:text-[16px]">
                  Please upload the image in fix resolution. This ensures it
                  looks great on both mobile and website views.
                </p>
                <button
                  type="button"
                  className="text-white bg-primary hover:bg-red-600 transition-colors rounded-lg text-md py-2.5 px-6 font-medium shadow-sm"
                  onClick={() => {
                    if (singleImg === "") {
                      toast.error("Banner Images is required");
                      return;
                    }
                    setCarouselImg([...carouselImg, { image: singleImg }]);
                    setSingleImg("");
                  }}
                >
                  Add Image
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                {carouselImg?.map((item, i) => (
                  <div key={i} className="relative group">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <img
                        className="max-w-full max-h-full object-contain"
                        src={item.image}
                        alt=" preview"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-90 hover:opacity-100 transition-opacity"
                      onClick={() => {
                        closeBannerIcon(item);
                      }}
                    >
                      <IoCloseCircleOutline className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="text-white bg-primary hover:bg-red-600 transition-colors rounded-lg text-md font-medium py-2.5 px-6 shadow-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default Settings;
