import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

import { SectionTitle } from '../Section/param';

export default function EditTargetBranchMergeRequest({ projectId, mrIid, target_branch, onBranchChange }) {
    const [selectedBranch, setSelectedBranch] = useState("");

    const { session } = useSession();
    const client = new GitLabClient({ url: session?.url, token: session?.token });
    const api = useGitLab(client);

    const { data: mr, loading: mrLoading } = mrIid ? api.useProjectMergeRequest(projectId, mrIid) ?? {} : { data: { target_branch }, loading: false };
    const { execute: updateMergeRequest, loading: updating } = mrIid ? api.useUpdateProjectMergeRequest(projectId, mrIid) : { execute: null, loading: false };
    const { data: branches, loading: branchesLoading } = api.useProjectBranches(projectId);

    useEffect(() => {
        if (mr) setSelectedBranch(mr.target_branch);
    }, [mr]);

    useEffect(() => {
        if (selectedBranch) {
            if (mrIid && selectedBranch !== mr?.target_branch) {
                updateMergeRequest({ target_branch: selectedBranch }).catch(console.error);
            } else if (onBranchChange) {
                onBranchChange(selectedBranch);
            }
        }
    }, [selectedBranch]);

    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
        left: 12,
        right: 12,
    };

    return (
        <ScrollView>
            <SectionTitle title="Target Branch" />
            {branches && branches.length > 0 ? (
                <View className="flex-col mb-4">
                    <Select
                        defaultValue={selectedBranch}
                        onValueChange={(branch) => setSelectedBranch(branch?.value)}
                        disabled={updating}
                    >
                        <SelectTrigger className='w-full'>
                            <SelectValue
                                className='text-sm text-foreground native:text-lg'
                                placeholder={updating ? 'Updating...' : (selectedBranch || 'No branch selected')}
                            />
                        </SelectTrigger>
                        <SelectContent insets={contentInsets} className='w-[250px]  mt-1 font-bold rounded-2xl '>
                            <SelectGroup>
                                <ScrollView className='max-h-32'>
                                    {branches?.map((branch) => (
                                        <SelectItem
                                            key={branch.name}
                                            label={branch.name}
                                            value={branch.name}
                                        >
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </ScrollView>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </View>
            ) : (
                <Text className="h-12 mb-4 text-muted">No branches available</Text>
            )}
        </ScrollView>
    );
}
