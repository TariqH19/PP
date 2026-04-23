import React from "react";
import { useTracker } from "../context/TrackerContext";

const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = [
  "Not Started",
  "Researching",
  "In Progress",
  "Waiting",
  "Complete",
  "Blocked",
];

const TaskTable = ({ section }) => {
  const { tasks, addTask, updateTask, removeTask } = useTracker();
  const rows = tasks[section] || [];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}>
        <div style={{ fontWeight: 600 }}>
          {section[0].toUpperCase() + section.slice(1)}
        </div>
        <button className="add-btn" onClick={() => addTask(section)}>
          + Add Task
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Deadline</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <textarea
                    value={r.description}
                    onChange={(e) =>
                      updateTask(section, i, { description: e.target.value })
                    }
                  />
                </td>
                <td>
                  <select
                    value={r.category}
                    onChange={(e) =>
                      updateTask(section, i, { category: e.target.value })
                    }>
                    <option value="Both">Both</option>
                    <option value="Tariq">Tariq</option>
                    <option value="Olivia">Olivia</option>
                  </select>
                </td>
                <td>
                  <select
                    value={r.priority}
                    onChange={(e) =>
                      updateTask(section, i, { priority: e.target.value })
                    }>
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={r.status}
                    onChange={(e) =>
                      updateTask(section, i, { status: e.target.value })
                    }>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    value={r.deadline}
                    onChange={(e) =>
                      updateTask(section, i, { deadline: e.target.value })
                    }
                  />
                </td>
                <td>
                  <textarea
                    value={r.notes}
                    onChange={(e) =>
                      updateTask(section, i, { notes: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => removeTask(section, i)}>
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

export default TaskTable;
