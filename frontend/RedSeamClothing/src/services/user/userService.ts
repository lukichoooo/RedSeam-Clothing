import { type User } from "./user.types";

// ususally fetched form backend
const userService = {
    getUserFromLocalStorage(): User | null
    {
        const userString = localStorage.getItem('user');
        if (userString)
        {
            return JSON.parse(userString) as User;
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
