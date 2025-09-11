import React from "react";
import { View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import PDFSkillsRow from "./PDFSkillsRow"; // your reusable skills row for pdf

const styles = StyleSheet.create({
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
const PDFDescription = ({ desc }) => {
  if (!desc) return null; // guard
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
  return (
    <>
      {parseDescription(desc).map((line, idx) =>
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
      )}
    </>
  );
};

export default PDFDescription;
