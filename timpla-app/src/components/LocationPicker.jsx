import React, { useState } from "react";
import { NODES } from "../data/routes";
import "./LocationPicker.css";

function LocationPicker({ onCalculate }) {
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");

  const handleCalculate = () => {
    if (startNode && endNode && startNode !== endNode) {
      onCalculate(startNode, endNode);
    }
  };

  const nodeOptions = Object.values(NODES).map((node) => (
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
            onChange={(e) => setStartNode(e.target.value)}
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
            onChange={(e) => setEndNode(e.target.value)}
          >
            <option value="" disabled>
              Select destination...
            </option>
            {nodeOptions}
          </select>
        </div>
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
