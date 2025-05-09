const apiBaseUrl = 'http://localhost:8042/api/v1/user';


export const userHook = {
    async getUserData(userId) {
        try {
            const response = await fetch(`${apiBaseUrl}/${userId}`);
            if (!response.ok) {
                throw new Error(`Error fetching user data: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('User data:', data);
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async addUser(userData) {
        try {
            const response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error(`Error adding user: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async updateUser(userId, userData) {
        try {
            const response = await fetch(`${apiBaseUrl}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error(`Error updating user: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async deleteUser(userId) {
        try {
            const response = await fetch(`${apiBaseUrl}/${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Error deleting user: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async searchUser(searchParams) {
        try {
            const response = await fetch(`${apiBaseUrl}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams),
            });
            if (!response.ok) {
                throw new Error(`Error searching user: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

};
