import { Card, CardContent } from '../../components/ui/card';
import { Text } from '../../components/ui/text';

export default function RgpdPolicy() {
    return (
        <Card className="mb-4 border-b-4 rounded-lg shadow-lg border-primary">
            <CardContent className="p-4">
                <Text className="mb-4 text-xl font-bold">TLDR : Privacy Policy & RGPD Compliance</Text>

                <Text className="mb-2 text-lg font-semibold">1. Introduction</Text>
                <Text className="mb-4">
                    This privacy policy explains how we handle your data in compliance with the General Data Protection Regulation (RGPD/GDPR). We are committed to protecting your privacy and being transparent about our data practices.
                </Text>

                <Text className="mb-2 text-lg font-semibold">2. Data Collection and Storage</Text>
                <Text className="mb-4">
                    The only personal data we collect and store is your device's Push Notification Token. This token is used exclusively for the purpose of sending you notifications about your GitLab activities when you enable the notification feature.
                </Text>

                <Text className="mb-2 text-lg font-semibold">3. Purpose of Data Collection</Text>
                <Text className="mb-4">
                    The Push Notification Token is used solely to:
                    {'\n'}- Enable push notifications for GitLab activities
                    {'\n'}- Ensure notifications are delivered to the correct device
                    {'\n'}- Maintain the functionality of the notification system
                </Text>

                <Text className="mb-2 text-lg font-semibold">4. Data Retention</Text>
                <Text className="mb-4">
                    Your Push Notification Token is stored only for as long as you have notifications enabled. When you disable notifications or uninstall the application, your token is automatically deleted from our systems.
                </Text>

                <Text className="mb-2 text-lg font-semibold">5. Your Rights</Text>
                <Text className="mb-4">
                    Under RGPD/GDPR, you have the right to:
                    {'\n'}- Access your data
                    {'\n'}- Request deletion of your data
                    {'\n'}- Disable notifications at any time
                    {'\n'}- Withdraw your consent for data processing
                </Text>

                <Text className="mb-2 text-lg font-semibold">6. Data Security</Text>
                <Text className="mb-4">
                    We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, protecting your Push Notification Token against unauthorized processing and accidental loss.
                </Text>

                <Text className="mb-2 text-lg font-semibold">7. Contact</Text>
                <Text className="mb-4">
                    If you have any questions about how we handle your data or wish to exercise your rights under RGPD/GDPR, please contact us through GitLab's support channels.
                </Text>
            </CardContent>
        </Card>
    );
}
