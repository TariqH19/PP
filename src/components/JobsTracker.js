import React from "react";
import { useTracker } from "../context/TrackerContext";

const JobsTracker = () => {
  const { jobs, addJob, updateJob, removeJob } = useTracker();

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">Job Tracker</div>
          <div className="panel-subtitle">
            Track applications for Tariq & Olivia
          </div>
        </div>
      </div>

      {["tariq", "olivia"].map((person) => (
        <div key={person} style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <div style={{ fontWeight: 600, textTransform: "capitalize" }}>
              {person}
            </div>
            <button className="add-btn" onClick={() => addJob(person)}>
              + Add
            </button>
          </div>
          <div className="table-wrap" style={{ marginTop: 8 }}>
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Stage</th>
                  <th>Salary</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(jobs[person] || []).map((d, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        value={d.company || ""}
                        onChange={(e) =>
                          updateJob(person, i, { company: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={d.role || ""}
                        onChange={(e) =>
                          updateJob(person, i, { role: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={d.stage || ""}
                        onChange={(e) =>
                          updateJob(person, i, { stage: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={d.salary || ""}
                        onChange={(e) =>
                          updateJob(person, i, { salary: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={d.notes || ""}
                        onChange={(e) =>
                          updateJob(person, i, { notes: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => removeJob(person, i)}>
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobsTracker;
