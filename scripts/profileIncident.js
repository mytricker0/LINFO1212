// profileIncident.js

// Function to create an editable field
function makeEditable(element) {
    element.contentEditable = true;
    element.classList.add('editable');
}

function deleteIncident(incidentId, cardElement) {
    fetch(`/deleteIncident/${incidentId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the card from the DOM
            cardElement.remove();
        } else {
            alert('Error deleting incident');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to save the edited content
function saveIncident(incidentId, typeElement, locationElement, descriptionElement) {
    const data = {
        incidentType: typeElement.textContent,
        location: locationElement.textContent,
        description: descriptionElement.textContent
    };

    fetch(`/saveIncident/${incidentId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            typeElement.contentEditable = false;
            locationElement.contentEditable = false;
            descriptionElement.contentEditable = false;
            typeElement.classList.remove('editable');
            locationElement.classList.remove('editable');
            descriptionElement.classList.remove('editable');
        } else {
            alert('Error saving incident');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Event listener for the DOM content loaded
function fetchAndDisplayIncidents(endpoint) {
    fetch(endpoint)
    .then(response => response.json())
    .then(incidents => {
        const incidentsList = document.getElementById('incidents-list');
        incidents.forEach(incident => {
            const card = document.createElement('div');
            card.className = 'incident-card';
            const typeElement = document.createElement('p');
            const locationElement = document.createElement('p');
            const descriptionElement = document.createElement('p');

            typeElement.textContent = incident.incidentType;
            locationElement.textContent = incident.location;
            descriptionElement.textContent = incident.description;

            
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-button');
            editButton.onclick = function() {
                makeEditable(typeElement);
                makeEditable(locationElement);
                makeEditable(descriptionElement);
                editButton.textContent = 'Save';
                editButton.onclick = function() {
                    saveIncident(incident._id, typeElement, locationElement, descriptionElement);
                };
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = function() {
                if (confirm('Are you sure you want to delete this incident?')) {
                    deleteIncident(incident._id, card);
                }
            };

            card.appendChild(typeElement);
            card.appendChild(locationElement);
            card.appendChild(descriptionElement);
            card.appendChild(editButton);
            card.appendChild(deleteButton);
            incidentsList.appendChild(card);
        });
    })
    .catch(error => console.error('Error:', error));
};
document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayIncidents('/getUserIncidents');
});