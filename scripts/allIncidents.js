function fetchAndDisplayIncidents(endpoint) { //pour afficher les incidents
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

            card.appendChild(typeElement);
            card.appendChild(locationElement);
            card.appendChild(descriptionElement);
            incidentsList.appendChild(card);

        });
    })
    .catch(error => console.error('Error:', error));
};
document.addEventListener('DOMContentLoaded', function() { // des que la page est chargée, on affiche les incidents
    fetchAndDisplayIncidents('/getallIncidents');
});

window.onload = function() { //pour que la page se recharge en haut
    window.scrollTo(0, 0);
  }