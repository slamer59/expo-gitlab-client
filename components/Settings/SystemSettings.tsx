import { FontAwesome6, Octicons } from '@expo/vector-icons';
import { Linking, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui/text';

export default function SystemSettingsScreen() {
    return (
        <View className="p-4 m-1 rounded-lg bg-card">
            <View className='flex flex-row items-center mb-5'>
                <Octicons name="gear" size={30} color="white" className='mr-2' />
                <Text className='text-2xl font-bold'>System Options</Text>
            </View>
            <View className='flex-row items-center justify-between'>
                <Text className="text-lg">Configure Notifications for this application</Text>
                <TouchableOpacity
                    onPress={() => Linking.openSettings()}
                    className='p-2 rounded-lg bg-secondary'
                >
                    <FontAwesome6
                        name="gear"
                        size={30}
                        color="white"
                        testID="system-options" />
                </TouchableOpacity>
            </View>
        </View>
    )
}
