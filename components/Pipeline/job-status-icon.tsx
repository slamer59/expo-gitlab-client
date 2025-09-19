import { Ionicons } from '@expo/vector-icons';

import { Text } from "@/components/ui/text";

export default function JobStatusIcon({ status, withText = false }: { status: string, withText?: boolean }) {
    // console.log("status", status);
    switch (status) {
        case 'created':
            return (
                <>
                    <Ionicons name="add-circle-outline" size={24} color="blue" />
                    {withText && <Text className='ml-1 text-blue-500'>Created</Text>}
                </>
            );
        case 'pending':
            return (
                <>
                    <Ionicons name="time-outline" size={24} color="orange" />
                    {withText && <Text className='ml-1 text-orange-500'>Pending</Text>}
                </>
            );
        case 'running':
            return (
                <>
                    <Ionicons name="play-circle-outline" size={24} color="blue" />
                    {withText && <Text className='ml-1 text-blue-500'>Running</Text>}
                </>
            );
        case 'failed':
            return (
                <>
                    <Ionicons name="close-circle-outline" size={24} color="red" />
                    {withText && <Text className='ml-1 text-red-500'>Failed</Text>}
                </>
            );
        case 'success':
            return (
                <>
                    <Ionicons name="checkmark-circle-outline" size={24} color="green" />
                    {withText && <Text className='ml-1 text-green-500'>Success</Text>}
                </>
            );
        case 'canceled':
            return (
                <>
                    <Ionicons name="stop-circle-outline" size={24} color="gray" />
                    {withText && <Text className='ml-1 text-gray-500'>Canceled</Text>}
                </>
            );
        case 'skipped':
            return (
                <>
                    <Ionicons name="play-skip-forward-outline" size={24} color="purple" />
                    {withText && <Text className='ml-1 text-purple-500'>Skipped</Text>}
                </>
            );
        case 'waiting_for_resource':
            return (
                <>
                    <Ionicons name="hourglass-outline" size={24} color="yellow" />
                    {withText && <Text className='ml-1 text-yellow-500'>Waiting</Text>}
                </>
            );
        case 'manual':
            return (
                <>
                    <Ionicons name="hand-left-outline" size={24} color="teal" />
                    {withText && <Text className='ml-1 text-teal-500'>Manual</Text>}
                </>
            );
        default:
            console.warn('Unknown status:', status);
            return (
                <>
                    <Ionicons name="help-circle-outline" size={24} color="gray" />
                    {withText && <Text className='ml-1 text-gray-500'>Unknown</Text>}
                </>
            );
    }
}
