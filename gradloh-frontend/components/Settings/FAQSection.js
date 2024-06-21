import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { AntDesign } from '@expo/vector-icons';

const FAQItem = ({ question, answer }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.faqItemHeader}>
        <Text style={styles.faqItemQuestion}>{question}</Text>
        <AntDesign name={isCollapsed ? 'down' : 'up'} size={20} />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.faqItemContent}>
          <Text>{answer}</Text>
        </View>
      </Collapsible>
    </View>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "What is the difference between GradLoh and NUSMods?",
      answer: "GradLoh is significantly different to NUSMods in the way that it is developed to be a more generalised application made for the mobile platform to allow NUS students to keep track of their graduation, on top of their modules."
    },
    // Add more FAQs here
  ];

  return (
    <View style={styles.faqContainer}>
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  faqContainer: {
    marginTop: 20,
  },
  faqItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    paddingBottom: 10,
  },
  faqItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqItemQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  faqItemContent: {
    marginTop: 10,
  },
});

export default FAQSection;
