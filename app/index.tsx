import MyButton from "@/components/button"
import { useColors } from "@/hooks/useColors"
import { useRouter } from "expo-router"
import React from "react"
import { StyleSheet, View } from "react-native"
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'

const SplashScreen = () => {
  const c = useColors()
  const router = useRouter()

  return (
    <Animated.View style={[styles.container, { backgroundColor: c.primary }]}>

      <View>
        {/* Mapss */}
      </View>


      <Animated.Image entering={FadeIn.duration(700)} style={{ resizeMode: "contain", width: 200, height: 200, alignItems: "center" }} source={require("@/assets/images/rickshaw.png")} />
      <Animated.Text entering={FadeIn.duration(700)} style={[styles.title, { color: c.highlight }]}>Auto Booking{" "}</Animated.Text>
      <Animated.Text entering={FadeInDown.duration(700).springify()} style={[styles.text1, { color: c.highlight }]}>First e-Vehicle Mobility app</Animated.Text>

      <MyButton onPress={() => router.replace('/(auth)/signup')} title="GET STARTED" />

      <Animated.Text entering={FadeInDown.duration(700).springify()} style={[styles.text2, { color: c.highlight }]}>App by the drivers for the people</Animated.Text>
      <Animated.Text entering={FadeInDown.duration(700).springify()} style={[styles.text, { color: c.highlight }]}>Safety is our first priority</Animated.Text>
      <Animated.Text entering={FadeInDown.duration(700).springify()} style={[styles.text, { color: c.highlight }]}>Eco friendly</Animated.Text>
      <Animated.Text entering={FadeInDown.duration(700).springify()} style={[styles.text, { color: c.highlight }]}>Book an electric auto with Zero Commision</Animated.Text>
    </Animated.View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontStyle: "normal",
  },
  title: {
    textAlign: "center",
    fontSize: 40
  },
  text1: {
    textAlign: "center",
    paddingBottom: 40
  },
  text2: {
    textAlign: "center",
    paddingTop: 40
  },
  text: {
    textAlign: "center",
    fontSize: 10
  }
})
