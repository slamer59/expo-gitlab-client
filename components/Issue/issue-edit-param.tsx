
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';


export function EditParamIssueDialog({ title, handleSave, loading, children }) {

    return <>
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="px-2 py-1 ml-2 text-sm text-white rounded bg-card-600"
                    variant='outline'
                    size={'icon'}
                >
                    <Ionicons name="pencil" size={16} color="white" />
                    {/* <Text>EDIT</Text> */}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-secondary'>Edit {title}</DialogTitle>
                    <DialogDescription>
                        Make changes to title and description issue here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Separator className='my-4 bg-primary' />
                {children}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            <Text>Cancel</Text>
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="secondary" onPress={handleSave} disabled={loading}>
                            <Text>{loading ? 'Saving...' : 'Save Changes'}</Text>
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >

    </>
}
