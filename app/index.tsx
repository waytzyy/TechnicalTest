import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Carousel from "../components/Carousel";
import ExpandedCard from "../components/ExpandedCard";

const DATA = [
  {
    id: "1",
    title: "Power Lifting",

    image: "https://images.unsplash.com/photo-1534368420009-621bfab424a8?q=80&w=1000",
    content: "Build strength through squats, deadlifts, and bench presses.",
    rating: 4.8,
    category: "Strength Training",
    location: "South Jakarta",
    date: "2024-03-20",
    readTime: "5 min",
    highlights: ["Feature 1", "Feature 2"],
    description: "Technical Test"
  },
  {
    id: "2",
    title: "Cardio Blast",
    image:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1000",
    content: "Burn fat and boost stamina quickly.",
    rating: 4.7,
    category: "Cardio",
    location: "Central Jakarta",
    date: "2024-03-20",
    readTime: "4 min",
    highlights: ["Feature 1", "Feature 2"],
    description: "Technical Test"
    
  },
  {
    id: "3",
    title: "Yoga Flow",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000",
    content: "Enhance flexibility and peace of mind.",
    rating: 4.6,
    category: "Mind & Body",
    location: "West Jakarta",
    date: "2024-03-20",
    readTime: "6 min",
    highlights: ["Feature 1", "Feature 2"],
  },  {
    id: "4",
    title: "Yoga Flow",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000",
    content: "Enhance flexibility and peace of mind.",
    rating: 4.6,
    category: "Mind & Body",
    location: "West Jakarta",
    date: "2024-03-20",
    readTime: "6 min",
    highlights: ["Feature 1", "Feature 2"],
    description: "Technical Test"
  },

  
];

export default function App() {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );

  const handleCardPress = (index: number) => {
    setSelectedCardIndex(index);
  };

  const handleClose = () => {
    setSelectedCardIndex(null);
  };

  return (
    <View style={styles.container}>
      {selectedCardIndex !== null ? (
        <ExpandedCard item={DATA[selectedCardIndex]} onClose={handleClose} />
      ) : (
        <Carousel data={DATA} onCardPress={handleCardPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(190, 202, 196)",
  },
});