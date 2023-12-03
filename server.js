const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let confessions = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// API endpoint to get all confessions
app.get('/api/confessions', (req, res) => {
    res.json(confessions);
});

// API endpoint to submit a confession
app.post('/api/confessions', (req, res) => {
    const confession = req.body.confession;
    confessions.push(confession);
    res.json({ message: 'Confession submitted successfully' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
document.addEventListener('DOMContentLoaded', () => {
    const confessionForm = document.getElementById('confessionForm');
    const confessionInput = document.getElementById('confessionInput');
    const confessionList = document.getElementById('confessionList');

    confessionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const confessionText = confessionInput.value;

        // Submit confession to the server
        fetch('/api/confessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ confession: confessionText }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            confessionInput.value = ''; // Clear the input field
            fetchConfessions(); // Refresh the confession list
        })
        .catch(error => console.error('Error submitting confession:', error));
    });

    // Fetch and display confessions on page load
    fetchConfessions();

    function fetchConfessions() {
        // Fetch all confessions from the server
        fetch('/api/confessions')
        .then(response => response.json())
        .then(data => {
            // Display confessions on the page
            renderConfessions(data);
        })
        .catch(error => console.error('Error fetching confessions:', error));
    }

    function renderConfessions(confessions) {
        // Clear previous confessions
        confessionList.innerHTML = '';

        // Render each confession as a list item
        confessions.forEach(confession => {
            const li = document.createElement('li');
            li.textContent = confession;
            confessionList.appendChild(li);
        });
    }
});