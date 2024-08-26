import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Text, View } from 'react-native';

const LinksToIssueSection = ({ title, iconName, array, empty }) => (
  <View className='p-4 mb-4 border border-gray-300 border-dashed'>
    <View className='flex-row items-center justify-between'>
      <Text className='font-bold text-black'>{title}</Text>
      <Text className='px-2 py-1 text-gray-700 bg-gray-200 rounded'>{array.length}</Text>
    </View>
    {array.length > 0 ? array.map((item, index) => (
      <View className='flex-row items-center mt-2' key={index}>
        <FontAwesome6 name={iconName} size={12} color="gray" className='mr-2' />
        <Text className='text-gray-500'>{item.title}</Text>
        <Text className='ml-auto text-black'>{item.reference}</Text>
      </View>
    )) :
      empty
    }
  </View>
);

export default LinksToIssueSection;
