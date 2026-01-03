import { useState } from "react";
import axiosInstance from "../axiosInstance";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      await axiosInstance.post('/register/', { username, email, password });


      const tokenResponse = await axiosInstance.post('/token/', { username, password });
      const accessToken = tokenResponse.data.access;
      const refreshToken = tokenResponse.data.refresh;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setErrors(err.response?.data || { detail: "Unknown error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 bg-dark p-4 rounded">
          <h3 className="text-light text-center mb-4">Create an account</h3>
          <form onSubmit={handleRegistration}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && <div className="text-danger">{errors.username}</div>}

            <input
              type="email"
              className="form-control mb-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}

            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}

            {success && <div className="alert alert-success">Registration successful!</div>}

            <button type="submit" className="btn btn-info w-100" disabled={loading}>
              {loading ? <><FontAwesomeIcon icon={faSpinner} spin /> Please wait...</> : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
