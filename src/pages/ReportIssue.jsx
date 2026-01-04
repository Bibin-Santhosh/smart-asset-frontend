import { useEffect, useState } from "react";
import api from "../api";
import "./ReportIssue.css";

function ReportIssue() {
  const [assets, setAssets] = useState([]);
  const [assetId, setAssetId] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  /* Load employee assigned assets */
  useEffect(() => {
    api.get("employee/assets/")
      .then((res) => {
        setAssets(res.data);
      })
      .catch((err) => {
        console.error("Failed to load assets", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assetId || !issue) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("tickets/report/", {
        asset: assetId,
        issue: issue,
      });

      alert("Issue reported successfully");

      setAssetId("");
      setIssue("");
    } catch (err) {
      console.error("Report issue error:", err);
      alert("Failed to report issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-issue-page">
      <div className="report-card">
        <h2>Report an Issue</h2>
        <p className="sub-text">
          Report a problem with your assigned asset
        </p>

        <form onSubmit={handleSubmit}>
          <label>Select Asset *</label>
          <select
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            required
          >
            <option value="">-- Select Asset --</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <label>Issue Description *</label>
          <textarea
            rows="4"
            placeholder="Describe the issue..."
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setAssetId("");
                setIssue("");
              }}
            >
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;
