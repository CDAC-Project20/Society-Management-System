import React from "react";
import FooterComp from "../components/FooterComp";

export default function NoticeComp() {
  const notices = [
    { text: "Maintenance due by 15th June 2026", type: "info" },
    { text: "Water supply will be interrupted on 20th June 2026", type: "warning" }
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Notice Board</h2>
      <div className="list-group w-75 mx-auto">
        {notices.map((n, i) => (
          <div key={i} className={`list-group-item list-group-item-${n.type}`}>
            {n.text}
          </div>
        ))}
      </div>
      <FooterComp />
    </div>
  );
}


