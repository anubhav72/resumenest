import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    width: 140, // fixed width so all labels align
  },
  items: {
    flex: 1, // take the remaining space
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    fontSize: 10,
  },
});

export default function PDFSkillsRow({ label, items, section }) {
  return (
    <View style={styles.row}>
      {section !== "projects" && (
        <Text style={styles.label}>{label}:</Text>
      )}
      <View
        style={[
          styles.items,
          section === "projects" && { justifyContent: "flex-end" },
        ]}
      >
        {items.map((ele, i) => (
          <Text key={i} style={styles.item}>
            {ele}
            {i !== items.length - 1 ? ", " : ""}
          </Text>
        ))}
      </View>
    </View>
  );
}
