
import { View } from '@/components/Themed';
import { RepositoryCard } from '@/components/ui/repository-card';

export default function ModalScreen() {
  const repositories = [
    {
      name: 'Repository 1',
      description: 'This is the description for Repository 1',
      icon: 'https://img.icons8.com/?size=100&id=DuuipuI9mFC8&format=png&color=000000',
    },
    {
      name: 'Repository 2',
      description: 'This is the description for Repository 2',
      icon: 'https://img.icons8.com/?size=100&id=DuuipuI9mFC8&format=png&color=000000',
    },
    // Add more repository objects as needed
  ];
  return (
    <View>
      {/* Notification Status Card */}
      {repositories.map((repository, index) =>
        <View key={index}>
          <RepositoryCard {...repository} />
        </View>
      )}
    </View>
  );
}
