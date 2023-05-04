document.addEventListener("DOMContentLoaded", () => {
    const tableContainer = document.querySelector("#tableContainer");
  
    function createTable(name = "New Table", rows = []) {
      const tableWrapper = document.createElement("div");
      tableWrapper.classList.add("table-wrapper");
  
      const header = document.createElement("div");
      header.classList.add("header");
      header.innerHTML = `
        <span class="arrow">&#x25BC;</span>
        <input type="text" value="${name}" class="table-name" />
        <button class="delete-table">X</button>
      `;
  
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            <th>Specification Point</th>
            <th>Checkbox</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      `;
  
      const tbody = table.querySelector("tbody");
      rows.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
  <td><textarea class="spec-point">${row.specPoint}</textarea></td>
  <td><input type="checkbox" ${row.checked ? "checked" : ""} /></td>
`;

        tbody.appendChild(tr);
      });
  
      header.addEventListener("click", () => {
        $(table).toggle();
        const arrow = header.querySelector(".arrow");
        arrow.innerHTML = arrow.innerHTML === "&#x25BC;" ? "&#x25B6;" : "&#x25BC;";
      });
  
      const deleteTableButton = header.querySelector(".delete-table");
      deleteTableButton.addEventListener("click", () => {
        tableWrapper.remove();
      });
  
      const addRowButton = document.createElement("button");
      addRowButton.innerText = "Add Row";
      addRowButton.classList.add("add-row-button");
      addRowButton.addEventListener("click", () => {
        const newRow = document.createElement("tr");
newRow.innerHTML = `
  <td><textarea class="spec-point"></textarea></td>
  <td><input type="checkbox" /></td>
`;

        table.querySelector("tbody").appendChild(newRow);
      });
  
      tableWrapper.appendChild(header);
      tableWrapper.appendChild(table);
      tableWrapper.appendChild(addRowButton);
      tableContainer.appendChild(tableWrapper);
    }
  
    function saveTables() {
      const tableData = Array.from(tableContainer.querySelectorAll(".table-wrapper")).map(tableWrapper => {
        const name = tableWrapper.querySelector(".table-name").value;
        const rows = Array.from(tableWrapper.querySelectorAll("tbody tr")).map(tr => {
          const specPoint = tr.querySelector(".spec-point").value;
          const checked = tr.querySelector("input[type='checkbox']").checked;
          return { specPoint, checked };
        });
        return { name, rows };
      });
  
      localStorage.setItem("tableData", JSON.stringify(tableData));
    }
  
    function loadTables() {
      const tableData = JSON.parse(localStorage.getItem("tableData"));
  
      if (tableData) {
        tableData.forEach(({ name, rows }) => createTable(name, rows));
      } else {
        console.log("No saved data found.");
      }
    }
  
    document.querySelector("#createTableBtn").addEventListener("click", () => {
      const tableName = document.querySelector("#tableName").value.trim();
      if (tableName === "") {
        alert("Please enter a table name.");
        return;
      }
      createTable(tableName);
    });
  
    document.querySelector("#saveTablesBtn").addEventListener("click", () => {
      saveTables();
    });
  
    document.querySelector("#loadTablesBtn").addEventListener("click", () => {
      loadTables();
    });
  
    loadTables(); // Load the
   // Load the tables when the page loads
  });
  