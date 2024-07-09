import React from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function FileView() {
    const markdownText = '# Heading\n\nThis is some **bold** text.';

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Markdown>{markdownText}</Markdown>
        </View>
    );
}
