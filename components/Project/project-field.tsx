import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export function ProjectField({ title, value, locked = false }) {
    // https://gitlab.com/thomas.pedot1/fake-gitlab/-/issues/30
    // Assignee
    // Labels
    // Milestone
    // Due Date
    // time tracking
    // Confidentiality
    // Particpante
    // Move issue
    <View className="flex-row items-center justify-between py-2">
        <View className="flex-row items-center">
            <Ionicons name="caret-down" size={18} color="gray" />
            <Text className="text-white">{title}</Text>
        </View>
        <View className="flex-row items-center">
            <Text className="mr-2 text-muted">{value}</Text>
            {locked && <Text className="text-muted">🔒</Text>}
        </View>
    </View>
}