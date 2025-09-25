// src/services/user/ProfileService.ts

import api from './api';

const API_URL = 'https://api.your-domain.com/profile'; // TODO: Replace with your actual API URL

export const uploadProfileImage = async (file: File): Promise<any> =>
{
    try
    {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await api.post('/profile/upload-image', formData, {
            // The Content-Type header is explicitly set to 'multipart/form-data'
            // for file uploads, which overrides the default 'application/json'.
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error)
    {
        console.error('Error uploading profile image:', error);
        throw error;
    }
};

export const deleteProfileImage = async (): Promise<any> =>
{
    try
    {
        const response = await api.delete('/profile/delete-image');

        return response.data;
    } catch (error)
    {
        console.error('Error deleting profile image:', error);
        throw error;
    }
};
