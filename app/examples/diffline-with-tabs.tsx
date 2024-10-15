import { Octicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { tomorrowNight as SyntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Text } from '~/components/ui/text';



const MRVersionsDiff = {
    "id": 110,
    "head_commit_sha": "33e2ee8579fda5bc36accc9c6fbd0b4fefda9e30",
    "base_commit_sha": "eeb57dffe83deb686a60a71c16c32f71046868fd",
    "start_commit_sha": "eeb57dffe83deb686a60a71c16c32f71046868fd",
    "created_at": "2016-07-26T14:44:48.926Z",
    "merge_request_id": 105,
    "state": "collected",
    "real_size": "1",
    "patch_id_sha": "d504412d5b6e6739647e752aff8e468dde093f2f",
    "commits": [{
        "id": "33e2ee8579fda5bc36accc9c6fbd0b4fefda9e30",
        "short_id": "33e2ee85",
        "parent_ids": [],
        "title": "Change year to 2018",
        "author_name": "Administrator",
        "author_email": "admin@example.com",
        "authored_date": "2016-07-26T17:44:29.000+03:00",
        "committer_name": "Administrator",
        "committer_email": "admin@example.com",
        "committed_date": "2016-07-26T17:44:29.000+03:00",
        "created_at": "2016-07-26T17:44:29.000+03:00",
        "message": "Change year to 2018",
        "trailers": {},
        "extended_trailers": {},
        "web_url": "https://gitlab.example.com/project/-/commit/33e2ee8579fda5bc36accc9c6fbd0b4fefda9e30"
    }, {
        "id": "aa24655de48b36335556ac8a3cd8bb521f977cbd",
        "short_id": "aa24655d",
        "parent_ids": [],
        "title": "Update LICENSE",
        "author_name": "Administrator",
        "author_email": "admin@example.com",
        "authored_date": "2016-07-25T17:21:53.000+03:00",
        "committer_name": "Administrator",
        "committer_email": "admin@example.com",
        "committed_date": "2016-07-25T17:21:53.000+03:00",
        "created_at": "2016-07-25T17:21:53.000+03:00",
        "message": "Update LICENSE",
        "trailers": {},
        "extended_trailers": {},
        "web_url": "https://gitlab.example.com/project/-/commit/aa24655de48b36335556ac8a3cd8bb521f977cbd"
    }, {
        "id": "3eed087b29835c48015768f839d76e5ea8f07a24",
        "short_id": "3eed087b",
        "parent_ids": [],
        "title": "Add license",
        "author_name": "Administrator",
        "author_email": "admin@example.com",
        "authored_date": "2016-07-25T17:21:20.000+03:00",
        "committer_name": "Administrator",
        "committer_email": "admin@example.com",
        "committed_date": "2016-07-25T17:21:20.000+03:00",
        "created_at": "2016-07-25T17:21:20.000+03:00",
        "message": "Add license",
        "trailers": {},
        "extended_trailers": {},
        "web_url": "https://gitlab.example.com/project/-/commit/3eed087b29835c48015768f839d76e5ea8f07a24"
    }],
    "diffs": [{
        "old_path": "LICENSE",
        "new_path": "LICENSE",
        "a_mode": "0",
        "b_mode": "100644",
        "diff": "@@ -0,0 +1,21 @@\n+The MIT License (MIT)\n+\n+Copyright (c) 2018 Administrator\n+\n+Permission is hereby granted, free of charge, to any person obtaining a copy\n+of this software and associated documentation files (the \"Software\"), to deal\n+in the Software without restriction, including without limitation the rights\n+to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n+copies of the Software, and to permit persons to whom the Software is\n+furnished to do so, subject to the following conditions:\n+\n+The above copyright notice and this permission notice shall be included in all\n+copies or substantial portions of the Software.\n+\n+THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n+IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n+FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n+AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n+LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n+OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n+SOFTWARE.\n",
        "new_file": true,
        "renamed_file": false,
        "deleted_file": false,
        "generated_file": false
    }]
}

const DiffLine = ({ type, content }) => (
    <View className={`flex-row ${type === 'add' ? 'bg-green-900' : type === 'remove' ? 'bg-red-900' : ''}`}>
        <Text className={`w-6 ${type === 'add' ? 'text-green-500' : type === 'remove' ? 'text-red-500' : 'text-gray-500'}`}>
            {type === 'add' ? '+' : type === 'remove' ? '-' : ' '}
        </Text>
        <Text className="flex-1 text-white">{content}</Text>
    </View>
);

const DiffViewer = () => {
    const [activeTab, setActiveTab] = useState('changes');

    const renderDiffContent = () => (
        <ScrollView>
            <View className="p-4">
                <Text className="mb-2 font-bold text-white">app/(tabs)/index.tsx</Text>
                <View className="p-2 bg-gray-800 rounded">
                    <DiffLine type="context" content="@@ -104,6 +104,12 @@ export default function Home() {" />
                    <DiffLine type="context" content="// itemColor: &quot;bg-green&quot;" />
                    <DiffLine type="context" content="// }," />
                    <DiffLine type="context" content="// Tree" />
                    <DiffLine type="add" content="{" />
                    <DiffLine type="add" content="  icon: &quot;arrow-forward&quot;," />
                    <DiffLine type="add" content="  text: &quot;DevFileDisplay&quot;," />
                    <DiffLine type="add" content="  screen: &quot;tree/59853773/&quot;," />
                    <DiffLine type="add" content="  itemColor: &quot;bg-tree&quot;" />
                    <DiffLine type="add" content="}," />
                    <DiffLine type="context" content="{" />
                    <DiffLine type="context" content="  icon: &quot;arrow-forward&quot;," />
                    <DiffLine type="context" content="  text: &quot;DevFolderTree&quot;," />
                </View>
            </View>

            <View className="p-4">
                <Text className="mb-2 font-bold text-white">app/(tabs)/index.tsx</Text>
                <SyntaxHighlighter
                    language="typescript"
                    style={SyntaxStyle}
                    customStyle={{ backgroundColor: '#1e1e1e', padding: 10 }}
                >
                    {MRVersionsDiff["diffs"][0]["diff"].replace(/\\n/g, '\n')}
                    {/* {`@@ -104,6 +104,12 @@ export default function Home() {
  // itemColor: "bg-green"
  // },
  // Tree
+  {
+    icon: "arrow-forward",
+    text: "DevFileDisplay",
+    screen: "tree/59853773/",
+    itemColor: "bg-tree"
+  },
  {
    icon: "arrow-forward",
    text: "DevFolderTree",`} */}
                </SyntaxHighlighter>
            </View>
        </ScrollView>
    );

    return (
        <ScrollView
            className="flex-1 p-4 bg-background"
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
        >

            <View className="p-4">
                <Text className="text-xl font-bold text-white">Draft: Resolve "Better support of read files"</Text>
                <View className="flex-row items-center mt-2">
                    <Octicons name="git-merge" size={16} color="green" />
                    <Text className="ml-2 text-green-500">Open</Text>
                    <Text className="ml-2 text-gray-400">Thomas PEDOT requested to merge 41-better-support-of-read... into main just now</Text>
                </View>
            </View>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full flex-col gap-1.5 "
            >
                {/* <TabsList className="flex-row w-full bg-transparent border-b-2 border-muted"> */}

                <TabsList className="flex-row w-full bg-transparent">
                    <TabsTrigger value="overview"
                        className={`transition-colors text-foreground hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground ${activeTab === 'overview' ? 'bg-accent border-b-2 border-orange-500 text-accent-foreground' : ''}`}
                    >
                        <Text>Overview</Text>
                    </TabsTrigger>
                    <TabsTrigger
                        value="commits"
                        className={`transition-colors text-foreground hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground ${activeTab === 'commits' ? 'bg-accent border-b-2 border-orange-500 text-accent-foreground' : ''}`}
                    >
                        <Text>Commits</Text>
                    </TabsTrigger>
                    <TabsTrigger
                        value="changes"
                        className={`transition-colors text-foreground hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground ${activeTab === 'changes' ? 'bg-accent border-b-2 border-orange-500 text-accent-foreground' : ''}`}
                    >
                        <Text>Changes</Text>
                    </TabsTrigger>

                </TabsList>
                <TabsContent value="overview">
                    <Card style={{ shadowOffset: { width: 0, height: 2 } }}>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>
                                Summary of the changes in this merge request.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Text>This merge request adds better support for read files.</Text>
                            <View className="flex-row mt-2">
                                <Text className="text-green-500">+138</Text>
                                <Text className="ml-2 text-red-500">-37</Text>
                            </View>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="commits">
                    <Card style={{ shadowOffset: { width: 0, height: 2 } }}>
                        <CardHeader>
                            <CardTitle>Commits</CardTitle>
                            <CardDescription>
                                List of commits in this merge request.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Text>Commit 1: Initial implementation of file reading</Text>
                            <Text>Commit 2: Bug fixes and performance improvements</Text>
                            <Text>Commit 3: Add support for additional file types</Text>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="changes">
                    <Card style={{ shadowOffset: { width: 0, height: 2 } }}>
                        <CardHeader>
                            <CardTitle>Changes</CardTitle>
                            <CardDescription>
                                Detailed view of the changes in this merge request.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderDiffContent()}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </ScrollView >
    );
};

export default DiffViewer;