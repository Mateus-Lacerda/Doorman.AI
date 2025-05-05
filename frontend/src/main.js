import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'


document.querySelector('#app').innerHTML = `
        <h1>Manage your configurations</h1>
        <ul>
            <button data-page="/user/manage.html">Manage Users</button>
            <br>
            <br>
            <button data-page="/doorman/app.html">Doorman App</button>
        </ul>
`

document.addEventListener('DOMContentLoaded', () => {
    history.pushState(null, '', '/home');
});

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const page = button.getAttribute('data-page');
        if (page) {
            window.location.assign(page);
        }
    });
});
