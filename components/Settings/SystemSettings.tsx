import { Text } from '@/components/ui/text';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Application from 'expo-application';
import { Linking, TouchableOpacity, View } from 'react-native';

export default function SystemSettingsScreen() {
    const bundleIdentifier = Application.applicationId;
    console.log(bundleIdentifier);

    return (
        <View className="p-4 m-1 bg-gray-200 rounded-lg">
            <Text className='mb-5 text-2xl font-bold'>System Options</Text>
            <View className='flex-row items-center justify-between'>
                <Text>Configure Notifications for this application</Text>
                <TouchableOpacity onPress={() => Linking.openSettings()}>
                    <FontAwesome6
                        name="gear"
                        size={30}
                        color="black"
                        testID="system-options" />
                </TouchableOpacity>
            </View>
        </View>
    )
}
