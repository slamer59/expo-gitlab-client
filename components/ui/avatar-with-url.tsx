import React, { useEffect, useState } from 'react';
import { getAvatarUrl } from '~/lib/utils/avatar';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface AvatarWithUrlProps {
    avatarUrl: string | null | undefined;
    fallbackText?: string;
    alt: string; // Making alt required since we need it for accessibility
    className?: string;
}

export const AvatarWithUrl: React.FC<AvatarWithUrlProps> = ({
    avatarUrl,
    fallbackText,
    alt,
    className
}) => {
    const [fullUrl, setFullUrl] = useState<string>('');

    useEffect(() => {
        const loadUrl = async () => {
            const url = await getAvatarUrl(avatarUrl);
            setFullUrl(url);
        };
        loadUrl();
    }, [avatarUrl]);

    return (
        <Avatar alt={alt} className={className}>
            {fullUrl && fullUrl.length > 0 ? (
                <AvatarImage source={{ uri: fullUrl }} />
            ) : (
                <AvatarFallback>
                    {fallbackText || alt.charAt(0).toUpperCase()}
                </AvatarFallback>
            )}
        </Avatar>
    );
};
