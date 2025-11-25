
import { useRideStore } from '@/stores/bookingConfirmStore'
import { View, Text } from 'react-native'

const RidingInitiatePage = () => {
  const data = useRideStore((state) => state.confirmationData)

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <View>
        <View>
          <Text>PICKUP</Text>
          <Text>{data?.pickupAddress}</Text>
        </View>
        <View>

          <Text>DROP-OFF</Text>
          <Text>{data?.dropAddress}</Text>
        </View>
        <View>

          <Text>DISTANCE</Text>
          <Text>12 km . 35 mins</Text>


          <View>
            {/* Riders list */}
          </View>
        </View>
      </View>
    </View>
  )
}

export default RidingInitiatePage

