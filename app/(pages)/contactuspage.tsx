
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '@/services/api';
import { Ionicons, MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Select a subject',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await api.post('/adminapi/contact', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      Alert.alert('Success', "Thank you for contacting us! We'll get back to you soon.");
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>
      <Text style={styles.subheading}>
        We{`'`}d love to hear from you. Send us a message and we{`'`}ll respond as soon as possible.
      </Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <View style={styles.iconWrapper}><Feather name="mail" size={32} color="#16a34a" /></View>
          <Text style={styles.infoTitle}>Email</Text>
          <Text style={styles.infoText}>info@localtoto.org</Text>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.iconWrapper}><Feather name="phone-call" size={32} color="#16a34a" /></View>
          <Text style={styles.infoTitle}>Phone</Text>
          <Text style={styles.infoText}>+91 98765 43210</Text>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.iconWrapper}><Feather name="map-pin" size={32} color="#16a34a" /></View>
          <Text style={styles.infoTitle}>Address</Text>
          <Text style={styles.infoText}>Haveli Appartment, Rukanpura, Patna-800014</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="gray"
          value={formData.name}
          onChangeText={text => handleChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="gray"
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={text => handleChange('email', text)}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="gray"
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={text => handleChange('phone', text)}
        />

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formData.subject}
            onValueChange={value => handleChange('subject', value)}
            style={styles.picker}
          >
            <Picker.Item label="Select a subject" value="" />
            <Picker.Item label="General Inquiry" value="general" />
            <Picker.Item label="Customer Support" value="support" />
            <Picker.Item label="Booking Issue" value="booking" />
            <Picker.Item label="Feedback" value="feedback" />
            <Picker.Item label="Partnership" value="partnership" />
            <Picker.Item label="Other" value="other" />
          </Picker>
          <Feather
            name="chevron-down"
            size={20}
            color="#4b5563"
            style={styles.pickerIcon}
          />
        </View>

        <TextInput
          style={[styles.input, { height: 120 }]}
          placeholder="Message"
          value={formData.message}
          onChangeText={text => handleChange('message', text)}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <Feather name="send" size={22} color="white" />
              <Text style={styles.buttonText}>Send Message</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9fafb' },
  heading: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 10, textAlign: 'center' },
  subheading: { fontSize: 16, color: '#4b5563', marginBottom: 20, textAlign: 'center' },
  infoContainer: { flexDirection: 'column', gap: 12, marginBottom: 20 },
  infoBox: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  iconWrapper: { backgroundColor: '#d1fae5', borderRadius: 32, padding: 12, marginBottom: 8 },
  infoTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#111827' },
  infoText: { fontSize: 14, color: '#4b5563', textAlign: 'center' },
  formContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16, backgroundColor: '#fff' },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#111827', // text color
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
    pointerEvents: 'none',
  },
  button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16, marginLeft: 8 }
});

export default ContactUsPage;

