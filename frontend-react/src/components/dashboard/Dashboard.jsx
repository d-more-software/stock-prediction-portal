import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";

const Dashboard = () => {
  const [plots, setPlots] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true); // pour savoir si JWT est valide

  useEffect(() => {
    const fetchPlots = async () => {
      setLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          setAuthorized(false);
          setError("You must be logged in to view this page.");
          setLoading(false);
          return;
        }

        // Ajoute le JWT dans le header Authorization
        const response = await axiosInstance.get("/plots/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setPlots(response.data.plots);
      } catch (err) {
        console.error("API request error:", err.response || err);
        setError(
          err.response?.status === 401
            ? "Session expired. Please log in again."
            : "Erreur lors de la récupération des plots."
        );
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!authorized) return <div className="text-warning">Access denied. Please log in.</div>;

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h3 className="text-light mb-4">Stock Plots</h3>

          {plots?.plot && (
            <div className="mb-4">
              <h5 className="text-light">Closing Price</h5>
              <img src={plots.plot} alt="Closing Price" style={{ maxWidth: "100%" }} />
            </div>
          )}

          {plots?.ma100 && (
            <div className="mb-4">
              <h5 className="text-light">100 Days Moving Average</h5>
              <img src={plots.ma100} alt="100 DMA" style={{ maxWidth: "100%" }} />
            </div>
          )}

          {plots?.ma200 && (
            <div className="mb-4">
              <h5 className="text-light">200 Days Moving Average</h5>
              <img src={plots.ma200} alt="200 DMA" style={{ maxWidth: "100%" }} />
            </div>
          )}

          {plots?.prediction && (
            <div className="mb-4">
              <h5 className="text-light">Predicted Stock Price</h5>
              <img src={plots.prediction} alt="Prediction" style={{ maxWidth: "100%" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
