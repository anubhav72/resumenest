import React from "react";

export default function SkillsRow({ label, items, section }) {
  return (
    <div className="flex">
      {section !== "projects" && (
        <p className=" text-[10px] font-bold min-w-36">{label}:</p>
      )}
      <div
        className={`flex flex-wrap  ${
          section === "projects" ? "justify-end" : ""
        }`}
      >
        {items.map((ele, i) => (
          <span key={i}>
            {ele}
            {i !== items.length - 1 ? `,\u00A0` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
