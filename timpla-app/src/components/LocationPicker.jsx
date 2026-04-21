import React, { useState } from "react";
import { NODES } from "../data/routes";
import "./LocationPicker.css";

function LocationPicker({ onCalculate, onNodesChange, preferences, onPreferencesChange }) {
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");

  const handleStartNodeChange = (e) => {
    setStartNode(e.target.value);
    onNodesChange?.();
  };

  const handleEndNodeChange = (e) => {
    setEndNode(e.target.value);
    onNodesChange?.();
  };

  const resolvedPreferences = preferences || { priority: "cheapest", avoidWalking: false };

  const handleCalculate = () => {
    if (startNode && endNode && startNode !== endNode) {
      onCalculate(startNode, endNode, resolvedPreferences);
    }
  };

  const nodeOptions = Object.values(NODES)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((node) => (
      <option key={node.id} value={node.id}>
        {node.name}
      </option>
    ));

  return (
    <section className="location-picker">
      <div className="picker-fields">
        <div className="field">
          <label htmlFor="start-node">Where are you?</label>
          <select
            id="start-node"
            value={startNode}
            onChange={handleStartNodeChange}
          >
            <option value="" disabled>
              Select starting point...
            </option>
            {nodeOptions}
          </select>
        </div>
        <div className="field">
          <label htmlFor="end-node">Where to?</label>
          <select
            id="end-node"
            value={endNode}
            onChange={handleEndNodeChange}
          >
            <option value="" disabled>
              Select destination...
            </option>
            {nodeOptions}
          </select>
        </div>
      </div>

      <div className="picker-toggles" style={{ display: preferences?.driverMode ? 'none' : 'block' }}>
        <label className="toggle">
          <input
            type="checkbox"
            checked={Boolean(resolvedPreferences.avoidWalking)}
            onChange={(e) =>
              onPreferencesChange?.({
                ...resolvedPreferences,
                avoidWalking: e.target.checked,
              })
            }
          />
          Avoid walking (when possible)
        </label>
      </div>

      <button
        className="calculate-btn"
        onClick={handleCalculate}
        disabled={!startNode || !endNode || startNode === endNode}
      >
        TIMPLA!
      </button>
    </section>
  );
}

export default LocationPicker;
