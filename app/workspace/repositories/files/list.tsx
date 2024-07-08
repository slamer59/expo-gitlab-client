import React from 'react';
import Tree from 'react-complex-tree';
import 'react-complex-tree/lib/style.css';
import { Text, View } from 'react-native';

const treeData = [
    {
        name: 'Root',
        children: [
            {
                name: 'Folder 1',
                children: [
                    { name: 'File 1' },
                    { name: 'File 2' },
                ],
            },
            {
                name: 'Folder 2',
                children: [
                    { name: 'File 3' },
                    { name: 'File 4' },
                ],
            },
        ],
    },
];

export default function MScreen() {

    return (
        <View className="container">
            <Tree
                tree={treeData}
                rootLabel="My Tree"
                renderItem={({ name }) => <Text>{name}</Text>}
            />
        </View>
    );
};

