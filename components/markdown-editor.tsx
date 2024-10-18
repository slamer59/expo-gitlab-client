import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, ChevronDown, Code, CodeXml, ImageIcon, Italic, Link, List, ListChecks, ListOrdered, Quote, Strikethrough, Underline } from '@/lib/icons/All';
import * as ImagePicker from 'expo-image-picker';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { Platform, ScrollView, TextInput, View } from 'react-native';

import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { Octicons } from '@expo/vector-icons';
import { CircleX, Undo } from 'lucide-react-native';
import MarkdownCustom from './CustomMarkdown';
import ErrorAlert from './ErrorAlert';

// const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onPress, icon, label }) => {
//     const insets = useSafeAreaInsets();
//     const contentInsets = {
//         top: insets.top,
//         bottom: insets.bottom,
//         left: 12,
//         right: 12,
//     };

//     return (
//         <View className='items-center justify-center flex-1 p-2'>
//             <Tooltip delayDuration={150}>
//                 <TooltipTrigger asChild>
//                     <Button variant='outline' onPress={onPress}>
//                         <Octicons name={icon} size={18} color="black" />
//                     </Button>
//                 </TooltipTrigger>
//                 <TooltipContent insets={contentInsets}>
//                     <Text className='native:text-lg'>{label}</Text>
//                 </TooltipContent>
//             </Tooltip>
//         </View>
//     );
// }

