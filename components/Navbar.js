import { userContext } from "@/pages/_app";
import {
  Bell,
  User,
  Search,
  User2,
  ArrowBigDown,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiCalendarSlash, PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";

const Navbar = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleLogout = () => {
    Swal.fire({
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#980008",
      customClass: {
        confirmButton: "px-12 rounded-xl",
        title: "text-[20px] text-black",
        actions: "swal2-actions-no-hover",
        popup: "rounded-[15px] shadow-lg",
      },
      buttonsStyling: true,
      reverseButtons: true,
      width: "350px",
    }).then(function (result) {
      if (result.isConfirmed) {
        logOut();
        setDropdownOpen(false);
      }
    });
  };

  const imageOnError = (event) => {
    event.currentTarget.src = "/userprofile.png";
    // event.currentTarget.className = "error";
  };

  return (
    <nav className="w-full bg-primary md:bg-transparent z-20 sticky top-0 max-w-screen shadow-sm ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between md:h-20 h-16">
          {user?.id && (
            <div className="hidden md:flex items-center justify-end space-x-4 flex-1">
              <div className="relative">
                <div className="flex items-center space-x-3  px-4 py-2 rounded-lg transition-colors duration-200">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0 cursor-pointer">
                    <img
                      src={"/office-man.png"}
                      alt="User"
                      className="w-full h-full object-cover"
                      onError={imageOnError}
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-white text-md">{user?.name}</p>
                    <p className="text-white text-md">{user?.role}</p>
                  </div>

                  <div
                    className="flex flex-col text-left border-1 border-gray-200 rounded-full p-2 cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <ChevronDown size={20} className="text-white" />
                  </div>
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/myprofile");
                      }}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <User2 size={16} className="text-black" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <PiSignOutFill size={16} className="text-black" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="md:hidden flex items-center justify-between space-x-4 flex-1">
            <div
              className="bg-custom-black pt-3 pb-5 row-span-1 flex items-start gap-2 justify-start cursor-pointer  rounded"
              onClick={() => router.push("/")}
            >
              <img src="/Mocktail.png" className="w-8 h-8 object-contain" />
              <p className="text-[20px] text-custom-yellow font-bold">
                {" "}
                FLAY CHAT BAR
              </p>
            </div>
            <button
              onClick={() => setOpenTab(!openTab)}
              className="p-2 rounded-md text-white hover:bg-gray-100 focus:outline-none"
            >
              <GiHamburgerMenu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
