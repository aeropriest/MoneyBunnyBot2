// import {
//   getZones,
//   getUser,
//   updateUser,
//   addUser,
//   getQuestions,
//   getAnswers,
// } from "./firebase/index.js";

const projectId = "gns-gpt-bot";
const location = "us"; // Format is 'us' or 'eu'
// const processorId = "e7a923443fcb4ffb"; // form parser id
const processorId = "1af71b78f04c04c3"; // form processor trained for surge fee

const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;

const client = new DocumentProcessorServiceClient();

const { googleapi } = require("googleapis");

// googleapi.client
//   .init({
//     apiKey: "<YOUR_API_KEY>",
//     discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
//     clientId: "<YOUR_CLIENT_ID>",
//     scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
//   })
//   .then(
//     function () {
//       // API client loaded and ready to use
//     },
//     function (error) {
//       console.log("Error loading API client:", error);
//     }
//   );

// const auth = new googleapi.auth.GoogleAuth({
//   keyFile: "<PATH_TO_KEY_FILE>",
//   scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
// });

// googleapi.client
//   .init({
//     apiKey: "<YOUR_API_KEY>",
//     discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
//     clientId: "<YOUR_CLIENT_ID>",
//     scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
//   })
//   .then(
//     function () {
//       // API client loaded and ready to use
//     },
//     function (error) {
//       console.log("Error loading API client:", error);
//     }
//   );

//   googleapi.client.sheets.spreadsheets.values
//   .get({
//     spreadsheetId: "<YOUR_SPREADSHEET_ID>",
//     range: "Sheet1!A1:B10",
//   })
//   .then(
//     function (response) {
//       var data = response.result.values;
//       console.log("Data:", data);
//     },
//     function (error) {
//       console.log("Error:", error);
//     }
//   );

// const sheets = google.sheets({ version: "v4", auth });

function parse_data(text) {
  const paragraphs = text.split("Paragraph text:\n");
  const filteredParagraphs = paragraphs
    .filter((p) => p.trim().length > 0)
    .map((p) => p.trim());

  const week_name = filteredParagraphs[0];
  const zone_names = [
    filteredParagraphs[1],
    filteredParagraphs[3],
    filteredParagraphs[4],
  ];
  const zone_data_text = filteredParagraphs[2].split("\n");

  const data = {
    week: week_name,
    zones: {},
  };

  for (let i = 0; i < zone_names.length; i++) {
    const zone_name = zone_names[i];
    data["zones"][zone_name] = {
      "Mon - Thurs": [],
      Fri: [],
      Sat: [],
      Sun: [],
    };
    const mon_thurs_index = i * 12 + 1;
    const fri_index = i * 12 + 6;
    const sat_index = i * 12 + 11;
    const sun_index = i * 12 + 16;

    // Mon - Thurs
    data["zones"][zone_name]["Mon - Thurs"] = [
      zone_data_text[mon_thurs_index + 1],
      zone_data_text[mon_thurs_index + 2],
      zone_data_text[mon_thurs_index + 3],
      ...zone_data_text[mon_thurs_index + 4].split(" "),
    ];

    // Fri
    data["zones"][zone_name]["Fri"] = [
      ...zone_data_text[fri_index + 1].split(" "),
    ];

    // Sat
    data["zones"][zone_name]["Sat"] = [
      ...zone_data_text[sat_index + 1].split(" "),
      zone_data_text[sat_index + 2],
      zone_data_text[sat_index + 3],
      ...zone_data_text[sat_index + 4].split(" "),
    ];

    // Sun
    data["zones"][zone_name]["Sun"] = [
      ...zone_data_text[sun_index + 1].split(" "),
      zone_data_text[sun_index + 2],
      zone_data_text[sun_index + 3],
      ...zone_data_text[sun_index + 4].split(" "),
    ];
  }

  return data;
}

function tableToCsv(table) {
  const rows = table.tableRows;
  const headerCells = rows[0].tableCells;
  const headers = headerCells.map((headerCell) =>
    getText(headerCell.layout.textAnchor)
  );
  const csvRows = [];
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].tableCells;
    const csvRow = [];
    for (let j = 0; j < cells.length; j++) {
      csvRow.push(getText(cells[j].layout.textAnchor));
    }
    csvRows.push(csvRow.join(","));
  }
  return [headers.join(","), ...csvRows].join("\n");
}

