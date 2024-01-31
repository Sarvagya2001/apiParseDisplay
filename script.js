let importedData;

document.getElementById('file-input').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            importedData = JSON.parse(e.target.result);

            // Populate available fields options
            populateAvailableFields();
        };
        reader.readAsText(file);
    }
});

// Function to fetch data from the API
async function fetchDataFromAPI() {
    try {
        const response = await fetch('https://s3.amazonaws.com/open-to-cors/assignment.json');
        const data = await response.json();
        importedData = data;

        // Populate available fields options
        populateAvailableFields();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function importData() {
    fetchDataFromAPI();

  
}

function displayData() {
    if (importedData) {
        // Sort data based on descending popularity
        const sortedData = Object.values(importedData.products).sort((a, b) => b.popularity - a.popularity);

        // Get selected display options
        const selectedFields = getSelectedFields();

        // Create HTML table
        const table = document.createElement('table');
        const headerRow = table.insertRow();
        selectedFields.forEach(field => {
            const th = document.createElement('th');
            th.textContent = field;
            headerRow.appendChild(th);
        });

        sortedData.forEach(product => {
            const row = table.insertRow();
            selectedFields.forEach(field => {
                const cell = row.insertCell();
                cell.textContent = product[field];
            });
        });

        // Display the table
        const tableContainer = document.getElementById('table-container');
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    } else {
        alert('Please import data before displaying.');
    }
}

function getSelectedFields() {
    const displayFieldsSelect = document.getElementById('display-fields');
    return Array.from(displayFieldsSelect.options).map(option => option.value);
}

function populateAvailableFields() {
    const availableFieldsSelect = document.getElementById('available-fields');

    // Extract fields from the first product
    const sampleProduct = Object.values(importedData.products)[0];
    const fields = Object.keys(sampleProduct);

    // Add options to the available fields select
    fields.forEach(field => {
        const option = document.createElement('option');
        option.value = field;
        option.textContent = field;
        availableFieldsSelect.appendChild(option);
    });
}

function addSelectedFields() {
    const availableFields = document.getElementById('available-fields');
    const displayFields = document.getElementById('display-fields');

    for (let option of availableFields.selectedOptions) {
        displayFields.appendChild(option);
    }
}

function removeSelectedFields() {
    const availableFields = document.getElementById('available-fields');
    const displayFields = document.getElementById('display-fields');

    for (let option of displayFields.selectedOptions) {
        availableFields.appendChild(option);
    }
}

function cancel() {
    // Clear displayed data
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';

    // Reset selected fields
    const displayFields = document.getElementById('display-fields');
    displayFields.innerHTML = '';
}
