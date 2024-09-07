import { Text } from "@/components/ui/text";
import { Ionicons } from '@expo/vector-icons';

export default function MergeRequestStatusIcon(MergeRequest: any, withText: boolean = false) {
    console.log("MergeRequest.state" + MergeRequest.state);
    return <>
        {MergeRequest.state === 'opened' ? (
            <>
                <Ionicons name="checkmark-circle" size={24} color="green" />
                {withText && <Text className='ml-1 text-green-500'>Open</Text>}
            </>
        ) : MergeRequest.state === 'closed' ? (
            <>
                <Ionicons name="close-circle" size={24} color="red" />
                {withText && <Text className='ml-1 text-red-500'>Closed</Text>}
            </>
        ) : MergeRequest.state === 'locked' ? (
            <>
                <Ionicons name="lock-closed" size={24} color="orange" />
                {withText && <Text className='ml-1 text-orange-500'>Locked</Text>}
            </>
        ) : MergeRequest.state === 'merged' ? (
            <>
                <Ionicons name="git-branch" size={24} color="purple" />
                {withText && <Text className='ml-1 text-purple-500'>Merged</Text>}
            </>
        ) : (
            <>
                <Ionicons name="help-circle" size={24} color="blue" />
                {withText && <Text className='ml-1 text-blue-500'>Unknown</Text>}
            </>
        )}
    </>;
}
