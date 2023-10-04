document.addEventListener('DOMContentLoaded', function () {
    var requestOptions = {
        method: 'GET',
    };

    const addressInput = document.getElementById('address');
    const resultContainer = document.getElementById('result');

    // Function to fetch autocomplete suggestions
    function fetchAutocompleteResults(query) {
        // Construct the URL for the Geoapify API autocomplete
        const apiUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=e76e4f6f42704949a60537ef27cfd926&limit=3`; // Limit results to 5

        fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(result => {
                // Display the autocomplete results
                resultContainer.innerHTML = '';
                if (result.features && result.features.length > 0) {
                    result.features.forEach(feature => {
                        const displayName = feature.properties.formatted;
                        const lat = feature.geometry.coordinates[1];
                        const lon = feature.geometry.coordinates[0];
                        const resultItem = document.createElement('p');
                        resultItem.textContent = `${displayName}`;
                        resultItem.addEventListener('click', function () {
                            // Set the clicked suggestion as the input value
                            addressInput.value = displayName;
                            resultContainer.innerHTML = ''; // Clear results after selection
                        });
                        resultContainer.appendChild(resultItem);
                    });
                } else {
                    resultContainer.textContent = 'No results found.';
                }
            })
            .catch(error => console.log('error', error));
    }

    // Event listener for input changes
    addressInput.addEventListener('input', function () {
        const query = addressInput.value;
        if (query.length >= 3) {
            fetchAutocompleteResults(query);
        } else {
            resultContainer.innerHTML = ''; // Clear results if input is less than 3 characters
        }
    });
});
