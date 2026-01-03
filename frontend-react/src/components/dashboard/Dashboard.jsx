import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";

const Dashboard = () => {
  const [plots, setPlots] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axiosInstance.get("/plots/");    
        setPlots(response.data.plots);
      } catch (err) {
        console.error("API request error:", err);
        setError("Erreur lors de la récupération des plots depuis le backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

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
