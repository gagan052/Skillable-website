import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
// import newRequest from "../../../../api/utils/newRequest";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Basic validation
      if (!user.username || !user.email || !user.password || !user.country) {
        throw new Error("Please fill in all required fields");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        throw new Error("Please enter a valid email address");
      }

      let url = "";
      if (file) {
        url = await upload(file);
      }

      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   setLoading(true);
  
  //   try {
  //     console.log("🔹 Sending API Request...");
  
  //     const response = await newRequest.post("/auth/register", {
  //       username: user.username,
  //       email: user.email,
  //       password: user.password,
  //       country: user.country,
  //       isSeller: user.isSeller,
  //       desc: user.desc,
  //       img: file ? await upload(file) : "",
  //     }, {
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     });
  
  //     console.log("✅ Registration Success:", response.data);
  //     navigate("/login");
  
  //   } catch (err) {
  //     console.error("❌ API Error:", err);
  //     setError(err.response?.data?.message || err.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="">Username</label>
          <input
            name="username"
            type="text"
            placeholder="johndoe"
            onChange={handleChange}
          />
          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <label htmlFor="">Password</label>
          <input name="password" type="password" onChange={handleChange} />
          <label htmlFor="">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="">Country</label>
          <input
            name="country"
            type="text"
            placeholder="Usa"
            onChange={handleChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="">Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+1 234 567 89"
            onChange={handleChange}
          />
          <label htmlFor="">Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default Register;
