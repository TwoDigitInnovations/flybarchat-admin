import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SidePannel from "./SidePannel";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const router = useRouter();
  const [openTab, setOpenTab] = useState(false);
  const [token, setToken] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  if (!mounted) return null; 

  const path = router.pathname;

  const isLoginPage = path === "/login";


  if (isLoginPage) {
    return (
      <main className="min-h-screen flex-1">
        {children}
      </main>
    );
  }

 
  return (
    <div className="min-h-screen  flex flex-col">
      <img src="/barimage.png" alt="Background" className="fixed top-0 left-0 w-full h-full object-cover -z-10 " />
      <SidePannel setOpenTab={setOpenTab} openTab={openTab} />

      <div className="flex-1 lg:pl-72 ">
        <Navbar setOpenTab={setOpenTab} openTab={openTab} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
