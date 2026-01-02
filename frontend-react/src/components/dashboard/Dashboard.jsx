import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [ticker, setTicker] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plot, setPlot] = useState(null);
  const [mse, setMse] = useState(null);
  const [rmse, setRmse] = useState(null);
  const [r2, setR2] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlot(null);
    setMse(null);
    setRmse(null);
    setR2(null);

    try {

      const response = await axiosInstance.post("/predict/", { ticker });

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      const backendRoot = import.meta.env.VITE_BACKEND_ROOT;
      setPlot(`${backendRoot}${response.data.plot}`);
      setMse(response.data.mse);
      setRmse(response.data.rmse);
      setR2(response.data.r2);
    } catch (err) {
      console.error("API request error:", err);
      setError("Erreur lors de la récupération des données depuis le backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Stock Ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              required
            />
            {error && <div className="text-danger mt-2">{error}</div>}
            <button type="submit" className="btn btn-info mt-3" disabled={loading}>
              {loading ? (
                <span>
                  <FontAwesomeIcon icon={faSpinner} spin /> Please wait...
                </span>
              ) : (
                "See Prediction"
              )}
            </button>
          </form>

          {plot && (
            <div className="mt-5">
              <h4 className="text-light mb-3">Predicted Stock Price</h4>
              <img src={plot} alt="Stock Prediction Plot" style={{ maxWidth: "100%" }} />
              <div className="text-light mt-3">
                <p>Mean Squared Error (MSE): {mse}</p>
                <p>Root Mean Squared Error (RMSE): {rmse}</p>
                <p>R-Squared: {r2}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
