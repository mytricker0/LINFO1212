document.addEventListener('DOMContentLoaded', function () { // des que la page est chargée (html uniquement )
    var requestOptions = {
        method: 'GET',
    };

    const addressInput = document.getElementById('address'); 
    const resultContainer = document.getElementById('result');

    
    function fetchAutocompleteResults(query) { // fonction pour autococomplete l'adresse
        // on utilise Geoapify API 
        const apiUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=e76e4f6f42704949a60537ef27cfd926&limit=3`; // Limit results to 5

        fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(result => {
                
                if (result.features && result.features.length > 0) {
                    resultContainer.innerHTML = '';
                    result.features.forEach(feature => {
                        const displayName = feature.properties.formatted;
                        const resultItem = document.createElement('p');
                        resultItem.textContent = `${displayName}`;
                        resultItem.addEventListener('click', function () { // si on clique sur une des adresses proposées, 
                        addressInput.value = displayName; //on affiche l'adresse dans l'input
                            resultContainer.style.display = 'none'; // on efface les suggestions
                        });
                        resultContainer.appendChild(resultItem);
                    });
                    resultContainer.style.display = 'block'; 
                } else {
                    resultContainer.innerHTML = ''; // on efface les suggestions
                    resultContainer.style.display = 'none'; // si pas de resultat, 
                }
            })
            .catch(error => console.log('error', error));
    }

   
    addressInput.addEventListener('input', function () {
        const query = addressInput.value;
        if (query.length >= 3) {
            fetchAutocompleteResults(query);
        } else {
            resultContainer.innerHTML = ''; //effacter les recomendation si moins de 3 caracteres
            resultContainer.style.display = 'none'; // on efface le container si moins de 3 caracteres
        }
    });
});
