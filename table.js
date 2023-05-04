$(document).ready(function () {
    // Define your subjects and specification points
    const subjects = {
        psychology: [
            "Specification Point 1",
            "Specification Point 2",
            "Specification Point 3",
        ],
        // Add more subjects here
    };

    // Create the table
    function createTable(subject) {
        let table = $('<table>');
        let thead = $('<thead>');
        let tbody = $('<tbody>');
        let headerRow = $('<tr>');

        headerRow.append('<th>Specification Point</th>');
        headerRow.append('<th>Done</th>');
        thead.append(headerRow);

        for (let spec of subjects[subject]) {
            let row = $('<tr>');
            row.append(`<td>${spec}</td>`);
            row.append('<td><input type="checkbox" class="checkbox"></td>');
            tbody.append(row);
        }

        table.append(thead);
        table.append(tbody);

        return table;
    }

    $('#table-container').append(createTable('psychology'));

    // Save and load functions
    $('#save-btn').on('click', function () {
        let checkboxes = $('.checkbox');
        let checked = [];

        for (let checkbox of checkboxes) {
            checked.push(checkbox.checked);
        }

        let json = JSON.stringify(checked);
        let blob = new Blob([json], { type: 'application/json' });

        saveAs(blob, 'table.json');
    });

    $('#load-trigger').on('click', function () {
        $('#load-btn').click();
    });

    $('#load-btn').on('change', function (e) {
        let file = e.target.files[0];

        if (!file) {
            return;
        }

        let reader = new FileReader();
        reader.onload = function (e) {
            let contents = e.target.result;
            let checked = JSON.parse(contents);
            let checkboxes = $('.checkbox');

            for (let i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = checked[i];
            }
        };

        reader.readAsText(file);
    });

    // Update the table when the slider changes
    $('#sectionSlider').on('input', function () {
        let subjectId = $(this).val();

        // Update the table based on the subject id
        $('#table-container').empty();
        $('#table-container').append(createTable(subjectId));
    });
});

