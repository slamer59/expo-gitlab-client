import { Text } from '@/components/ui/text';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { SectionTitle } from '../Section/param';

export default function EditTargetBranchMergeRequest({ projectId, mrIid }) {
    const { session } = useSession();
    const api = new GitLabClient({ url: session?.url, token: session?.token });
    const [selectedBranch, setSelectedBranch] = useState("");

    const { data: mr, loading: mrLoading } = api.useProjectMergeRequest(projectId, mrIid) ?? {};
    const { execute: updateMergeRequest, loading: updating } = api.useUpdateProjectMergeRequest(projectId, mrIid);
    const { data: branches, loading: branchesLoading } = api.useProjectBranches(projectId);

    useEffect(() => {
        if (mr) setSelectedBranch(mr.target_branch);
    }, [mr]);

    useEffect(() => {
        if (selectedBranch && selectedBranch !== mr?.target_branch) {
            updateMergeRequest({ target_branch: selectedBranch }).catch(console.error);
        }
    }, [selectedBranch]);

    const insets = useSafeAreaInsets();
    const contentInsets = { top: insets.top, bottom: insets.bottom, left: 12, right: 12 };


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
                        <SelectContent insets={contentInsets} className='w-full'>
                            <SelectGroup>
                                {(mrLoading || branchesLoading) ? (
                                    <SelectItem disabled>Loading branches...</SelectItem>
                                ) : (
                                    branches.map((branch) => (
                                        <SelectItem key={branch.name} label={branch.name} value={branch.name}>
                                            {branch.name}
                                        </SelectItem>
                                    ))
                                )}

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
