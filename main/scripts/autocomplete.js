document.addEventListener('DOMContentLoaded', function () {
    var requestOptions = {
        method: 'GET',
    };

    const addressInput = document.getElementById('address');
    const resultContainer = document.getElementById('result');

    // Function to fetch autocomplete suggestions
    function fetchAutocompleteResults(query) {
        // Construct the URL for the Geoapify API autocomplete
        const apiUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=e76e4f6f42704949a60537ef27cfd926&limit=3&filter=countrycode:BE`; // Limit results to Belgium (country code: BE)

        fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(result => {
                // Display the autocomplete results or hide the container if no results
                if (result.features && result.features.length > 0) {
                    resultContainer.innerHTML = '';
                    result.features.forEach(feature => {
                        const displayName = feature.properties.formatted;
                        const lat = feature.geometry.coordinates[1];
                        const lon = feature.geometry.coordinates[0];

                        // Check if the result is in Louvain-la-Neuve (adjust as needed)
                        if (displayName.includes('Louvain-la-Neuve')) {
                            const resultItem = document.createElement('p');
                            resultItem.textContent = `${displayName}`;
                            resultItem.addEventListener('click', function () {
                                // Set the clicked suggestion as the input value
                                addressInput.value = displayName;
                                resultContainer.style.display = 'none'; // Hide the container after selection
                            });
                            resultContainer.appendChild(resultItem);
                        }
                    });
                    resultContainer.style.display = 'block'; // Show the container
                } else {
                    resultContainer.innerHTML = ''; // Clear any previous results
                    resultContainer.style.display = 'none'; // Hide the container if no results
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
            resultContainer.style.display = 'none'; // Hide the container if input is less than 3 characters
        }
    });
});