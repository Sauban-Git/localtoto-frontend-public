
import * as Notifications from 'expo-notifications';
import * as Location from "expo-location"
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  useSharedValue
} from "react-native-reanimated";
import AnimatedBackground from "@/components/animatedBackground"
import api from "@/services/api";
import { useRideStore } from "@/stores/bookingConfirmStore";
import { useBookingStateStore } from "@/stores/rideStore";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native"
import LoadingOverlay from '@/components/loadingOverlay';
import MyButton from '@/components/button';
import LiveTrackMap from '@/components/liveTrackMap';
import Toast from 'react-native-toast-message';

type LocationState = Location.LocationObject | null;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  })
})

const Waiting = () => {

  // Notifications
  const [expoPushToken, setExpoPushToken] = useState('')
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([])
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined)

  const razorpayKey = process.env?.EXPO_PUBLIC_RAZORPAY_KEY_ID as string | undefined;
  const progressAnim = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value * 100}%`,
    };
  });
  const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

  const router = useRouter()
  const MAX_WAIT_SECONDS = 180; // 3 minutes
  const [expired, setExpired] = useState<boolean>(false);
  const [onlineDrivers, setOnlineDrivers] = useState<{ lat: number; lng: number }[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [location, setLocation] = useState<LocationState>(null)

  const rideData = useRideStore((state) => state.confirmationData)
  const [processing, setProcessing] = useState(false)

  // Booking states
  const [isBookingRide, setIsBookingRide] = useState<boolean>(false);
  const bookingId = useBookingStateStore((s: any) => s.bookingId);
  const setBookingId = useBookingStateStore((s: any) => s.setBookingId);
  const showBookingAnimation = useBookingStateStore((s: any) => s.showBookingAnimation);
  const setShowBookingAnimation = useBookingStateStore((s: any) => s.setShowBookingAnimation);
  const [driverAssigned, setDriverAssigned] = useState<boolean>(false);
  const [driverInfo, setDriverInfo] = useState<any>(null);

  // Waiting animation states
  const [waitingTime, setWaitingTime] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [searchStatus, setSearchStatus] = useState<string>('Finding drivers...');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [bootLoading, setBootLoading] = useState<boolean>(true);
  const progress = useSharedValue<number>(0);
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  //razorpay
  const [paymentPending, setPaymentPending] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('online');
  const amountDue = useMemo(() => rideData?.fare || 0, [rideData?.rideType, rideData?.fare])

  const loadScript = (src: string) =>
    new Promise<boolean>((resolve) => {
      if (document.querySelector(`script[src='${src}']`)) return resolve(true);
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('ride-status', {
        name: 'Ride Status',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
  }, []);

  // Send NEW status notification
  const showRideNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      identifier: "ride_waiting",
      content: {
        title,
        body,
        sound: true,
        sticky: true,          // Android only
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });
  };

  // Update EXISTING notification cleanly
  const updateRideNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      identifier: "ride_waiting",  // SAME ID → replaces existing one
      content: {
        title,
        body,
        sound: false,
        sticky: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });
  };

  useEffect(() => {
    if (!expired && showBookingAnimation) {
      const formattedTime = `${Math.floor(waitingTime / 60)
        .toString()
        .padStart(2, '0')}:${(waitingTime % 60).toString().padStart(2, '0')}`;

      updateRideNotification(
        "Ride in Progress 🚗",
        `Status: ${searchStatus}\nWaiting: ${formattedTime}`
      );
    }
  }, [waitingTime, searchStatus, expired, showBookingAnimation]);

  useEffect(() => {
    if (razorpayKey) {
      loadScript('https://checkout.razorpay.com/v1/checkout.js');
    }
  }, [razorpayKey]);

  useEffect(() => {
    const progress = waitingTime / MAX_WAIT_SECONDS; // value between 0 and 1
    progressAnim.value = withTiming(progress, { duration: 500 });
  }, [waitingTime]);

  useEffect(() => {
    if (!showBookingAnimation) return;

    const interval = setInterval(() => {
      setWaitingTime((prev) => {
        if (prev >= MAX_WAIT_SECONDS) {
          setExpired(true);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showBookingAnimation]);

  // FORMAT TIME AS MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handle driver assignment (simulated)
  const simulateDriverAssignment = () => {
    const mockDriver = {
      id: 'driver_123',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      vehicle: {
        model: 'Maruti Swift',
        number: 'DL 01 AB 1234',
        color: 'White'
      },
      rating: 4.8,
      eta: '5 mins'
    };

    setDriverAssigned(true);
    setDriverInfo(mockDriver);
  };

  const handleBookRide = async () => {
    if (!rideData || !rideData.phoneNumber) {
      router.replace('/(tabs)/bookingDetails')
      return;
    }
    setIsBookingRide(true);
    setShowBookingAnimation(true);
    setWaitingTime(0);
    setCurrentStep(0);
    setSearchStatus('Finding drivers ');
    setScanProgress(0);

    try {

      setPageLoading(true)
      const bookingData = {
        pickupLocation: { address: rideData.pickupAddress, coords: rideData.pickupCoords },
        dropoffLocation: { address: rideData.dropAddress, coords: rideData.dropCoords },
        rideType: rideData.rideType,
        paymentMethod: paymentMethod,
        firstName: 'User',
        lastName: '',
        phoneNumber: rideData.phoneNumber,
        scheduledDate: rideData.scheduledDate,
        scheduledTime: rideData.scheduledTime,
        bookingForSelf: rideData.rideType === 'private'
      };

      const response = await api.post('/bookings/book', bookingData);

      if (response.data?.success) {
        const rideId = response.data.rideId;
        setBookingId(rideId);
        // If online, immediately create order and open payment modal
        if (paymentMethod === 'online') {
          try {
            const orderRes = await api.post('/payments/create-order', { bookingId: rideId, amount: amountDue });
            if (orderRes.data?.success) {
              setPaymentPending(true);
              setPaymentOrderId(orderRes.data.orderId);
              setPaymentId(orderRes.data.paymentId);
              setPaymentModalOpen(true);
            }
          } catch (_) {
            setPaymentPending(true);
            setPaymentModalOpen(true);
          }
          finally {
            setPageLoading(false)
          }
        }

        // Keep showing the map (waiting room) and poll for driver assignment
        // We will navigate once a driver confirms the ride
      } else {
        setShowBookingAnimation(true)
        alert(response.data?.message || 'Failed to book ride');
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to book ride');
      setShowBookingAnimation(false);
    } finally {
      setPageLoading(false)
    }
  };

  useEffect(() => {
    if (!bookingId) {
      handleBookRide();
    }  // trigger driver simulation immediately
  }, [bookingId]);

  const cancelBooking = async () => {
    setProcessing(true)
    if (!bookingId) return setProcessing(false);
    try {
      await api.post(`/bookings/cancel/${bookingId}`);
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Booking already cancelled",
        text2: e?.response?.data?.message || 'Failed to cancel ride',
        position: "bottom",
        visibilityTime: 2000
      })
    } finally {
      setProcessing(false)
    }
    router.replace('/(tabs)/home')
  };

  // Expire the ride when maximum waiting time is reached
  useEffect(() => {
    if (!showBookingAnimation || expired) return;
    if (waitingTime >= MAX_WAIT_SECONDS) {
      (async () => {
        // Stop the search UI and mark as expired; do NOT auto-cancel so user can retry
        setExpired(true);
        setShowBookingAnimation(false);
        setPaymentModalOpen(false);
        setPaymentPending(false);
      })();
    }
  }, [waitingTime, showBookingAnimation, expired, bookingId]);

  const retrySearch = async () => {
    // Restart the 3-minute window; keep existing booking if any
    setExpired(false);
    setWaitingTime(0);
    setCurrentStep(0);
    setScanProgress(0);
    setSearchStatus('Finding drivers...');
    setShowBookingAnimation(true);
    // If there is no booking yet (edge case), create one
    if (!bookingId) {
      await handleBookRide();
    }
  };

  // fetch drivers on regular interval
  useEffect(() => {
    if (expired || driverAssigned === true) return;
    let cancelled = false;
    let timer: number | null = null;
    const load = async () => {
      try {
        const params: any = {};
        if (location && typeof location.coords.latitude === 'number' && typeof location.coords.longitude === 'number') {
          params.lat = location.coords.latitude; params.lng = location.coords.longitude;
        }
        const res = await api.get('/riders/online-drivers', { params });
        const backendCount = typeof res.data?.count === 'number' ? res.data.count : 0;
        const drivers = Array.isArray(res.data?.drivers) ? res.data.drivers : [];
        if (!cancelled) { setOnlineDrivers(drivers); setOnlineCount(backendCount); }
      } catch { }
    };
    // initial fetch without waiting for geolocation
    load();
    // refresh every 10s
    // @ts-ignore
    timer = window.setInterval(load, 10000);
    return () => { cancelled = true; if (timer) window.clearInterval(timer); };
  }, [location]);

  // dismiss notification on unmount
  useEffect(() => {
    return () => {
      Notifications.dismissNotificationAsync("ride_waiting")
        .catch(() => { });
    };
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      {pageLoading && <LoadingOverlay message='Preparing your ride details...' />}
      <View style={{ marginBottom: 40, alignItems: "center", backgroundColor: "white", borderRadius: 10, padding: 10 }}>
        <Text style={{ fontSize: 22, color: "#000000", fontWeight: "600" }}>
          {searchStatus}
        </Text>

        {!expired ? <Text> Waiting <Text> {formatTime(waitingTime)}</Text> </Text> : <Text>No Drivers Found</Text>}
        {expired && <MyButton title='Simulate fake driver' onPress={simulateDriverAssignment} backgroundColor='#3498db' />}
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <PulsingDot active={!expired} expired={expired} />
          <PulsingDot active={false} expired={expired} />
          <PulsingDot active={false} expired={expired} />
          <PulsingDot active={false} expired={expired} />
        </View>

        {/* Progress Line */}

        <View
          style={{
            width: "80%",
            height: 8,
            backgroundColor: "#e0e0e0",
            borderRadius: 10,
            overflow: "hidden",
            marginTop: 20,
          }}
        >
          <AnimatedGradient
            style={[{ height: "100%" }, progressStyle]}
            colors={["#2ecc71", "#3498db"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>

        {!expired && (
          <Text style={{ marginTop: 6, color: "#000000" }}>
            We’re connecting you with the nearest driver
          </Text>
        )}
      </View>

      <LiveTrackMap isFullScreen={false} />

      {!expired ?
        <MyButton disabled={processing} onPress={cancelBooking} title='Cancel Booking' backgroundColor='red' />
        :
        <MyButton onPress={retrySearch} title='Try again' backgroundColor='#3498db' />
      }


    </View>
  )
}

export default Waiting

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

const PulsingDot = ({ active, expired }: { active: boolean; expired: boolean }) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (active && !expired) {
      pulse.value = withRepeat(
        withTiming(1.7, { duration: 800 }),
        -1,
        true
      );
    }
  }, [active, expired]);

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
      shadowOpacity: active ? interpolate(pulse.value, [1, 1.7], [0.3, 0.8]) : 0,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: 22,
          height: 22,
          borderRadius: 50,
          backgroundColor: expired
            ? "red"
            : active
              ? "#2ecc71"
              : "#bdbdbd",
          marginHorizontal: 8,
          shadowColor: active ? "#2ecc71" : "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 8,
        },
        animStyle,
      ]}
    />
  );
};

