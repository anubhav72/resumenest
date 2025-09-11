import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import PDFSkillsRow from "./pdfReusables/PDFSkillsRow";
import PDFProjects from "./pdfReusables/PDFProjects";
import PDFDescription from "./pdfReusables/PDFDescription";

// Styles (similar to your Tailwind)
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  section: { marginBottom: 10 },
  heading: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#363636",
    borderBottom: "1pt solid #363636",
    paddingBottom: 2,
    marginBottom: 4,
  },
  name: { fontSize: 24, textAlign: "center" },
  jobTitle: { textAlign: "center", fontSize: 10, color: "gray", marginTop:"12px" },
  contact: { textAlign: "center", fontSize: 10, color: "gray" },
  link: {
    textAlign: "center",
    fontSize: 10,
    color: "#247151",
    textDecoration: "underline",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  small: { fontSize: 10 },
});

const ResumePDF = ({ data }) => {
  if (!data) return null; // guard
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.name}>
            {data.personal.fullName || "Your Name"}
          </Text>
          <Text style={styles.jobTitle}>
            {data.personal.jobTitle || "Job Title"}
          </Text>
          <Text style={styles.contact}>
            {data.personal.email || "Email"} | {data.personal.phone || "Phone"}
          </Text>
          {data.personal.linkedin && (
            <Link src={data.personal.linkedin} style={styles.link}>
              LinkedIn
            </Link>
          )}
        </View>

        {/* Profile Summary */}
        <View style={styles.section}>
          <Text style={styles.heading}>Profile Summary</Text>
          <Text>{data.personal.objective || "Objective / Summary..."}</Text>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.heading}>Education</Text>
          {data?.education.length === 0 && <Text>No education added.</Text>}
          {data?.education.map((edu, i) =>
            edu.degree || edu.institution || edu.year || edu.city ? (
              <View key={i} style={styles.row}>
                <View>
                  <Text style={{ fontWeight: "bold" }}>{edu.degree}</Text>
                  <Text>{edu.institution}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text>{edu.city}</Text>
                  <Text>{edu.year}</Text>
                </View>
              </View>
            ) : null
          )}
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.heading}>Experience</Text>
          {data.experience.length === 0 && <Text>No experience added.</Text>}
          {data?.experience.map((exp, i) =>
            exp.title || exp.company || exp.startAndEnd || exp.description ? (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={styles.row}>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>{exp.title}</Text> |{" "}
                    <Text style={{ fontWeight: "bold" }}>{exp.company}</Text>
                  </Text>
                  <Text>
                    {exp.location} | {exp.startAndEnd}
                  </Text>
                </View>
                {/* <Text>{exp.description}</Text> */}
                <PDFDescription desc={exp.description || ""} />
              </View>
            ) : null
          )}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.heading}>Skills</Text>
          <PDFSkillsRow
            label="Programming Languages"
            items={data.skills.programmingLanguages}
          />
          <PDFSkillsRow
            label="Libraries / Frameworks"
            items={data.skills.frameworks}
          />
          <PDFSkillsRow label="Tools / Platforms" items={data.skills.tools} />
          <PDFSkillsRow label="Databases" items={data.skills.databases} />
        </View>

        {/* Projects */}
        <PDFProjects data={data} />
        {/* <View style={styles.section}>
        <Text style={styles.heading}>Projects</Text>
        {data.projects.length === 0 && <Text>No projects added.</Text>}
        {data.projects.map((proj, i) =>
          proj.name || proj.description ? (
            <View key={i} style={{ marginBottom: 6 }}>
              <View style={styles.row}>
                <Text style={{ fontWeight: "bold" }}>{proj.name}</Text>
                {proj.link && (
                  <Link
                    src={proj.link}
                    style={{ color: "#072721", textDecoration: "underline" }}
                  >
                    Link
                  </Link>
                )}
              </View>
              <Text>{proj.tech.join(", ")}</Text>
              <Text>{proj.description}</Text>
            </View>
          ) : null
        )}
      </View> */}
      </Page>
    </Document>
  );
};

export default ResumePDF;
