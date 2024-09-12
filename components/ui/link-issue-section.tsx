import { Octicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface LinksToIssueSectionProps {
  title: string;
  iconName: string;
  array: Array<{ title: string; reference: string }>;
  empty: React.ReactNode;
}
const LinksToIssueSection = ({ title, iconName, array, empty }: LinksToIssueSectionProps) => (
  <View className='p-4 mb-4 border border-dashed rounded-2xl border-primary bg-card-600'>
    <View className='flex-row items-center justify-between'>
      <Text className='text-xl font-bold text-white'>{title}</Text>
      <Text className='px-2 py-1 font-semibold text-white rounded bg-muted'>{array.length}</Text>
    </View>
    {array.length > 0 ? array.map((item, index) => (
      <View className='flex-row items-center mt-2' key={index}>
        <Octicons name={iconName} size={12} color="gray" className='mr-2' />
        <Text className="mt-2 text-lg text-white">
          {item.title}
        </Text>
        <Text className='ml-auto text-black'>{item.reference}</Text>
      </View>
    )) :
      empty
    }
  </View>
);

export default LinksToIssueSection;
