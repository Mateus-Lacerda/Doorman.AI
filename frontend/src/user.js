import './style.css'

import { userHook } from './hooks/user_hook.js'
import { pictureHook } from './hooks/picture_hook.js'
import { captureCameraImage } from './util.js'

// Here we will add, edit, delete and show users
//
const renderMainMenu = () => {
    document.querySelector('#app').innerHTML = `
        <h1>CV Doorman</h1>
        <button id="back-button">Home</button>
        <br><br>
        <div id="select-operation">
            <button id="add-user">Add User</button>
            <br><br>
            <button id="edit-user">Edit User</button>
            <br><br>
            <button id="delete-user">Delete User</button>
            <br><br>
            <button id="search-user">Search User</button>
        </div>
    `;
    const backButton = document.getElementById('back-button');
    const addUserButton = document.getElementById('add-user');
    const editUserButton = document.getElementById('edit-user');
    const deleteUserButton = document.getElementById('delete-user');
    const searchUsersButton = document.getElementById('search-user');

    // Go back to the main menu
    backButton.addEventListener('click', function() {
        // Go back to the home page
        window.location.href = 'index.html';
    });

    // Add user
    addUserButton.addEventListener('click', function() {
        // Show the add user form
        document.querySelector('#app').innerHTML = `
            <h1>Add User</h1>
            <button id="back-button">Back</button>
            <br><br>
            <form id="add-user-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <br><br>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <br><br>
                <label for="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" required>
                <br><br>
                <label for="apartment">Apartment:</label>
                <input type="text" id="apartment" name="apartment" required>
                <br><br>
                <button type="submit">Add User</button>
            </form>
        `;
        const backButton = document.getElementById('back-button');
        backButton.addEventListener('click', function() {
            // Go back to the main menu
            renderMainMenu()
        });
        const addUserForm = document.getElementById('add-user-form');
        addUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Clear the form and get the picture
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const apartment = document.getElementById('apartment').value;
            const response = userHook.addUser({
                name: name,
                email: email,
                phone: phone,
                apartment: apartment
            }).then((response) => {
                console.log('User added successfully:', response);
                const userId = response.id;
                const containerId = 'app';
                captureCameraImage(document, containerId)
                    .then((dataUrl) => {
                        // Save the picture to the server
                        const pictureData = {
                            user_id: parseInt(userId),
                            image: dataUrl,
                        };
                        console.log('Picture data:', pictureData);
                        pictureHook.addPicture(pictureData)
                            .then((response) => {
                                console.log('Picture added successfully:', response);
                            })
                            .catch((error) => {
                                console.error('Error adding picture:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error capturing image:', error);
                    });
            }).catch((error) => {
                console.error('Error adding user:', error);
            });
        });
    });

    // Edit user
    editUserButton.addEventListener('click', function() {
        // Show the edit user form
        document.querySelector('#app').innerHTML = `
            <h1>Edit User</h1>
            <button id="back-button">Back</button>
            <br><br>
            <form id="edit-user-form">
                <label for="user-id">User ID:</label>
                <input type="text" id="user-id" name="user-id" required>
                <br><br>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name">
                <br><br>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email">
                <br><br>
                <label for="phone">Phone:</label>
                <input type="tel" id="phone" name="phone">
                <br><br>
                <label for="apartment">Apartment:</label>
                <input type="text" id="apartment" name="apartment">
                <br><br>
                <input type="checkbox" id="update-picture" name="update-picture">
                <label for="update-picture">Update Picture</label>
                <br><br>
                <button type="submit">Edit User</button>
            </form>
        `;
        const backButton = document.getElementById('back-button');
        backButton.addEventListener('click', function() {
            // Go back to the main menu
            renderMainMenu()
        });
        const editUserForm = document.getElementById('edit-user-form');
        editUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const updatePicture = document.getElementById('update-picture').checked;
            const userId = document.getElementById('user-id').value;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const apartment = document.getElementById('apartment').value;
            if (updatePicture) {
                // Clear the form and get the picture
                const containerId = 'app';
                captureCameraImage(document, containerId)
                    .then((dataUrl) => {
                        // Save the picture to the server
                        const pictureData = {
                            image: dataUrl,
                        };
                        console.log('Picture data:', pictureData);
                        pictureHook.updatePictureData(userId, pictureData)
                            .then((response) => {
                                console.log('Picture updated successfully:', response);
                            })
                            .catch((error) => {
                                console.error('Error updating picture:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error capturing image:', error);
                    });
            }
            userHook.updateUser(userId, {
                name: name,
                email: email,
                phone: phone,
                apartment: apartment
            });
        });
    });

    // Delete user
    deleteUserButton.addEventListener('click', function() {
        // Show the delete user form
        document.querySelector('#app').innerHTML = `
            <h1>Delete User</h1>
            <button id="back-button">Back</button>
            <br><br>
            <form id="delete-user-form">
                <label for="user-id">User ID:</label>
                <input type="text" id="user-id" name="user-id" required>
                <br><br>
                <button type="submit">Delete User</button>
            </form>
        `;
        const backButton = document.getElementById('back-button');
        backButton.addEventListener('click', function() {
            // Go back to the main menu
            renderMainMenu()
        });
        const deleteUserForm = document.getElementById('delete-user-form');
        deleteUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const userId = document.getElementById('user-id').value;
            userHook.deleteUser(userId);
            pictureHook.deletePictureData(userId)
                .then((response) => {
                    console.log('Picture deleted successfully:', response);
                })
                .catch((error) => {
                    console.error('Error deleting picture:', error);
                });
        });
    });


    // Search user
    searchUsersButton.addEventListener('click', function() {
        // Show the search user form
        document.querySelector('#app').innerHTML = `
            <h1>Search Users</h1>
            <button id="back-button">Back</button>
            <br><br>
            <form id="search-user-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name">
                <br><br>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email">
                <br><br>
                <label for="phone">Phone:</label>
                <input type="tel" id="phone" name="phone">
                <br><br>
                <label for="apartment">Apartment:</label>
                <input type="text" id="apartment" name="apartment">
                <br><br>
                <button type="submit">Search User</button>
            </form>
        `;
        const backButton = document.getElementById('back-button');
        backButton.addEventListener('click', function() {
            // Go back to the main menu
            renderMainMenu()
        });
        const searchUserForm = document.getElementById('search-user-form');
        searchUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const apartment = document.getElementById('apartment').value;
            const searchParams = {
                name: name,
                email: email,
                phone: phone,
                apartment: apartment
            };
            const response = userHook.searchUser(searchParams)
                .then((response) => {
                    // Show the user data
                    document.querySelector('#app').innerHTML = `
                        <h1>User Data</h1>
                    `;
                    response.forEach(user => {
                        document.querySelector('#app').innerHTML += `
                            <h2>User ID: ${user.id}</h2>
                            <p>Name: ${user.name}</p>
                            <p>Email: ${user.email}</p>
                            <p>Phone: ${user.phone}</p>
                            <p>Apartment: ${user.apartment}</p>
                            <br><br>
                        `;
                    console.log('User data:', user);
                    });
                })
                .catch((error) => {
                    console.error('Error getting user data:', error);
                });
        });
    });

}
renderMainMenu();

