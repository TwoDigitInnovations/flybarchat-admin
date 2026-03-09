import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { userContext } from "@/pages/_app";
import { PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { LayoutDashboard, List, Music, Settings, User2, X } from "lucide-react";

const SidePannel = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null); // desktop submenu state
  const [mobileOpenMenu, setMobileOpenMenu] = useState(null); // mobile submenu state

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    {
      href: "/",
      title: "Dashboard",
      img: <LayoutDashboard size={25} />,
      access: ["admin"],
    },
    {
      href: "/user",
      title: "User Management",
      img: <User2 size={25} />,
      access: ["admin"],
    },

    {
      href: "/menu",
      title: "Menu",
      img: <List size={25} />,
      access: ["admin"],
    },
    {
      href: "/songs",
      title: "Songs",
      img: <Music size={25} />,
      access: ["admin"],
    },
    {
      href: "/settings",
      title: "Settings",
      img: <Settings size={25} />,
      access: ["admin"],
    },
    {
      href: "/Banner-offer",
      title: "Banner Offer",
      img: <Settings size={25} />,
      access: ["admin"],
    },
  ];

  const imageOnError = (event) => {
    // event.currentTarget.src = "/userprofile.png";
  };

  const currentMenuItems = menuItems;

  return (
    <>
      <div
        className="xl:w-[270px] fixed top-0 left-0 z-20 md:w-[250px] sm:w-[200px] hidden sm:grid grid-rows-5 overflow-hidden bg-[#11141AD9]
"
      >
        <div>
          <div className=" py-5 overflow-y-scroll h-screen scrollbar-hide">
            <div
              className=" pt-3 pb-5 row-span-1 flex items-center gap-2 justify-center cursor-pointer mx-5 rounded"
              onClick={() => router.push("/")}
            >
              <img src="/Mocktail.png" className="w-8 h-8 object-contain" />
              <p className="text-[20px] text-custom-yellow font-bold">
                {" "}
                FLAY CHAT BAR
              </p>
            </div>

            <div className="relative flex flex-col justify-between row-span-4 w-full">
              <ul className=" w-full flex flex-col text-left bg-secondary rounded-lg">
                {currentMenuItems.map((item, i) =>
                  item?.access?.includes(user?.role) ? (
                    <li key={i} className="w-full ">
                      <div
                        className={`flex items-center justify-between mx-5 px-6 cursor-pointer group hover:bg-primary ${
                          router.pathname === item.href
                            ? "bg-primary text-white "
                            : "text-white bg-[#2E3537]"
                        }`}
                        onClick={() =>
                          item.children
                            ? setOpenMenu(openMenu === i ? null : i)
                            : router.push(item.href)
                        }
                      >
                        <div className="py-3 font-semibold flex items-center gap-4">
                          <span className="text-custom-yellow">
                            {" "}
                            {item?.img}
                          </span>{" "}
                          {item?.title}
                        </div>
                        {item.children &&
                          (openMenu === i ? (
                            <IoIosArrowDown className="text-xl" />
                          ) : (
                            <IoIosArrowForward className="text-xl" />
                          ))}
                      </div>

                      {item.children && openMenu === i && (
                        <ul className="mx-4  rounded-lg">
                          {item.children.map((child, j) => (
                            <Link
                              href={child.href}
                              key={j}
                              className={`block py-3 px-10 m-1 font-semibold text-sm hover:bg-[#FF700099] rounded ${
                                router.pathname === child.href
                                  ? "bg-primary text-black font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 w-full h-screen z-50 sm:hidden bg-secondary transform ${
          openTab ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <X
          className="absolute text-white top-5 right-5 text-2xl cursor-pointer"
          onClick={() => setOpenTab(false)}
        />

        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white">
              <img
                src="/office-man.png"
                alt="Profile"
                className="w-full h-full object-cover"
                onError={imageOnError}
              />
            </div>

            <div>
              <p className="text-white font-semibold text-lg">
                {user?.name || "Guest"}
              </p>
              {user?.id && (
                <button
                  onClick={() => {
                    setOpenTab(false);
                    router.push("/MyProfile");
                  }}
                  className="text-sm text-custom-yellow mt-1"
                >
                  View Profile
                </button>
              )}
            </div>
          </div>

          {/* Login / Logout */}
          <div className="mt-4">
            {user?.id ? (
              <button
                className="flex items-center gap-3 text-white font-medium hover:text-red-400 transition"
                onClick={() => {
                  Swal.fire({
                    text: "Are you sure you want to logout?",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    confirmButtonColor: "#e0f349",
                    width: "320px",
                  }).then((result) => {
                    if (result.isConfirmed) logOut();
                  });
                }}
              >
                <PiSignOutFill className="text-xl" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpenTab(false)}
                className="text-white font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Menu Section */}
        <div className="h-[calc(100vh-140px)] overflow-y-auto">
          <ul className="flex flex-col">
            {currentMenuItems.map((item, i) =>
              item?.access?.includes(user?.role) ? (
                <li key={i} className="border-b border-gray-700">
                  {/* Parent Item */}
                  <div
                    className="flex justify-between items-center px-6 py-4 text-white cursor-pointer hover:bg-gray-800 transition"
                    onClick={() =>
                      item.children
                        ? setMobileOpenMenu(mobileOpenMenu === i ? null : i)
                        : (setOpenTab(false), router.push(item.href))
                    }
                  >
                    <div className="flex items-center gap-3 font-medium">
                      <span className="text-custom-yellow text-lg">
                        {item.img}
                      </span>
                      {item.title}
                    </div>

                    {item.children &&
                      (mobileOpenMenu === i ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowForward />
                      ))}
                  </div>

                  {/* Children */}
                  {item.children && mobileOpenMenu === i && (
                    <ul className="bg-gray-900">
                      {item.children.map((child, j) => (
                        <Link
                          href={child.href}
                          key={j}
                          onClick={() => setOpenTab(false)}
                          className={`block py-3 pl-14 text-sm transition ${
                            router.pathname === child.href
                              ? "bg-custom-yellow text-black font-semibold"
                              : "text-gray-300 hover:bg-gray-800"
                          }`}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </ul>
                  )}
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SidePannel;
