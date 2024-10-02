import { Text } from "@/components/ui/text";
import { Ionicons } from '@expo/vector-icons';

export default function IssueStatusIcon(issue: any, withText: boolean = false) {
    return <>
        {issue.state === 'opened' ? (
            <>
                <Ionicons name="checkmark-circle" size={24} color="green" />
                {withText && <Text className='ml-1 text-green-500'>Open</Text>}
            </>
        ) : issue.state === 'closed' ? (
            <>
                <Ionicons name="close-circle" size={24} color="red" />
                {withText && <Text className='ml-1 text-red-500'>Closed</Text>}
            </>
        ) : issue.state === 'locked' ? (
            <>
                <Ionicons name="lock-closed" size={24} color="orange" />
                {withText && <Text className='ml-1 text-orange-500'>Locked</Text>}
            </>
        ) : (
            <>
                <Ionicons name="help-circle" size={24} color="blue" />
                {withText && <Text className='ml-1 text-blue-500'>Unknown</Text>}
            </>
        )}
    </>;
}
