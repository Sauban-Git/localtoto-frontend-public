
export default {
  expo: {
    name: "frontend-public-localtot",
    slug: "frontend-public-localtot",
    version: "1.0.0",

    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    scheme: "frontendpubliclocaltot",
    icon: "./assets/images/icon.png",

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.frontendpubliclocaltot"
    },

    android: {
      package: "com.anonymous.frontendpubliclocaltot",
      permissions: ["POST_NOTIFICATIONS"],

      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      },

      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },

      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ],
      "expo-secure-store"
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },

    extra: {
      EXPO_PUBLIC_API_KEY: process.env.EXPO_PUBLIC_API_KEY,
      EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
      EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      EXPO_PUBLIC_OLA_MAPS_PROJECT_ID: process.env.EXPO_PUBLIC_OLA_MAPS_PROJECT_ID,
      EXPO_PUBLIC_OLA_MAPS_API_KEY: process.env.EXPO_PUBLIC_OLA_MAPS_API_KEY,

      eas: {
        projectId: "3817318d-b594-4bbd-ae5f-640855203d32"
      }
    },

    owner: "sauban007"
  }
};
