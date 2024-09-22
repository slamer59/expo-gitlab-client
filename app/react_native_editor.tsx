import EnhancedMarkdownEditor from '@/components/markdown-editor';
import * as React from 'react';
import { View } from 'react-native';

export default function MarkdownEdit() {

    return (
        <View className='flex-1 p-6 bg-background'>
            <EnhancedMarkdownEditor />
        </View>
    );
}