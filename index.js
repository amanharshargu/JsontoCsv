    // Generalized function to convert JSON to CSV

    // EXAMPLE OF A JSON File
    // [
    //     {
    //       "id": 1,
    //       "name": "Alice",
    //       "age": 30,
    //       "city": "New York"
    //     },
    //     {
    //       "id": 2,
    //       "name": "Bob",
    //       "age": 25,
    //       "city": "Los Angeles"
    //     },
    //     {
    //       "id": 3,
    //       "name": "Charlie",
    //       "age": 35,
    //       "city": "Chicago"
    //     }
    //   ]

    //   EXAMPLE OF AN EQUIVALENT CSV FILE
    //   id,name,age,city
    //     1,Alice,30,New York
    //     2,Bob,25,Los Angeles
    //     3,Charlie,35,Chicago

    function jsonToCSV(json) {
      const flattenObject = (obj, prefix = '') => {
        let result = {};

        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}_${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              // If the value is an object or array, recursively flatten it
              Object.assign(result, flattenObject(obj[key], newKey));
            } else {
              result[newKey] = obj[key];
            }
          }
        }

        return result;
      };

      // Flatten the JSON objects
      const flattenedData = json.map(item => flattenObject(item));

      // Get the headers (keys from the first object)
      const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));

      // Convert to CSV format
      const csvRows = [
        headers.join(','), // headers row
        ...flattenedData.map(row => headers.map(header => row[header] || '').join(',')) // data rows
      ];

      return csvRows.join('\n');
    }

    // Function to download the CSV as a file with current date as the filename
    function downloadCSV() {
      // Sample JSON data (can be replaced with any JSON)
      const jsonData = [
        {
          "seriesData": [
            {
              "value": 100.0,
              "date": "2023-01-01",
              "environment": {
                "name": "Production",
                "status": "Active"
              }
            }
          ],
          "categories": ["January-2023"],
          "environments": ["Production"]
        },
        {
          "chartData": {
            "seriesData": [
              {
                "value": 50.0,
                "date": "2023-01-01",
                "environment": {
                  "name": "Development"
                }
              }
            ],
            "categories": ["01-01-2023"],
            "environments": ["Development"]
          },
          "resources": [
            {
              "resourceURI": "/subscriptions/123/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/vm1",
              "resourceType": "virtualMachines",
              "resourceName": "vm1",
              "environmentName": "Development",
              "preTaxCost": 50.0,
              "date": "2023-01-01"
            }
          ],
          "totalCost": 150.0
        }
      ];

      // Convert the JSON data to CSV
      const csv = jsonToCSV(jsonData);

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0];

      // Create a Blob from the CSV data
      const blob = new Blob([csv], { type: 'text/csv' });

      // Create a link to trigger the download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data_${currentDate}.csv`; // Filename includes the current date
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
    }