import { Text } from "@/components/ui/text";
import { Octicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
            return 'image';

        case 'mp4':
        case 'mov':
        case 'avi':
            return 'device-camera-video';

        case 'mp3':
        case 'wav':
        case 'ogg':
            return 'unmute';

        case 'pdf':
            return 'file-badge';

        case 'doc':
        case 'docx':
            return 'file';

        case 'xls':
        case 'xlsx':
            return 'table';

        case 'ppt':
        case 'pptx':
            return 'project';

        case 'zip':
        case 'rar':
        case '7z':
            return 'file-zip';

        case 'txt':
            return 'note';

        case 'md':
            return 'markdown';

        case 'json':
        case 'xml':
        case 'html':
        case 'css':
            return 'code';

        case 'js':
        case 'ts':
        case 'jsx':
        case 'tsx':
            return 'file-code';

        case 'py':
            return 'file-code';

        case 'rb':
            return 'ruby';

        case 'sh':
        case 'bash':
            return 'terminal';

        case 'svg':
            return 'file-media';

        case 'gitignore':
            return 'git-branch';

        default:
            return 'file';
    }
};

const FileItem = ({ type, name, href }) => {
    const router = useRouter();

    const iconName = type === 'tree' ? 'file-directory' : getFileIcon(name);

    const handlePress = () => {
        router.push(href);
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <View className="flex-row items-center m-2">
                <Octicons
                    name={iconName}
                    size={24}
                    color="gray"
                    style={{ marginRight: 12 }}
                />
                <Text style={type === 'tree' ? { fontWeight: 'bold', margin: 2 } : {}}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default FileItem;
