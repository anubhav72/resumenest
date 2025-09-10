import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import SkillsInputGroup from "../reusable/SkillsInputGroup";
import SkillsRow from "../reusable/SkillsRow";
import { FiEdit } from "react-icons/fi";
import { PiClockCounterClockwise } from "react-icons/pi";
import Modal from "../reusable/Modal";
import toast from "react-hot-toast";
import { MdOutlineDelete, MdOutlineAddCircleOutline } from "react-icons/md";

export default function ResumeBuilder() {
  let initialState = {
    info: {
      name: "",
      updateAt: "",
      createdAt: "",
    },

    personal: {
      fullName: "",
      email: "",
      phone: "",
      jobTitle: "",
      linkedin: "",
      profileUrl: "",
      objective: "",
    },
    education: [
      {
        degree: "",
        institution: "",
        year: "",
        city: "",
      },
    ],
    experience: [
      {
        title: "",
        company: "",
        location: "",
        startAndEnd: "",
        description: "",
      },
    ],
    skills: {
      programmingLanguages: [],
      frameworks: [],
      tools: [],
      databases: [],
    },
    projects: [{ name: "", tech: [], description: "", link: "" }],
  };

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("resumeData");
    return saved ? JSON.parse(saved) : initialState;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempName, setTempName] = useState(data.info.name);
  const previewRef = useRef();

  const handleChange = (section, e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };
  const handleArrayChange = (section, index, e) => {
    const { name, value } = e.target;
    setData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray[index] = {
        ...updatedArray[index],
        [name]: value,
      };
      return { ...prev, [section]: updatedArray };
    });
  };
  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", institution: "", year: "", city: "" }, // use "city" instead of "grade" since that's in your state
      ],
    }));
  };
  const removeEducation = (index) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };
  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: "",
          company: "",
          location: "",
          startAndEnd: "",
          description: "",
        },
      ],
    }));
  };
  const removeExperience = (index) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };
  const addProjects = () => {
    setData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", tech: [], description: "", link: "" },
      ],
    }));
  };
  const removeProjects = (index) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };
  const addSkills = (newSkills, type) => {
    setData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: newSkills,
      },
    }));
  };
  const formatText = (text) => {
    let formatted = text.trim();

    // Convert bullet points (- )
    formatted = formatted.replace(/^- (.*)$/gm, "<li>$1</li>");
    if (/<li>/.test(formatted)) {
      // Add Tailwind classes here 👇
      formatted = formatted.replace(
        /(<li>.*<\/li>)/gs,
        `<ul class="list-disc ml-4">$1</ul>`
        // `<ul class="list-disc list-inside ml-4">$1</ul>`
      );
    }

    // Bold: _text_
    formatted = formatted.replace(/_(.*?)_/g, "<strong>$1</strong>");

    // Italic: *text*
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Wrap plain lines in <p>
    formatted = formatted
      .split("\n")
      .map((line) =>
        line.match(/^<li>|<\/li>|<ul|<\/ul>/) ? line : `<p>${line}</p>`
      )
      .join("");

    return formatted;
  };
  const saveDraft = () => {
    localStorage.setItem("resumeData", JSON.stringify(data));
    toast.success("Saved your details")
  };
  const downloadPDF = () => {
    if (!previewRef.current) return;

    html2canvas(previewRef.current, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0); // high quality
      const pdf = new jsPDF("p", "mm", "a4"); // A4 page, portrait
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Convert canvas to A4 size while keeping aspect ratio
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let position = 0;
      if (imgHeight <= pdfHeight) {
        // Single page
        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          "",
          "FAST"
        );
      } else {
        // Multi-page handling
        let heightLeft = imgHeight;
        while (heightLeft > 0) {
          pdf.addImage(
            imgData,
            "PNG",
            0,
            position,
            imgWidth,
            imgHeight,
            "",
            "FAST"
          );
          heightLeft -= pdfHeight;
          position -= pdfHeight;
          if (heightLeft > 0) {
            pdf.addPage();
          }
        }
      }

      pdf.save("CV.pdf");
    });
  };
  const handleSave = () => {
    if (!tempName.trim()) {
      toast.error("Resume name is required!");
      return;
    }

    setData((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        name: tempName.trim(),
        updateAt: new Date().toISOString(),
        createdAt: prev.info.createdAt || new Date().toISOString(),
      },
    }));

    setIsModalOpen(false); // close modal after save
  };
  const handleCancel = () => {
    setTempName(data.info.name); // clear input box
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("resumeData") || !data.info.name) {
      setIsModalOpen(true);
    }
  }, []);
  useEffect(() => {
  const handleKeyDown = (e) => {
    // Check for Ctrl+S (Windows/Linux) or Cmd+S (Mac)
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault(); // Prevent browser "Save Page"
      saveDraft();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [data]); // re-bind if data changes


  return (
    <div className="min-h-screen bg-[#d6f5e7] text-gray-900 font-sans">
      <header className="max-w-full bg-[#072721] flex justify-center py-1">
        <div className="max-w-7xl  w-full  flex justify-between">
          <h1 className="text-4xl font-bold text-white">ResumeNest</h1>
        </div>
      </header>

      <section className="max-w-full mb-8 bg-[#c3efdc] flex justify-center py-8">
        <div className="max-w-7xl w-full  flex justify-between ">
          <div className="flex items-end">
            <div className="flex items-center">
              <p className="text-[24px] mr-2">{data?.info?.name}</p>
              <FiEdit onClick={() => setIsModalOpen(true)} />
              <Modal
                isOpen={isModalOpen}
                onClose={() => {
                  tempName
                    ? setIsModalOpen(false)
                    : toast.error("Resume name is required!");
                  // setIsModalOpen(false);
                }}
                title="Resume Name"
                content={
                  <div>
                    <p className="mb-2 capitalize">
                      Provide a text to change resume's name
                    </p>
                    <input
                      type="text"
                      name="name"
                      placeholder="Resume Name"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="border rounded-lg p-1 w-full"
                    />
                    <div className="mt-4 flex justify-end gap-3">
                      {data.info.name && (
                        <button
                          className="px-4 py-2 bg-[#229477] rounded hover:bg-[#48bf9d] text-white"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        className="px-4 py-2 bg-[#0f453b] text-white rounded hover:bg-[#115446]  "
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                }
              />
            </div>
            {/* <div className="flex items-center ml-5">
              <PiClockCounterClockwise />
              <p className="text-[12px] ml-2">{data.info.createdAt}</p>
              <p className="text-[12px] ml-2">Updated 19 mins ago</p>
            </div> */}
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={saveDraft}
              className=" mr-2 bg-[#115446] hover:bg-[#17846a] text-white px-5 py-2 rounded-lg shadow-lg transition"
            >
              Save Draft
            </button>
            <button
              onClick={downloadPDF}
              className="bg-[#115446] hover:bg-[#17846a] text-white px-5 py-2 rounded-lg shadow-lg transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <section className="bg-[#f2fbf7] rounded-xl shadow-lg p-6 overflow-auto max-h-[90vh]">
          <h2 className="text-2xl font-semibold mb-6 text-[#072721]">
            Enter Your Details
          </h2>

          {/* Personal Info */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-[#247151]">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={data.personal.fullName}
                onChange={(e) => handleChange("personal", e)}
                className="border rounded-lg p-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={data.personal.email}
                onChange={(e) => handleChange("personal", e)}
                className="border rounded-lg p-2"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={data.personal.phone}
                onChange={(e) => handleChange("personal", e)}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                name="jobTitle"
                placeholder="jobTitle"
                value={data.personal.jobTitle}
                onChange={(e) => handleChange("personal", e)}
                className="border rounded-lg p-2"
              />
              <input
                type="url"
                name="linkedin"
                placeholder="LinkedIn URL"
                value={data.personal.linkedin}
                onChange={(e) => handleChange("personal", e)}
                className="border rounded-lg p-2 md:col-span-2"
              />
              <textarea
                name="objective"
                placeholder="Objective / Summary"
                rows={4}
                value={data.personal.objective}
                onChange={(e) => handleChange("personal", e)}
                className="border rounded-lg p-2 md:col-span-2"
              />
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-[#247151]">
              Education
            </h3>
            {data.education.map((edu, i) => (
              <div className="grid grid-col-1 gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-[#247151] text-sm">Education - {i + 1}</p>

                  <MdOutlineDelete
                    onClick={() => removeEducation(i)}
                    className=" text-2xl text-[#229477] hover:text-[#247151] cursor-pointer"
                  />
                </div>
                <div
                  key={i}
                  className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <input
                    type="text"
                    name="degree"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleArrayChange("education", i, e)}
                    className="border rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="institution"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => handleArrayChange("education", i, e)}
                    className="border rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="year"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleArrayChange("education", i, e)}
                    className="border rounded-lg p-2"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="city"
                    value={edu.city}
                    onChange={(e) => handleArrayChange("education", i, e)}
                    className="border rounded-lg p-2"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="bg-[#215a43] hover:bg-[#247151] text-white px-4 py-2 rounded-lg transition"
            >
              Add Education
            </button>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-[#247151]">
              Work Experience
            </h3>
            {data.experience.map((exp, i) => (
              <div className="grid grid-col-1 gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-[#247151] text-sm">Experience - {i + 1}</p>
                  <MdOutlineDelete
                    onClick={() => removeExperience(i)}
                    className=" text-2xl text-[#229477] hover:text-[#247151] cursor-pointer"
                  />
                </div>
                <div key={i} className="mb-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) => handleArrayChange("experience", i, e)}
                    className="border rounded-lg p-2 mb-2 w-full"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleArrayChange("experience", i, e)}
                    className="border rounded-lg p-2 mb-2 w-full"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <input
                      type="text"
                      name="location"
                      placeholder="Location Date"
                      value={exp.location}
                      onChange={(e) => handleArrayChange("experience", i, e)}
                      className="border rounded-lg p-2"
                    />
                    <input
                      type="text"
                      name="startAndEnd"
                      placeholder="Start - End Date"
                      value={exp.startAndEnd}
                      onChange={(e) => handleArrayChange("experience", i, e)}
                      className="border rounded-lg p-2"
                    />
                  </div>
                  <textarea
                    name="description"
                    placeholder="Description"
                    rows={3}
                    value={exp.description}
                    onChange={(e) => handleArrayChange("experience", i, e)}
                    className="border rounded-lg p-2 w-full mb-2"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="bg-[#215a43] hover:bg-[#247151] text-white px-4 py-2 rounded-lg transition"
            >
              Add Experience
            </button>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-[#247151]">Skills</h3>
            <div className="grid grid-cols-2 gap-2">
              <SkillsInputGroup
                label="Programming Languages"
                skills={data.skills.programmingLanguages}
                setSkills={(newSkills) =>
                  addSkills(newSkills, "programmingLanguages")
                }
              />
              <SkillsInputGroup
                label="Libraries / Frameworks"
                skills={data.skills.frameworks}
                setSkills={(newSkills) => addSkills(newSkills, "frameworks")}
              />
              <SkillsInputGroup
                label="Tools / Platforms"
                skills={data.skills.tools}
                setSkills={(newSkills) => addSkills(newSkills, "tools")}
              />
              <SkillsInputGroup
                label="Databases"
                skills={data.skills.databases}
                setSkills={(newSkills) => addSkills(newSkills, "databases")}
              />
            </div>
          </div>

          {/* Projects */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-[#247151]">
              Projects
            </h3>
            {data.projects.map((proj, i) => (
              <div className="grid grid-col-1 gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-[#247151] text-sm">Project - {i + 1}</p>
                  <MdOutlineDelete
                    onClick={() => removeProjects(i)}
                    className=" text-2xl text-[#229477] hover:text-[#247151] cursor-pointer"
                  />
                </div>
                <div key={i} className="mb-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Project Name"
                    value={proj.name}
                    onChange={(e) => handleArrayChange("projects", i, e)}
                    className="border rounded-lg p-2 mb-2 w-full"
                  />
                  <SkillsInputGroup
                    label="Tech"
                    skills={proj.tech}
                    //   setSkills={(e)=>handleProjectChange(i, e)}
                    setSkills={(newTech) => {
                      setData((prev) => {
                        const newProjects = [...prev.projects];
                        newProjects[i] = {
                          ...newProjects[i],
                          tech: newTech,
                        };
                        return { ...prev, projects: newProjects };
                      });
                    }}
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    rows={3}
                    value={proj.description}
                    onChange={(e) => handleArrayChange("projects", i, e)}
                    className="border rounded-lg p-2 w-full mb-2"
                  />
                  <input
                    type="url"
                    name="link"
                    placeholder="Project Link (optional)"
                    value={proj.link}
                    onChange={(e) => handleArrayChange("projects", i, e)}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addProjects}
              className="bg-[#215a43] hover:bg-[#247151] text-white px-4 py-2 rounded-lg transition"
            >
              Add Project
            </button>
          </div>
        </section>

        {/* Preview Section */}
        <section className="bg-white rounded-xl shadow-lg   max-h-[90vh] overflow-auto ">
          <h2 className="text-2xl font-semibold mb-6 ps-2 text-[#072721]">
            CV Preview
          </h2>
          <div
            ref={previewRef}
            // className="px-8 py-3 font-sans text-[10px] "
            className="px-8 py-3 font-sans text-[10px] max-w-[595px]"
          >
            {/* data.Personal info  */}
            <div className="mb-1 flex items-center flex-col ">
              <h1 className="text-[24px]">
                {data.personal.fullName || "Your Name"}
              </h1>
              <div className="flex flex-col items-center ">
                <p className="text-gray-700">
                  {data.personal.jobTitle || "job Title"}
                </p>
                <p className="text-gray-700">
                  {data.personal.email || "Email"} |{" "}
                  {data.personal.phone || "Phone"} |{" "}
                </p>
              </div>
              {/* LinkedIn */}
              <div>
                {data.personal.linkedin && (
                  <p className="text-[12px] text-[#247151] underline">
                    <a
                      href={data.personal.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                  </p>
                )}
              </div>
              {/* Profile Summary  */}
            </div>

            {/* profile Summary */}
            <div className="mb-1">
              <h3 className="text-[12px] font-bold text-[#363636] border-b border-[#363636] pb-2">
                Profile Summary
              </h3>
              <p className="mt-1 line  leading-3">
                {data.personal.objective || "Objective / Summary..."}
              </p>
            </div>

            {/* Education */}
            <div className="mb-1">
              <h3 className="text-[12px] font-bold text-[#363636] border-b border-[#363636] pb-2">
                Education
              </h3>
              {data?.education.length === 0 && <p>No education added.</p>}
              {data?.education.map((edu, i) =>
                edu.degree || edu.institution || edu.year || edu.city ? (
                  <div
                    key={i}
                    className={`ms-1 mt-1 flex justify-between items-start`}
                  >
                    <div className="flex flex-col items-start ">
                      <strong>{edu.degree}</strong>
                      <p>{edu.institution}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p>{edu.city}</p>
                      <p>{edu.year}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>

            {/* Experience */}
            <div className="mb-1">
              <h3 className="text-[12px] font-bold text-[#363636] border-b border-[#363636]  pb-2">
                Experience
              </h3>
              {data?.experience.length === 0 && <p>No experience added.</p>}
              {data?.experience.map((exp, i) =>
                exp.title ||
                exp.company ||
                exp.startAndEnd ||
                exp.description ? (
                  <div key={i} className="mt-1 ms-1">
                    <div className="flex justify-between">
                      <p>
                        <strong>{exp.title}</strong> |{" "}
                        <strong>{exp.company}</strong>
                      </p>
                      <p>
                        {exp.location} | {exp.startAndEnd}
                      </p>
                    </div>
                    <p
                      className=""
                      dangerouslySetInnerHTML={{
                        __html: formatText(exp.description),
                      }}
                    />
                  </div>
                ) : null
              )}
            </div>

            {/* Skills */}
            <div className="mb-1">
              <h3 className="text-[12px] font-bold text-[#363636] border-b border-[#363636] pb-2">
                Skills
              </h3>
              <div className="mt-1 ms-1">
                <SkillsRow
                  label="Programming Languages"
                  items={data.skills.programmingLanguages}
                />
                <SkillsRow
                  label="Libraries / Frameworks"
                  items={data.skills.frameworks}
                />
                <SkillsRow
                  label="Tools / Platforms"
                  items={data.skills.tools}
                />
                <SkillsRow label="Databases" items={data.skills.databases} />
              </div>
            </div>

            {/* Projects */}
            <div className="mb-1">
              <h3 className="text-[12px] font-bold text-[#363636] border-b border-[#363636]  pb-2">
                Projects
              </h3>
              {data.projects.length === 0 && <p>No projects added.</p>}
              {data.projects.map((proj, i) =>
                proj.name || proj.description ? (
                  <div className="flex flex-col mt-1 ms-1">
                    <div className="flex justify-between">
                      <div className="flex min-w-40 ">
                        <strong>{proj.name} </strong>&nbsp;|&nbsp;
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#072721] underline"
                          >
                            Link
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap italic">
                        <SkillsRow
                          label={"Project"}
                          items={proj.tech}
                          section="projects"
                        />
                      </div>
                    </div>

                    {/* <div className="col-span-3">{proj.description}</div> */}
                    <div
                      className="flex mt-1"
                      dangerouslySetInnerHTML={{
                        __html: formatText(proj.description),
                      }}
                    />
                  </div>
                ) : null
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
