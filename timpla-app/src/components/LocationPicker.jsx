import React, { useState, useRef, useEffect } from 'react';
import { LOCATIONS } from '../data/routes.js';

<<<<<<< HEAD
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
=======
function LocationDropdown({ label, value, onChange, placeholder, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
>>>>>>> 1b94f886d86d9a06d6fbd51ea3d07bfd69cff4cb
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(search.toLowerCase()) ||
    loc.area.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLoc = LOCATIONS.find(l => l.id === value);

  return (
<<<<<<< HEAD
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

=======
    <div className="location-dropdown" ref={dropdownRef}>
      <label className="dropdown-label" htmlFor={id}>{label}</label>
>>>>>>> 1b94f886d86d9a06d6fbd51ea3d07bfd69cff4cb
      <button
        className={`dropdown-trigger ${isOpen ? 'open' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        id={id}
        type="button"
      >
        <span className="dropdown-icon">{label.includes('From') ? '📍' : '🎯'}</span>
        <span className="dropdown-text">
          {selectedLoc ? selectedLoc.name : placeholder}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <input
            className="dropdown-search"
            type="text"
            placeholder="Search location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <div className="dropdown-list">
            {filtered.map(loc => (
              <button
                key={loc.id}
                className={`dropdown-item ${loc.id === value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(loc.id);
                  setIsOpen(false);
                  setSearch('');
                }}
                type="button"
              >
                <span className="item-name">{loc.name}</span>
                <span className="item-area">{loc.area}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="dropdown-empty">No locations found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LocationPicker({ origin, destination, onOriginChange, onDestChange, onCalculate, isLoading }) {
  const canCalculate = origin && destination && origin !== destination;

  const handleSwap = () => {
    onOriginChange(destination);
    onDestChange(origin);
  };

  return (
    <section className="location-picker">
      <div className="picker-card">
        <LocationDropdown
          label="📍 From"
          value={origin}
          onChange={onOriginChange}
          placeholder="Where are you?"
          id="origin-picker"
        />

        <button className="swap-btn" onClick={handleSwap} title="Swap locations" type="button" id="swap-button">
          <span className="swap-icon">⇅</span>
        </button>

        <LocationDropdown
          label="🎯 To"
          value={destination}
          onChange={onDestChange}
          placeholder="Where to?"
          id="destination-picker"
        />

        <button
          className={`calculate-btn ${canCalculate ? 'active' : 'disabled'}`}
          onClick={canCalculate ? onCalculate : undefined}
          disabled={!canCalculate}
          id="calculate-button"
          type="button"
        >
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <span className="btn-text">TIMPLA!</span>
              <span className="btn-sub">Mix my route</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
