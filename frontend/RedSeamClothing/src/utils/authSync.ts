// src/utils/authSync.ts (New file, based on logic from Navbar)

import userService from '../services/user/userService';
import { type User } from '../services/user/user.types';

const IMAGE_BASE_URL = 'https://api.redseam.redberryinternship.ge';

const getAbsoluteImageUrl = (path: string | undefined): string | undefined =>
{
    if (!path) return undefined;
    if (path.startsWith('http'))
    {
        return path;
    }
    return `${IMAGE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};


export const getAndNormalizeUser = (): User | null =>
{
    const user = userService.getUserFromLocalStorage();
    if (user)
    {
        const absoluteUrl = getAbsoluteImageUrl(user.profile_photo);
        if (absoluteUrl)
        {
            user.profile_photo = absoluteUrl;
        }
    }
    return user;
};


export const triggerAuthUpdate = () =>
{
    // This event should run in the current tab, unlike the 'storage' event.
    window.dispatchEvent(new Event('localAuthUpdate'));
};