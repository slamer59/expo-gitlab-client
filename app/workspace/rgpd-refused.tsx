import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

export default function RGPDRefused() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 p-4 bg-background">
            <View className="space-y-4">
                <Text className="text-2xl font-bold text-foreground">Why RGPD Consent Matters</Text>

                <Card className="p-4">
                    <Text className="mb-2 text-lg font-semibold text-foreground">Enhanced Features Require Data Processing</Text>
                    <Text className="text-muted-foreground">
                        Without RGPD consent, we cannot provide several key features that improve your experience:
                    </Text>
                    <View className="mt-2 space-y-2">
                        <Text className="text-muted-foreground">• Notifications for repository updates and mentions</Text>
                        <Text className="text-muted-foreground">• Personalized project recommendations</Text>
                        <Text className="text-muted-foreground">• Webhook integrations with your repositories</Text>
                        <Text className="text-muted-foreground">• Activity tracking and analytics</Text>
                    </View>
                </Card>

                <Card className="p-4">
                    <Text className="mb-2 text-lg font-semibold text-foreground">How We Use Your Data</Text>
                    <Text className="text-muted-foreground">
                        We only collect and process data that is necessary to provide you with a better GitLab experience. This includes:
                    </Text>
                    <View className="mt-2 space-y-2">
                        <Text className="text-muted-foreground">• Repository interaction patterns</Text>
                        <Text className="text-muted-foreground">• Notification preferences</Text>
                        <Text className="text-muted-foreground">• Feature usage statistics</Text>
                    </View>
                </Card>

                <Card className="p-4">
                    <Text className="mb-2 text-lg font-semibold text-foreground">Your Data Rights</Text>
                    <Text className="text-muted-foreground">
                        Under RGPD, you have complete control over your data. You can:
                    </Text>
                    <View className="mt-2 space-y-2">
                        <Text className="text-muted-foreground">• Access your collected data</Text>
                        <Text className="text-muted-foreground">• Request data deletion</Text>
                        <Text className="text-muted-foreground">• Modify your consent at any time</Text>
                    </View>
                </Card>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="default" className="w-full mt-4">
                            Review RGPD Consent
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>RGPD Consent</AlertDialogTitle>
                            <AlertDialogDescription>
                                By accepting, you agree to allow us to collect and process your data in accordance with RGPD guidelines.
                                This enables features like notifications, webhooks, and personalized recommendations.
                                You can modify or withdraw your consent at any time.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onPress={() => {
                                    router.push('/workspace');
                                }}
                            >
                                Decline
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onPress={() => {
                                    router.push('/workspace/rgpd');
                                }}
                            >
                                Accept
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </View>
        </ScrollView>
    );
}
