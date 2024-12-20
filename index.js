function jsonToCSV(json) {
  const flattenObject = (obj, prefix = "") => {
    let result = {};

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}_${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          Object.assign(result, flattenObject(obj[key], newKey));
        } else {
          result[newKey] = obj[key];
        }
      }
    }

    return result;
  };

  const flattenedData = json.map((item) => flattenObject(item));

  const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));

  const csvRows = [
    headers.join(","), // headers row
    ...flattenedData.map((row) =>
      headers.map((header) => row[header] || "").join(",")
    ), // data rows
  ];
  console.log(csvRows.join("\n"));

  return csvRows.join("\n");
}

function downloadCSV() {
  const jsonData = [
    {
      id: 1,
      name: "Alice",
      age: 30,
      city: "New York",
      contact: {
        email: "alice@example.com",
        phone: "123-456-7890",
      },
    },
    {
      id: 2,
      name: "Bob",
      age: 25,
      city: "Los Angeles",
      contact: {
        email: "bob@example.com",
        phone: "987-654-3210",
      },
    },
    {
      id: 3,
      name: "Charlie",
      age: 35,
      city: "Chicago",
      contact: {
        email: "charlie@example.com",
        phone: "555-666-7777",
      },
    },
  ];

  const csv = jsonToCSV(jsonData);

  const currentDate = new Date().toISOString().split("T")[0];

  const blob = new Blob([csv], { type: "text/csv" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `data_${currentDate}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}
