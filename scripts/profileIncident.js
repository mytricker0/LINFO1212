
function makeEditable(element) { 
    element.contentEditable = true;
    element.classList.add('editable');
}

function deleteIncident(incidentId, cardElement) { // en envoie une requete au server.js pour supprimer l'incident
    fetch(`/deleteIncident/${incidentId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            
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

            
            const editButton = document.createElement('button'); //Bouton pour editer l'incident
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

            const deleteButton = document.createElement('button'); //Bouton pour supprimer l'incident
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = function() {
                if (confirm('Are you sure you want to delete this incident?')) { // un pop up s'affiche pour confirmer la suppression
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
document.addEventListener('DOMContentLoaded', function() { // des que la page est chargée, on affiche les incidents 
    fetchAndDisplayIncidents('/getUserIncidents');
});