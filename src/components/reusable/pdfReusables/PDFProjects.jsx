import { View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import PDFSkillsRow from "./PDFSkillsRow"; // your reusable skills row for pdf
import PDFDescription from "./PDFDescription";

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 12,
    fontWeight: "bold",
    borderBottom: "1pt solid #363636",
    marginBottom: 4,
    paddingBottom: 2,
  },
  projectContainer: {
    marginTop: 4,
    marginBottom: 6,
  },
  projectRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  projectName: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: "60%",
    fontWeight: "bold",
    fontSize: 10,
    marginRight: 4,
  },
  link: {
    color: "#072721",
    textDecoration: "underline",
    fontSize: 10,
  },
  description: {
    fontSize: 10,
    marginTop: 2,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletSymbol: {
    fontSize: 10,
    marginRight: 4,
  },
  bulletText: {
    fontSize: 10,
    flex: 1,
  },
});

// Utility: parse description into array (bullets / plain text)
// const parseDescription = (text) => {
//   if (!text) return [];
//   return text.split("\n").map((line) => line.trim()).filter(Boolean);
// };

const parseDescription = (text) => {
  if (!text) return [];

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      // Bullet points
      if (line.startsWith("- ")) {
        line = line.replace(/^- /, "");
        return { type: "bullet", text: line };
      }

      // Handle bold (_text_) and italic (*text*) inline
      const parts = [];
      let remaining = line;

      // Regex to match _bold_ or *italic*
      const regex = /(_(.*?)_)|(\*(.*?)\*)/g;
      let match;
      let lastIndex = 0;

      while ((match = regex.exec(remaining)) !== null) {
        if (match.index > lastIndex) {
          // Text before the formatting
          parts.push({ text: remaining.slice(lastIndex, match.index) });
        }

        if (match[1]) {
          // Bold: _text_
          parts.push({ text: match[2], bold: true });
        } else if (match[3]) {
          // Italic: *text*
          parts.push({ text: match[4], italic: true });
        }

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < remaining.length) {
        parts.push({ text: remaining.slice(lastIndex) });
      }

      return { type: "text", parts };
    });
};

export default function PDFProjects({ data }) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Projects</Text>
      {data.projects.length === 0 && <Text>No projects added.</Text>}
      {data.projects.map((proj, i) =>
        proj.name || proj.description ? (
          <View key={i} style={styles.projectContainer}>
            {/* Top row: Project Name + Link + Tech */}
            <View style={styles.projectRow}>
              <View style={{ flexDirection: "row", width: "50%" }}>
                <Text style={styles.projectName}>{proj.name}</Text>
                {proj.link && (
                  <Link src={proj.link} style={styles.link}>
                    Link
                  </Link>
                )}
              </View>
              <View style={{ width: "50%" }}>
                <PDFSkillsRow
                  label={"Project"}
                  items={proj.tech}
                  section="projects"
                />
              </View>
            </View>

            {/* Description (supports bullets / plain text) */}
            {/* {parseDescription(proj.description).map((line, idx) =>
              line.type === "bullet" ? (
                <View key={idx} style={styles.bullet}>
                  <Text style={styles.bulletSymbol}>•</Text>
                  <Text style={styles.bulletText}>
                    {line.text.split(/(_.+?_|\*.+?\*)/g).map((chunk, i) => {
                      if (!chunk) return null;
                      if (chunk.startsWith("_") && chunk.endsWith("_")) {
                        return (
                          <Text key={i} style={{ fontWeight: "bold" }}>
                            {chunk.slice(1, -1)}
                          </Text>
                        );
                      } else if (chunk.startsWith("*") && chunk.endsWith("*")) {
                        return (
                          <Text key={i} style={{ fontStyle: "italic" }}>
                            {chunk.slice(1, -1)}
                          </Text>
                        );
                      } else {
                        return <Text key={i}>{chunk}</Text>;
                      }
                    })}
                  </Text>
                </View>
              ) : (
                <Text key={idx} style={styles.description}>
                  {line.parts.map((part, i) => (
                    <Text
                      key={i}
                      style={{
                        fontWeight: part.bold ? "bold" : "normal",
                        fontStyle: part.italic ? "italic" : "normal",
                      }}
                    >
                      {part.text}
                    </Text>
                  ))}
                </Text>
              )
            )} */}
            <PDFDescription desc={proj.description || ""} />
          </View>
        ) : null
      )}
    </View>
  );
}
