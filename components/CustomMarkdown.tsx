import { styles } from '@/lib/markdown-styles';
import { Image } from 'expo-image';
import React from 'react';
import { ImageStyle, View } from 'react-native';
import Markdown from 'react-native-markdown-display'; // Or any other markdown renderer you prefer
const MarkdownCustom = ({ children,
    className = '',
    imageStyle = { width: 200, height: 200 },
    imageClassName = "mb-6 bg-white"
}: {
    children: string;
    className?: string;
    imageStyle?: ImageStyle,
    imageClassName?: string;
}) => {

    return (
        <Markdown

            style={styles}
            className={className}
            rules={{
                image: (node, children, parent, styles) => {
                    console.log("🚀 ~ parent:", node.attributes.src)
                    return (
                        <View className='items-center justify-center flex-1'>
                            <Image
                                source={require('@/assets/images/uploaded-gitlab.webp')}
                                style={imageStyle}
                                className={imageClassName}
                                transition={1000}
                            />
                        </View>
                    );
                }
            }}
        >
            {children}
        </Markdown>
    );
};

export default MarkdownCustom;
