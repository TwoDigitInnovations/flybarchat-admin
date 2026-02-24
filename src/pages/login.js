import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { toast } from "react-toastify";

export default function Login(props) {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({ email: "", password: "" });
  const [user, setUser] = useContext(userContext);

  const submit = async () => {
    setSubmitted(true);

    if (!userDetail.email || !userDetail.password) {
      toast.error("Missing credentials");
      return;
    }

    try {
      setLoading(true);
      props.loader(true);

      const res = await Api("post", "auth/login", { ...userDetail }, router);

      if (res?.status) {
        const user = res.data.user;

        if (user.role === "admin") {
          localStorage.setItem("userDetail", JSON.stringify(user));
          localStorage.setItem("token", res.data?.token);
          setUser(user);
          toast.success(res.data.message);
          router.push("/");
        } else {
          toast.error(res.data.message || "You are not authorized");
        }
      } else {
        toast.error("Login failed");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      props.loader(false);
      setLoading(false);
    }
  };

  return (
    <div
      className="relative"
      style={{ background: "#0d0d0d" }}
    >
      <div className=" mx-auto md:px-6 flex overflow-hidden min-h-screen ">
        <div
          className="relative z-10 flex flex-col justify-center w-full md:w-[50%] px-6 md:px-16 py-12"
          style={{
            background: "linear-gradient(135deg, #0d0d0d 0%, #1a0a0a 100%)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, #c0392b, transparent)",
            }}
          ></div>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-[2px] bg-red-700"></div>
              <span className="text-xs tracking-[0.3em] uppercase text-red-500 font-light">
                Admin Portal
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mt-3 leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Sign In
            </h1>
            <p className="text-gray-500 text-sm mt-2 tracking-wide">
              Access your dashboard
            </p>
          </div>

          <div className="space-y-7">
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-red-700 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Please enter your email"
                  value={userDetail.email}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, email: e.target.value })
                  }
                  className={`w-full pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 ${
                    submitted && !userDetail.email
                      ? "border-red-600"
                      : "border-gray-800"
                  }`}
                  style={{
                    background: "#161616",
                    border: `1px solid ${submitted && !userDetail.email ? "#c0392b" : "#2a2a2a"}`,
                    borderRadius: "2px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#c0392b";
                    e.target.style.boxShadow = "0 0 0 1px #c0392b22";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      submitted && !userDetail.email ? "#c0392b" : "#2a2a2a";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              {submitted && !userDetail.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-3 h-[1px] bg-red-500 inline-block"></span>{" "}
                  Email is required
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-red-700 pointer-events-none" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Please enter your password"
                  value={userDetail.password}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, password: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className={`w-full pl-11 pr-12 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 ${
                    submitted && !userDetail.password
                      ? "border-red-600"
                      : "border-gray-800"
                  }`}
                  style={{
                    background: "#161616",
                    border: `1px solid ${submitted && !userDetail.password ? "#c0392b" : "#2a2a2a"}`,
                    borderRadius: "2px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#c0392b";
                    e.target.style.boxShadow = "0 0 0 1px #c0392b22";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      submitted && !userDetail.password ? "#c0392b" : "#2a2a2a";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-300 transition-colors"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {submitted && !userDetail.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-3 h-[1px] bg-red-500 inline-block"></span>{" "}
                  Password is required
                </p>
              )}
            </div>

            <div className="flex justify-end -mt-3">
              <span className="text-xs text-gray-600 hover:text-red-500 cursor-pointer transition-colors tracking-wide">
                Forgot Password?
              </span>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-3.5 font-semibold text-sm tracking-[0.15em] uppercase transition-all duration-200 flex cursor-pointer items-center justify-center gap-3 disabled:opacity-60 bg-primary"
              style={{
                // background: loading ? "#7f1d1d" : "#c0392b",
                color: "#fff",
                borderRadius: "2px",
                border: "none",
                letterSpacing: "0.1em",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = "#a93226";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = "#c0392b";
              }}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Submit <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, #c0392b44, transparent)",
            }}
          ></div>
        </div>

        <div className="hidden md:block relative w-[50%]">
          <img
            src="/image1.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.55) saturate(0.9)" }}
          />
          {/* Warm amber overlay to match the bar ambiance */}
          {/* <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0d0d0d 0%, transparent 20%), linear-gradient(to bottom, rgba(139,69,19,0.15) 0%, rgba(0,0,0,0.4) 100%)" }}></div> */}

          <div
            className="absolute top-8 right-8 border border-red-900/30 w-20 h-20"
            style={{ borderRadius: "1px" }}
          ></div>
          <div
            className="absolute top-10 right-10 border border-red-900/20 w-20 h-20"
            style={{ borderRadius: "1px" }}
          ></div>

          <div className="absolute bottom-10 left-8 right-8">
            <div className="w-8 h-[1px] bg-red-700 mb-3"></div>
            <p className="text-gray-400 text-xs tracking-widest uppercase">
              Welcome back
            </p>
          </div>
        </div>

        <div className="md:hidden absolute inset-0 -z-10">
          <img
            src="/image1.png"
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
      </div>
    </div>
  );
}
