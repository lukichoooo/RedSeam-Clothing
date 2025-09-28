// src/services/user/userService.ts

import { type User } from "./user.types";

const IMAGE_BASE_URL = 'https://api.redseam.redberryinternship.ge';

const getAbsoluteImageUrl = (path: string | undefined): string | undefined =>
{
    if (!path)
    {
        return undefined;
    }
    if (path.startsWith('http'))
    {
        return path;
    }
    return `${IMAGE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};


const userService = {
    getUserFromLocalStorage(): User | null
    {
        const userString = localStorage.getItem('user');
        if (userString)
        {
            const user: User = JSON.parse(userString) as User;

            const absolutePhotoUrl = getAbsoluteImageUrl(user.profile_photo);
            if (absolutePhotoUrl)
            {
                user.profile_photo = absolutePhotoUrl;
            } else
            {
                user.profile_photo = '';
            }

            return user;
        }
        return null;
    },

    setUserToLocalStorage(user: User): void
    {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUserAvatar(): undefined | string
    {
        return userService.getUserFromLocalStorage()?.profile_photo;
    }
};

export default userService;