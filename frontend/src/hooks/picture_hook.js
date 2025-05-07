const apiBaseUrl = 'http://localhost:8042/api/v1/picture';


export const pictureHook = {
    async getPictureData(userId) {
        try {
            const response = await fetch(`${apiBaseUrl}/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching picture data:', error);
        }
    },

    async addPicture(pictureData) {
        try {
            const response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(pictureData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding picture data:', error);
        }
    },

    async updatePictureData(userId, pictureData) {
        try {
            const response = await fetch(`${apiBaseUrl}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(pictureData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating picture data:', error);
        }
    },

    async deletePictureData(userId) {
        try {
            const response = await fetch(`${apiBaseUrl}/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting picture data:', error);
        }
    },

    async recognize(pictureData) {
        try {
            const response = await fetch(`${apiBaseUrl}/recognize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(pictureData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error recognizing picture data:', error);
        }
    }
};
