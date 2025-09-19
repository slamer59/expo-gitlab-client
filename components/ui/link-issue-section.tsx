import { Octicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

enum IssueState {
  OPENED = 'opened',
  CLOSED = 'closed'
}

interface IssueItem {
  title: string;
  reference: string;
  project_id: number;
  iid: number;
  state: IssueState;
}

interface LinksToIssueSectionProps {
  title: string;
  array: IssueItem[];
  empty: React.ReactNode;
}

export function LinkedIssuesSection({ title, array, empty }: LinksToIssueSectionProps) {
  const getIconName = (state: IssueState): string => {
    switch (state) {
      case IssueState.OPENED:
        return 'issue-opened';
      case IssueState.CLOSED:
        return 'issue-closed';
      default:
        return 'issue-opened';
    }
  };

  const getIconColor = (state: IssueState): string => {
    switch (state) {
      case IssueState.OPENED:
        return 'green';
      case IssueState.CLOSED:
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
          href={`/workspace/projects/${item.project_id}/issues/${item.iid}`}
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
              <Text className='text-secondary'>{item.references.relative}</Text>
            </View>
          </Pressable>
        </Link>
      )) :
        empty
      }
    </View>
  );
}
