import { Ionicons } from '@expo/vector-icons';

import { Text } from "@/components/ui/text";

interface PipelineStatusIconProps {
    status: string;
    withText?: boolean;
}
export default function PipelineStatusIcon({ status, withText = false }: PipelineStatusIconProps) {
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'created':
                return { icon: 'create', color: 'orange', text: 'Pending' };
            case 'waiting_for_resource':
                return { icon: 'time-outline', color: 'orange', text: 'Pending' };
            case 'preparing':
            case 'pending':
                return { icon: 'pending', color: 'orange', text: 'Pending' };
            case 'running':
                return { icon: 'play', color: 'blue', text: 'Running' };
            case 'success':
                return { icon: 'checkmark-circle', color: 'green', text: 'Success' };
            case 'failed':
                return { icon: 'close-circle', color: 'red', text: 'Failed' };
            case 'canceled':
                return { icon: 'stop-circle', color: 'gray', text: 'Canceled' };
            case 'skipped':
                return { icon: 'play-skip-forward', color: 'purple', text: 'Skipped' };
            case 'manual':
                return { icon: 'hand-left', color: 'teal', text: 'Manual' };
            case 'scheduled':
                return { icon: 'calendar', color: 'indigo', text: 'Scheduled' };
            default:
                return { icon: 'help-circle', color: 'gray', text: 'Unknown' };
        }
    };

    const { icon, color, text } = getStatusInfo(status);
    return (
        <>
            <Ionicons name={icon} size={24} color={color} />
            {withText && <Text className={`ml-1 text-muted`}>{text}</Text>}
        </>
    );
}
