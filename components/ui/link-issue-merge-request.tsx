import { Octicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

enum MergeRequestState {
  OPENED = 'opened',
  CLOSED = 'closed',
  LOCKED = 'locked',
  MERGED = 'merged'
}

interface MergeRequestItem {
  title: string;
  reference: string;
  project_id: number;
  iid: number;
  state: MergeRequestState;
}

interface LinksToIssueSectionProps {
  title: string;
  array: Array<MergeRequestItem>;
  empty: React.ReactNode;
}

export function LinksMergeRequestsSection({ title, array, empty }: LinksToIssueSectionProps) {
  const getIconName = (state: MergeRequestState): string => {
    switch (state) {
      case MergeRequestState.OPENED:
        return 'git-pull-request';
      case MergeRequestState.CLOSED:
        return 'git-pull-request-closed';
      case MergeRequestState.LOCKED:
        return 'lock';
      case MergeRequestState.MERGED:
        return 'git-merge';
      default:
        return 'question';
    }
  };

  const getIconColor = (state: MergeRequestState): string => {
    switch (state) {
      case MergeRequestState.OPENED:
        return 'green';
      case MergeRequestState.CLOSED:
        return 'red';
      case MergeRequestState.LOCKED:
        return 'orange';
      case MergeRequestState.MERGED:
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <View className='p-4 mb-4 border border-dashed rounded-2xl border-primary bg-card-600'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-xl font-bold text-white'>{title}</Text>
        <Text className='px-2 py-1 font-semibold text-white rounded bg-muted'>{array.length}</Text>
      </View>
      {array.length > 0 ? array.map((item, index) => (
        <Link
          key={index}
          href={`/workspace/projects/${item.project_id}/merge-requests/${item.iid}`}
          asChild
        >
          <Pressable>
            <View className='flex-row items-center mt-2' key={index}>
              <View className='flex-row items-center flex-1'>
                <View className='flex items-center justify-center w-5 h-5 mr-2'>
                  <Octicons
                    name={getIconName(item.state)}
                    size={16}
                    color={getIconColor(item.state)}
                  />
                </View>
                <Text className="flex-1 text-lg text-white">
                  {item.title}
                </Text>
              </View>
              <Text className='text-secondary'>{item.reference}</Text>
            </View>
          </Pressable>
        </Link>
      )) :
        empty
      }
    </View>
  );
}
