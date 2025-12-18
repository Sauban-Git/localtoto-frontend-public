
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import AnimatedBackground from '@/components/animatedBackground';
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';


const ChevronDown = ({ size = 20, color = "#6b7280" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9l6 6 6-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronUp = ({ size = 20, color = "#6b7280" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 15l-6-6-6 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I book an e-rickshaw ride?',
      answer:
        'You can book a ride through our mobile app, website, or by calling our customer service. Simply enter your pickup and drop locations, select the type of ride, and confirm your booking.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'We accept cash, credit/debit cards, UPI, and mobile wallets. You can choose your preferred payment method while booking or at the end of your ride.',
    },
    {
      question: 'Is Local ToTo available 24/7?',
      answer:
        'Yes, Local ToTo services are available 24/7 in most cities. However, availability might vary depending on your location and the number of active drivers nearby.',
    },
    {
      question: 'How can I become a Local ToTo driver?',
      answer:
        "To become a driver partner, you need to have a valid driver's license, vehicle registration, and insurance. Visit our 'Become a Driver' page or download the driver app to start the registration process.",
    },
    {
      question: 'Are there any cancellation charges?',
      answer:
        'We have a flexible cancellation policy. Cancellations made within 1 minute of booking are free. After that, a nominal cancellation fee may apply depending on the driver’s distance traveled.',
    },
    {
      question: 'How is the fare calculated?',
      answer:
        'Our fares are calculated based on the distance traveled, time taken, and the current demand. Base fare + Distance fare + Time fare + Any applicable taxes or fees = Total fare.',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <AnimatedBackground />
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Frequently Asked Questions</Text>
          <Text style={styles.subtitle}>
            Find answers to the most common questions about our services
          </Text>
        </View>

        <View style={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.card}>
              <Pressable onPress={() => toggleFAQ(index)} style={styles.faqButton}>
                <Text style={styles.question}>{faq.question}</Text>
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </Pressable>


              {openIndex === index && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                  layout={Layout.springify()}
                  style={styles.answerBox}
                >
                  <Text style={styles.answer}>{faq.answer}</Text>
                </Animated.View>
              )}

            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Still have questions?{" "}</Text>
          <Pressable style={styles.contactButton}>
            <Text style={styles.contactText}>Contact Support</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },

  faqContainer: {
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  faqButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
  },
  question: {
    fontSize: 17,
    color: '#111827',
    fontWeight: '600',
    flex: 1,
    paddingRight: 10,
  },
  answerBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  answer: {
    color: '#374151',
    fontSize: 15,
  },

  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#6b7280',
    marginBottom: 8,
  },
  contactButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  contactText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
