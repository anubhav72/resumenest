import React, { useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function SkillsInputGroup({ label, skills, setSkills }) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    if (input.trim() !== "") {
      setSkills([...skills, input.trim()]);
      setInput("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submit/line break
      addSkill();
    }
  };

  return (
    <div className="w-full mb-6">
      <label className="block text-sm font-semibold mb-2 text-[#247151]">
        {label}
      </label>

      {/* Input + Button */}
      <div className="relative w-full mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // ⬅️ listen for Enter
          placeholder={`Add ${label}`}
          className="flex-1 border rounded-lg p-2 pr-10 w-full"
        />

        <MdOutlineAddCircleOutline
          onClick={addSkill}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl text-[#215a43] hover:text-[#247151] cursor-pointer"
        />
      </div>

      {/* Skills List */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="flex items-center bg-[#95e0bf] text-[#215a43] px-3 py-1 rounded-full text-sm"
          >
            {skill}

            <IoMdCloseCircleOutline
              onClick={() => removeSkill(i)}
              className="ml-2 text-[#0b281d] hover:text-[#1d4a38] cursor-pointer  "
            />
          </span>
        ))}
      </div>
    </div>
  );
}