function ToolbarButton({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) {
    return <ToggleGroupItem
        value={label}
        aria-label={`Toggle ${label}`}
        onPress={onPress}
    >
        <ToggleGroupIcon icon={icon} size={18} />
    </ToggleGroupItem>;
}

export default function EnhancedMarkdownEditor({ projectId, markdown, onChangeText, preview = true }: { projectId: string, markdown: string, onChangeText: (text: string) => void, preview?: boolean }) {
    const { session } = useSession()
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const uploadToProject = api.useProjectUpload();

    const [history, setHistory] = useState<string[]>([]);
    const [activeStyles, setActiveStyles] = useState<string[]>([]);

    const updateMarkdown = (newMarkdown: string) => {
        setHistory(prev => [...prev, markdown])
        onChangeText(newMarkdown)
    }

    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const textInputRef = React.useRef<TextInput | null>(null);
    const insertMarkdown = (before: string, after: string = "") => {
        if (textInputRef.current) {
            const newText =
                markdown.substring(0, selection.start) +
                before +
                markdown.substring(selection.start, selection.end) +
                after +
                markdown.substring(selection.end);

            onChangeText(newText);
            // Use setTimeout to ensure the new text is set before adjusting selection
            setTimeout(() => {
                const newCursorPosition = selection.start + before.length;
                textInputRef.current?.setSelection(newCursorPosition, newCursorPosition);
            }, 0);
        }
    };

    const revert = () => {
        if (history.length > 0) {
            const previousState = history[history.length - 1];
            onChangeText(previousState);
            setHistory(prev => prev.slice(0, -1));
        }
    }

    const onDrop = useCallback((event: React.DragEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                insertMarkdown(`![${file.name}](${result})`);
            }
            reader.readAsDataURL(file);
        }
    }, []);
    const insertHeader = (level: string) => {
        const headerMarker = '#'.repeat(parseInt(level.value));
        insertMarkdown(`${headerMarker} `, '\n');
    };
    // Upload image
    const [alert, setAlert] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: '',
    });
    const handleImageUpload = async (projectId: string) => {
        // Request permissions
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            setAlert({ isOpen: true, message: "You've refused to allow this app to access your photos!" });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const file = {
                uri: result.assets[0].uri,
                name: result.assets[0].fileName || 'upload.jpg',
                type: result.assets[0].mimeType || 'image/jpeg'
            };

            try {
                const uploadImage = async () => uploadToProject.mutateAsync({ projectId, file })
                const response = await uploadImage()
                return response
            } catch (error) {
                setAlert({ isOpen: true, message: `Error uploading image: ${error.message}` });
                console.error('Error uploading image:', error)
            }
        }
    };

    return (
        <>
            <ErrorAlert
                isOpen={alert.isOpen}
                onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
                message={alert.message}
            />
            <View className='flex-1 mb-4 border-2 border-white rounded-md'>
                <View className='flex-row items-center justify-between '>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <ToggleGroup
                            value={activeStyles}
                            onValueChange={setActiveStyles}
                            type='multiple'
                            className="flex-row bg-card-600"
                        >
                            <Select

                                onValueChange={(value) => insertHeader(value)}
                                className='bg-card-600 '
                            >
                                <SelectTrigger className="w-[120px] bg-card-600">
                                    <SelectValue
                                        className='text-sm bg-card-600 text-foreground native:text-lg'
                                        placeholder="Header"
                                    />
                                </SelectTrigger>
                                <SelectContent
                                    className='bg-card-600'
                                >
                                    <SelectItem value="1" label="H1" className='text-white' />
                                    <SelectItem value="2" label="H2" className='text-white'><Octicons name="heading" size={16} color="white" />2</SelectItem>
                                    <SelectItem value="3" label="H3" className='text-white'><Octicons name="heading" size={16} color="white" />3</SelectItem>
                                    <SelectItem value="4" label="H4" className='text-white'><Octicons name="heading" size={16} color="white" />4</SelectItem>
                                    <SelectItem value="5" label="H5" className='text-white'><Octicons name="heading" size={16} color="white" />5</SelectItem>
                                    <SelectItem value="6" label="H6" className='text-white'><Octicons name="heading" size={16} color="white" />6</SelectItem>
                                </SelectContent>
                            </Select>
                            <Separator orientation="vertical" className="w-px h-6 mx-1 bg-white" />
                            <ToolbarButton icon={Bold} label='Bold' onPress={() => insertMarkdown("**", "**")} />
                            <ToolbarButton icon={Italic} label='Italic' onPress={() => insertMarkdown("*", "*")} />
                            <ToolbarButton icon={Underline} label='Underline' onPress={() => insertMarkdown("__", "__")} />
                            <ToolbarButton icon={Strikethrough} label="Strikethrough" onPress={() => insertMarkdown("~~", "~~")} />
                            <Separator orientation="vertical" className="w-px h-6 mx-1 bg-white" />
                            <ToolbarButton icon={Quote} label="Blockquote" onPress={() => insertMarkdown("> ")} />
                            <ToolbarButton icon={ListOrdered} label="Numbered List" onPress={() => insertMarkdown("1. ")} />
                            <ToolbarButton icon={List} label="Bulleted List" onPress={() => insertMarkdown("- ")} />
                            <ToolbarButton icon={ListChecks} label="Ckeck List" onPress={() => insertMarkdown("- [ ] ")} />
                            <ToolbarButton icon={ChevronDown} label="Collapsible Section" onPress={() => insertMarkdown("<details>\n<summary>Title</summary>\n\nContent\n</details>")} />
                            <Separator orientation="vertical" className="w-px h-6 mx-1 bg-white" />
                            <ToolbarButton icon={Code} label="Code" onPress={() => insertMarkdown("`", "`")} />
                            <ToolbarButton icon={CodeXml} label="Code Block" onPress={() => insertMarkdown("```\n", "\n```")} />
                            <ToolbarButton icon={Link} label="Link" onPress={() => insertMarkdown("[", "](url)")} />
                            <ToolbarButton icon={ImageIcon} label="Image" onPress={async () => {
                                const response = await handleImageUpload(projectId)
                                insertMarkdown(response.markdown)
                            }} />
                            <Separator orientation="vertical" className="w-px h-6 mx-1 bg-white" />
                            <ToolbarButton icon={Undo} label="Undo" onPress={revert} disabled={history.length === 0} />
                            <ToolbarButton icon={CircleX} label="Clear" onPress={() => onChangeText('')} />
                        </ToggleGroup>
                    </ScrollView>

                    {/* <ToolbarButton icon="eye" label="Toggle Preview" onPress={() => setIsPreview(!isPreview)} /> */}
                </View>
                <Separator className="bg-white " />

                <Textarea
                    ref={textInputRef}
                    id="markdown-input"
                    value={markdown}
                    onChangeText={updateMarkdown}
                    onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
                    multiline={true}
                    numberOfLines={10}
                    className="flex-1 rounded-md bg-background text-foreground"
                    // Add onDrop and onDragOver handlers for web
                    {...(Platform.OS === 'web' && { onDrop, onDragOver: (e: React.DragEvent<HTMLTextAreaElement>) => e.preventDefault() })}
                />


            </View >
            {preview && markdown.length > 0 &&
                <View className='flex-1 p-2 border-2 border-white rounded-md'>
                    {/* <Text className='text-lg font-bold text-white'>{markdown}</Text> */}
                    <MarkdownCustom                    >
                        {markdown}
                    </MarkdownCustom>

                </View >

            }
        </>
    );


}
