import * as React from 'react';
import { View } from 'react-native';

import EnhancedMarkdownEditor from '@/components/markdown-editor';

export default function MarkdownEdit() {

    return (
        <View className='flex-1 p-6 bg-background'>
            <EnhancedMarkdownEditor />
        </View>
    );
}