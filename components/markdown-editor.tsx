import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, ChevronDown, Code, CodeXml, ImageIcon, Italic, Link, List, ListChecks, ListOrdered, Quote, Strikethrough, Underline } from '@/lib/icons/All';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { Platform, ScrollView, TextInput, View } from 'react-native';


import { CircleX, Undo } from 'lucide-react-native';

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

export default function EnhancedMarkdownEditor() {
    const [markdown, setMarkdown] = useState<string>('');
    const [history, setHistory] = useState<string[]>([]);
    const [activeStyles, setActiveStyles] = useState<string[]>([]);

    const updateMarkdown = (newMarkdown: string) => {
        setHistory(prev => [...prev, markdown])
        setMarkdown(newMarkdown)
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

            setMarkdown(newText);

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
            setMarkdown(previousState);
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
        console.log(level)
        const headerMarker = '#'.repeat(parseInt(level.value));
        insertMarkdown(`${headerMarker} `, '\n');
    };

    return (
        <View className='flex-1 border-2 border-white rounded-md '>
            <View className='flex-row items-center justify-between '>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                    <ToggleGroup
                        value={activeStyles}
                        onValueChange={setActiveStyles}
                        type='multiple'
                        className="flex-row bg-card"
                    >
                        <Select

                            onValueChange={(value) => insertHeader(value)}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue
                                    className='text-sm text-foreground native:text-lg'
                                    placeholder="Header"
                                />
                            </SelectTrigger>
                            <SelectContent
                                className='bg-card'
                            >
                                <SelectItem value="1" label="Heading 1" className='text-white'>Heading 1</SelectItem>
                                <SelectItem value="2" label="Heading 2" className='text-white'>Heading 2</SelectItem>
                                <SelectItem value="3" label="Heading 3" className='text-white'>Heading 3</SelectItem>
                                <SelectItem value="4" label="Heading 4" className='text-white'>Heading 4</SelectItem>
                                <SelectItem value="5" label="Heading 5" className='text-white'>Heading 5</SelectItem>
                                <SelectItem value="6" label="Heading 6" className='text-white'>Heading 6</SelectItem>
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
                        <ToolbarButton icon={ImageIcon} label="Image" onPress={() => insertMarkdown("![alt text](imageUrl)")} />
                        <Separator orientation="vertical" className="w-px h-6 mx-1 bg-white" />
                        <ToolbarButton icon={Undo} label="Undo" onPress={revert} disabled={history.length === 0} />
                        <ToolbarButton icon={CircleX} label="Clear" onPress={() => setMarkdown('')} />
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
                className="flex-1 rounded-md bg-card text-foreground"
                // Add onDrop and onDragOver handlers for web
                {...(Platform.OS === 'web' && { onDrop, onDragOver: (e: React.DragEvent<HTMLTextAreaElement>) => e.preventDefault() })}
            />
            {/* 
                        <View className="flex-1 p-4 bg-white rounded">
                            <Text>{markdown}</Text>
                        </View>
                    )
                } */}
        </View >
    );


}


