import InfoAlert from '@/components/InfoAlert';
import { NotificationPermissionDialog } from '@/components/NotificationPermissionDialog';
import GitLabNotificationSettings from '@/components/Settings/GitlabNotificationSettings';
import SystemSettingsScreen from '@/components/Settings/SystemSettings';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { removeWebhooks } from '@/lib/gitlab/webhooks';
import { supportLinks } from '@/lib/links/support';
import { useNotificationStore } from '@/lib/notification/state';
import { useSession } from '@/lib/session/SessionProvider';
import { Ionicons, Octicons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import { Image } from 'expo-image';

import { Redirect, Stack } from 'expo-router';
import { LucideGitlab } from 'lucide-react-native';
import { default as React, useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';

export default function OptionScreen() {
  const { signOut, session } = useSession();

  if (!session) {
    return <Redirect href='/login' />;
  }
  const client = useMemo(() => new GitLabClient({
    url: session?.url,
    token: session?.token,
  }), [session?.url, session?.token]);

  const api = useGitLab(client);
  const { data: personalProjects, isLoading: isLoadingPersonal, error: errorPersonal } = api.useProjects({ membership: true });
  // 1. Fetch projects
  const [alert, setAlert] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });
  const {
    consentToRGPDGiven, setRGPDConsent
  } = useNotificationStore();

  const handleRGPDConsent = async () => {
    try {
      await setRGPDConsent(!consentToRGPDGiven);
      console.log("🚀 ~ handleRGPDConsent ~ consentToRGPDGiven:", consentToRGPDGiven)

      const projects = personalProjects.map(project => ({
        http_url_to_repo: project.http_url_to_repo,
        id: project.id
      }));
      if (!projects) return;
      if (consentToRGPDGiven == true) {
        await removeWebhooks(session, projects);
      }
      console.log("Webhooks removed successfully");
      // setAlert({ message: 'Webhooks removed successfully', isOpen: true });
    } catch (error) {
      console.error("Error removing webhooks:", error);
      setAlert({ message: `Error removing webhooks: ${error.message}`, isOpen: true });
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: "General settings",
        }}
      />

      <ScrollView className='flex-1 p-4 bg-background'>
        <InfoAlert
          title='Webhooks removed'
          isOpen={alert.isOpen}
          onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
          message={alert.message}
        />
        <SystemSettingsScreen />
        <View className="p-4 m-1 rounded-lg bg-card">
          <Text className="mb-2 text-2xl font-bold text-white">Notifications</Text>
          <Text className="mb-6 text-muted">You can specify notification level per group or per project.</Text>

          <Text className="mb-6 text-muted">Configure your mobile app notification preferences here. These settings are independent from your GitLab email notifications.</Text>


          <View className="mb-6">
            <Text className="mb-2 text-xl font-bold text-white">Global notification email</Text>
            <View>
              <Text className='mb-2 text-muted'>
                We need your consent to use data for analytics and notifications.
              </Text>

              <Button
                disabled={isLoadingPersonal}
                variant="secondary"
                className={`text-2xl items-center justify-start font-bold text-white ${consentToRGPDGiven ? 'bg-warning' : 'bg-success'}`}
                onPress={() => handleRGPDConsent()}
              >
                <Text className={`text-2xl font-bold text-white`}>
                  {consentToRGPDGiven ? "I do not consent any more" : "I give my consent"}
                </Text>
              </Button>
              {consentToRGPDGiven && <NotificationPermissionDialog />}
              <View className='flex flex-row items-center justify-center mt-4'>
                <Octicons name="info" size={16} color="#999" />
                <Text className='text-muted'> This is required for notifications to work.</Text>
              </View>
            </View>
          </View>
        </View>
        {consentToRGPDGiven && <GitLabNotificationSettings />}

        <View className='mt-6 mb-6 border-t border-gray-700' />

        <Card className="mb-6 border rounded-lg shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="flex flex-col text-white">About</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <LucideGitlab color="white" size={24} />
                <Text className="m-2 text-white">
                  Version: {Application.applicationName} v{Application.nativeApplicationVersion}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Image source={require("@/assets/images/logo.png")} style={{ width: 24, height: 24 }} />
                <Text className="m-2 text-white">GitLab API: v4</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card className="mb-6 border rounded-lg shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="flex flex-col text-white">Support</CardTitle>
          </CardHeader>
          <CardContent>
            {supportLinks.map((link, index) => (
              <Pressable
                key={index}
                onPress={() => link.external ? Linking.openURL(link.url!) : link.onPress?.()}
                className="flex-row items-center py-3"
              >
                <Ionicons
                  name={link.icon as any}
                  size={24}
                  color={link.color}
                  style={{ marginRight: 12 }}
                />
                <Text className="text-lg text-white">{link.text}</Text>
              </Pressable>
            ))}
          </CardContent>
        </Card>

        <View className='mb-6 border-t border-gray-700' />

        <View className='mb-6'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <Text className='text-2xl font-bold text-white'>Sign Out</Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='bg-border'>
                  <Text>Cancel</Text>
                </AlertDialogCancel>
                <AlertDialogAction
                  className='text-white bg-destructive'
                  onPress={signOut}
                >
                  <Text>Logout</Text>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </View>
      </ScrollView >
    </>
  );
}
