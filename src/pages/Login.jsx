import { useState } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import { dev } from '../utils/ApiUrl';
import { useDispatch, } from "react-redux";
import { userLoggedIn } from "../feauters/user.slice";

import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [formdata, setFormdata] = useState({
    employeeId: "",
    password: "",
      // versionName: "V1.0.20241227.1757"

  });
  const [showEmployeeId, setShowEmployeeId] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()

  const [errors, setErrors] = useState({
    employeeId: "",
    password: "",
  });

  const[loginError, setLoginError] = useState(null)

 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormdata({
      ...formdata,
      [name]: value,
    });

    if (formdata.employeeId) {
      errors.employeeId = "";
    }
    if (formdata.password) {
      errors.password = "";
    }
    setErrors(errors);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!formdata.employeeId) {
      errors.employeeId = "Employee ID required";
    }

    if (!formdata.password) {
      errors.password = "Password required";
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoginError(null)
      const resp = await fetch(
        `${dev}/user/login-account`,
        {
          method: "POST",
          body: JSON.stringify(formdata),
          headers: {
            "content-type": "application/json",
          },
        }
      );

      const result = await resp.json();
      console.log('result', result);
      if (!resp.ok) {
        console.log(resp, "error occurring in response");
        toast.error(result.message || "Login failed");
        setLoginError(result.message || "Login failed");
        return;
      }
      console.log('user after login',result.user)

      localStorage.setItem("currentUser", result.user.personId);
      // localStorage.setItem("Accountant", result.user.Accountant);
      localStorage.setItem("Accountant", result.user.designation);
      localStorage.setItem("accessToken", result.token);

      localStorage.setItem("department", result.user.department);
      localStorage.setItem("designation", result.user.designation);

      console.log('local Accountant', result.user.Accountant);
      console.log('local Accountant 222', result.user.designation);
      console.log('local Department', result.user.department);
      console.log('local Designation', result.user.designation);

      dispatch(userLoggedIn(result.user))
      // navigate("/dashboard");
      setLoginError(null)

      if (result.user.department === "Sales" && result.user.designation === "Accountant") {
        navigate("/salestable");
      } else if (result.user.department === "Sales") {
        navigate("/dashboard");
      } else if (result.user.department === "Logistics") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }

      toast.success(result.message || "Logged in successfully");
    } catch (error) {
      setLoginError("Something went wrong")
      console.log("error occurring in login", error.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="login-container ">
      {/* Login form */}
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Logo section */}
        <div className=" mx-auto my-3 w-full h-28  overflow-hidden">
          <img src={logo} alt="Company Logo" className="h-full w-full object-fill" />
        </div>

        {/* Input for Employee ID */}
        <div className="input-wrapper">
          <label htmlFor="employeeId">Employee ID</label>
          <div className="input-with-icon">
            <input
              type={"text"}
              name="employeeId"
              onChange={handleChange}
              placeholder="enter employee Id"
              value={formdata.employeeId}
              style={errors.employeeId ? { border: "2px solid red" } : {}}
            />
            <span
              className="toggle-icon"
              onClick={() => setShowEmployeeId(!showEmployeeId)}
            >
              {/* {showEmployeeId ? <FaEyeSlash /> : <FaEye />} T */}
            </span>
          </div>
          {errors.employeeId && <p className="error-field">{errors.employeeId}</p>}
        </div>

        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <div className="input-with-icon">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formdata.password}
              onChange={handleChange}
              placeholder="enter your password"
              style={errors.password ? { border: "2px solid red" } : {}}
            />
            <span
              className="toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="error-field">{errors.password}</p>}
        </div>
        {loginError && <p className="error-field">{loginError}</p>}

        {/* Submit button */}
        <div>
          <input type="submit" value="Login" />
        </div>
      
      </form>
    </div>
  );
}

export default Login;
