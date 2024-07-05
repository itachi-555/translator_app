document.addEventListener('DOMContentLoaded', function () {
    const selector1 = document.getElementById('Language');
    const selector2 = document.getElementById('ToLanguage');

    // Function to update the options of selector2 based on selector1's selected option
    function updateSelector2() {
        const selectedValue1 = selector1.value;
        for (let option of selector2.options) {
            option.disabled = option.value === selectedValue1;
        }
    }

    // Function to update the options of selector1 based on selector2's selected option
    function updateSelector1() {
        const selectedValue2 = selector2.value;
        for (let option of selector1.options) {
            option.disabled = option.value === selectedValue2;
        }
    }

    // Fetch languages function
    function fetchLanguages() {
        const url = 'http://localhost:3000/';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Clear existing options in selectors
                selector1.innerHTML = '';
                selector2.innerHTML = '';
                // Add new options from fetched data
                data.languages.forEach((element) => {
                    const option1 = document.createElement('option');
                    const option2 = document.createElement('option');
                    option1.value = element.code;
                    option1.textContent = element.name;
                    option2.value = element.code;
                    option2.textContent = element.name;
                    selector1.appendChild(option1);
                    selector2.appendChild(option2);
                });
                //default values
                selector1.value = 'en';
                selector2.value = 'ar';
                // Update selectors and initialize state
                updateSelector2();
                updateSelector1();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Initial fetch of languages on page load
    fetchLanguages();

    // Add event listeners to both selectors
    selector1.addEventListener('change', function () {
        updateSelector2();
        // If the same value is selected in both, adjust the second selector
        if (selector1.value === selector2.value) {
            selector2.selectedIndex = Array.from(selector2.options).findIndex(option => !option.disabled);
        }
    });

    selector2.addEventListener('change', function () {
        updateSelector1();
        // If the same value is selected in both, adjust the first selector
        if (selector1.value === selector2.value) {
            selector1.selectedIndex = Array.from(selector1.options).findIndex(option => !option.disabled);
        }
    });

    // Switch button functionality
    const switchButton = document.getElementById('switch');
    switchButton.addEventListener('click', function () {
        const tempValue = selector1.value;
        selector1.value = selector2.value;
        selector2.value = tempValue;
        document.getElementById('Word').value = document.getElementById('Translation').value;
        submitButton.click();
    });

    // Submit button functionality
    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', function () {
        const url = 'http://localhost:3000/translate';
        const word = document.getElementById('Word').value;
        const language = selector1.value;
        const toLanguage = selector2.value;

        const data = {
            word: word,
            language: language,
            tolanguage: toLanguage
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('Translation').value = data.translation;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
