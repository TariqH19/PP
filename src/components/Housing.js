import React from "react";
import { useTracker } from "../context/TrackerContext";

const Housing = () => {
  const { housing, addHousing, updateHousing, removeHousing } = useTracker();

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">Housing</div>
          <div className="panel-subtitle">Apartment listings and notes</div>
        </div>
        <button className="add-btn" onClick={() => addHousing()}>
          + Add Listing
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Neighbourhood</th>
              <th>Rent</th>
              <th>Beds</th>
              <th>Commute T</th>
              <th>Commute O</th>
              <th>Stage</th>
              <th>Score</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {housing.map((d, i) => (
              <tr key={i}>
                <td>
                  <textarea
                    value={d.address || ""}
                    onChange={(e) =>
                      updateHousing(i, { address: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    value={d.neighbourhood || ""}
                    onChange={(e) =>
                      updateHousing(i, { neighbourhood: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    value={d.rent || ""}
                    onChange={(e) => updateHousing(i, { rent: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    value={d.beds || ""}
                    onChange={(e) => updateHousing(i, { beds: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    value={d.commuteT || ""}
                    onChange={(e) =>
                      updateHousing(i, { commuteT: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    value={d.commuteO || ""}
                    onChange={(e) =>
                      updateHousing(i, { commuteO: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    value={d.stage || ""}
                    onChange={(e) =>
                      updateHousing(i, { stage: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    value={d.score || ""}
                    onChange={(e) =>
                      updateHousing(i, { score: e.target.value })
                    }
                  />
                </td>
                <td>
                  <textarea
                    value={d.notes || ""}
                    onChange={(e) =>
                      updateHousing(i, { notes: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => removeHousing(i)}>
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Housing;
