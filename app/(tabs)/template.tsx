import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';


function Example() {
    const [checkedIds, setCheckedIds] = React.useState([]);

    const toggleSwitch = (id) => {
        setCheckedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((checkedId) => checkedId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    return (
        <View className="flex flex-col space-y-4">
            <Text className='text-black'>{JSON.stringify(checkedIds)}</Text>
            <View className="flex flex-row items-center space-x-2">
                <Switch
                    id="airplane-mode"
                    checked={checkedIds.includes('airplane-mode')}
                    onCheckedChange={() => toggleSwitch('airplane-mode')}
                />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </View>

            <View className="flex flex-row items-center space-x-2">
                <Switch
                    id="wifi"
                    checked={checkedIds.includes('wifi')}
                    onCheckedChange={() => toggleSwitch('wifi')}
                />
                <Label htmlFor="wifi">Wi-Fi</Label>
            </View>

            <View className="flex flex-row items-center space-x-2">
                <Switch
                    id="bluetooth"
                    checked={checkedIds.includes('bluetooth')}
                    onCheckedChange={() => toggleSwitch('bluetooth')}
                />
                <Label htmlFor="bluetooth">Bluetooth</Label>
            </View>
        </View>
    );
}

export default Example;
