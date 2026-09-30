import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTint,
  FaUsers,
  FaChartBar,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div
      className="min-h-screen flex bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2000')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/85"></div>

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 relative z-10 p-12 items-center">
        <div className="text-white max-w-xl">
          <div className="flex items-center gap-4 mb-8">
            <FaUser className="text-6xl text-blue-500" />

            <div>
              <h1 className="text-5xl font-bold">
                Smart Dairy
                <span className="text-blue-500"> ERP Lite</span>
              </h1>
            </div>
          </div>

          <p className="text-xl text-slate-300 mb-10">
            Streamline your dairy operations with a secure,
            smart and efficient management system.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <FaTint className="text-blue-400 text-3xl mt-1" />

              <div>
                <h3 className="font-semibold text-blue-400">
                  Milk Collection
                </h3>

                <p className="text-slate-400">
                  Track daily milk collection and quality.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <FaUsers className="text-blue-400 text-3xl mt-1" />

              <div>
                <h3 className="font-semibold text-blue-400">
                  Farmer Management
                </h3>

                <p className="text-slate-400">
                  Manage farmers, records and payments.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <FaChartBar className="text-blue-400 text-3xl mt-1" />

              <div>
                <h3 className="font-semibold text-blue-400">
                  Reports & Analytics
                </h3>

                <p className="text-slate-400">
                  Generate powerful business insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-5">
        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-white/20
            bg-white/10
            backdrop-blur-2xl
            shadow-2xl
            p-8
          "
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-4">
            <FaUser className="text-5xl text-blue-500" />
          </div>

          <h2 className="text-3xl font-bold text-center text-white">
            Smart Dairy
            <span className="text-blue-500"> ERP Lite</span>
          </h2>

          <p className="text-center text-slate-300 mt-2 mb-8">
            Login to your account
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Email */}

            <div>
              <label className="text-slate-200 mb-2 block">
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-4 text-slate-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="
                      w-full
                       bg-slate-900/60
                       border border-slate-700
                       rounded-xl
                       pl-12
                       pr-4
                       py-3
                       text-white
                       focus:outline-none
                       focus:border-blue-500"
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="text-slate-200 mb-2 block">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-4 text-slate-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="
                         w-full
                         bg-slate-900/60
                         border border-slate-700
                         rounded-xl
                         pl-12
                         pr-12
                         py-3
                         text-white
                         focus:outline-none
                         focus:border-blue-500
                       "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-4 text-slate-400"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login */}

            <button
              type="submit"
              className="
                w-full
                py-3
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-semibold
                transition
              "
            >
              Login
            </button>
          </form>

          {/* Divider */}

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-700"></div>

            <span className="px-3 text-slate-400 text-sm">
              OR
            </span>

            <div className="flex-1 border-t border-slate-700"></div>
          </div>

          {/* Request Account */}

          <button
            className="
              w-full
              border
              border-slate-600
              rounded-xl
              py-3
              text-white
              hover:bg-white/10
              transition
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <FaUserPlus />
            Request New Account
          </button>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Need an account?
            </p>

            <p className="text-blue-400 text-sm mt-1">
              Contact Dairy Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;