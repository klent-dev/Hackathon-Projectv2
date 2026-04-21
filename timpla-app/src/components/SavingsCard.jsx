import React from "react";
import "./SavingsCard.css";

function SavingsCard({ info }) {
  if (!info || info.savings <= 0) {
    return null;
  }

  const { cheapest, expensive, savings } = info;

  const expensiveMode =
    (expensive.legs ? expensive.legs[0].mode : expensive.mode) || "single ride";
  const expensiveFare =
    typeof expensive.totalFareMin === "number" ? expensive.totalFareMin : expensive.fare || expensive.totalFare;
  const cheapestFare =
    typeof cheapest.totalFareMin === "number" ? cheapest.totalFareMin : cheapest.totalFare;

  return (
    <div className="savings-card">
      <div className="savings-header">
        <p>
          You save{" "}
          <span className="savings-amount">
            ₱{Math.round(savings)}
          </span>
        </p>
      </div>
      <div className="savings-body">
        <div className="comparison">
          <div className="option">
            <span className="mode-label">{expensiveMode}</span>
            <span className="fare">₱{expensiveFare}</span>
          </div>
          <div className="vs">vs</div>
          <div className="option timpla">
            <span className="mode-label">Timpla</span>
            <span className="fare">₱{cheapestFare}</span>
          </div>
        </div>
      </div>
      <div className="savings-footer">
        That's ~₱{Math.round(savings * 20)}/month saved!
      </div>
    </div>
  );
}

export default SavingsCard;