async function quickstart() {
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  const filePath = "../assets/surge/CW10-Surge-5.png";
  const fs = require("fs").promises;
  const imageFile = await fs.readFile(filePath);

  const encodedImage = Buffer.from(imageFile).toString("base64");

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: "image/png",
    },
  };

  const [result] = await client.processDocument(request);
  const { document } = result;

  const { text } = document;

  // Extract shards from the text field
  const getText = (textAnchor) => {
    if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
      return "";
    }

    // First shard in document doesn't have startIndex property
    const startIndex = textAnchor.textSegments[0].startIndex || 0;
    const endIndex = textAnchor.textSegments[0].endIndex;

    return text.substring(startIndex, endIndex);
  };

  // Read the text recognition output from the processor
  // console.log("The document contains the following paragraphs:");
  const [page1] = document.pages;
  const { paragraphs } = page1;
  // console.log(document.text);

  //para 1 - zone 1
  //para 2, line 3 onwards
  //para 3, zone 2
  //para 4, zone 3

  const weekDate = getText(paragraphs[2].layout.textAnchor).trim().split("\n");

  // split the text into an array of words
  const words = weekDate[0].split(" ");

  // extract the start and end dates from the first 3 words
  const startDate = new Date(`${words[0]} ${words[1]} ${words[2]} 00:00:00`);
  const endDate = new Date(`${words[4]} ${words[5]} ${words[6]} 23:59:59`);

  // extract the time zones from the remaining words
  const timeZones = [];
  for (let i = 7; i < words.length; i += 2) {
    const start = words[i];
    const end = words[i + 1];
    timeZones.push({ start, end });
  }

  console.log(startDate);
  console.log(endDate);
  console.log(timeZones);

  console.log(weekDate[0]);
  const zones = [
    getText(paragraphs[1].layout.textAnchor).trim(),
    getText(paragraphs[3].layout.textAnchor).trim(),
  ];

  console.log(zones);
  for (const paragraph of paragraphs) {
    const paragraphText = getText(paragraph.layout.textAnchor);
    // console.log(`Paragraph text:\n${paragraphText}`);
  }

  // console.log(JSON.stringify(data, null, 2));

  // console.log(document.text);
  // const { tables } = page1;
  // // Assuming tables is an array of objects with headerRows property which is an array of objects with cells property
  // for (var i = 0; i < tables[0].headerRows[0].cells.length; i++) {
  //   var cell = tables[0].headerRows[0].cells[i];
  //   const { startIndex, endIndex } = cell.layout.textAnchor.textSegments[0];
  //   console.log(document.text.slice(startIndex, endIndex));
  // }

  //   const headerRow = tables[0].headerRows[0].cells.map(
  //     (cell) => cell.textAnchor.textSegments[0].text
  //   );

  //   console.log(typeof tables.headerRow[0]);

  //   for (const table of tables) {
  //     const tableCsv = tableToCsv(table);
  //     console.log(`Table data:\n${tableCsv}`);

  //     // Write the table data to a CSV file
  //     const fs = require("fs").promises;
  //     await fs.writeFile("table.csv", tableCsv);
  //   }
}

const res = quickstart();

// const zones = getZones("Singapore", "Singapore");

/*
  const zones = ["Bukit Panjang", "Jurong West", "Jurong East"];

  const weekdays = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

  const data = [];
  let currentZone = 0;

  for (const paragraph of paragraphs) {
    const paragraphText = getText(paragraph.layout.textAnchor);

    if (paragraphText === "CW10") {
      data.push({ week: "CW10", zones: [] });
      currentZone = 0;
    } else if (zones.includes(paragraphText)) {
      data[data.length - 1].zones.push({ name: paragraphText, data: [] });
      currentZone++;
    } else if (paragraphText.includes("$")) {
      const lines = paragraphText.split("\n");
      const dates = lines[0].trim();
      const times = lines.slice(1, lines.length - 1).map((line) => line.trim());
      const values = lines[lines.length - 1].trim().split(" ");

      const zoneData = {
        dates,
        times,
        values: {},
      };

      for (let i = 0; i < values.length; i++) {
        const timeRange = times[i];
        const value = values[i];
        zoneData.values[timeRange] = value;
      }

      const zoneIndex = (currentZone - 1) % 3;
      data[data.length - 1].zones[zoneIndex].data.push(zoneData);
    }
  }
*/
