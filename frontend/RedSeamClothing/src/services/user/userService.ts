import { type User } from "../../types";

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
    }
};

export default userService;
