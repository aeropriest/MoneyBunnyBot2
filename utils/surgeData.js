const { GoogleSpreadsheet } = require("google-spreadsheet");

const private_key = `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDYa1iQ2NTDmJYt\n/cT0iqZ+TtBeRbuHE5myr25sQECi3+2XhngNFl1ee5Wc5OFsKFSUlcGvKk7Go/QU\nEHDotgE2FpM/b1tA40S6ymr58/UMrw8I8w5cORqP1488jPby1yo5GTX4qrk57ASx\nM9fosRVP0dk7OU58fwoYvNbIPxWeOnd9DU0gBnu4bx/IxJF3+15ebVjXWh2C9qjO\n4C808Mq/Qwbfsx49ta02ervmva79lYD6v96LGtIiCFOgr6xgTJebGoQHxFJvESd7\nkBwZYs0cJC3PgYF/Jt5aBYT8FLEhX6UuLP0a8GEicgkDIncRqkkpfTUOQ2BD6OEn\nc7+ZAYaZAgMBAAECggEAMAXd8MJUsBR3WrxBjJwJpuR5QzoJC0ezpt1bzOSTEzFK\naQG7OPg5/sHAqMB3LwdiAVib0nE6asSt4Bfn3hOpACYRRZXBs4vaz/Iju9RBD6/2\nz58TlC5NsRZ9n8uN7sQFCAeKnOPRV0OCpQmigu1sk7o2kHg+bMzJ4kRhCq1I8EOT\njBOHYtWrWmEcbAsz7wGU+55A5iHuIorkgRwpOeneB9j6qcFSlHE+p8/Os4IlNfIT\nPQjhw61PgTx6L7UXZHVL72sY61iIdic5xZFpY0pRMYrEduJwUyd7ZcVuo4h9wRk+\n6UArKnRQhYxiXjgTmpJsd1kxV03ac+hii3vp5ZSH6QKBgQDwyGLsBTm/7yyMV6HE\n9Ht+sJKQeBqmvZJb81QxUsSImeRIMQjW019ztbvY1ooJRhZTLTckjHLZ4oB7NNsA\nJDTtneR/njkj99M+UqKzmBPspZZKmPtEAvI5TJj6iE1pMhLJCcW3W/5IOXvPYAgL\nPA7Ndjogvw9lafVEMyJI0L1KZQKBgQDmGMjXzJhKB/Avl3uuAwUAQEJn5c3Ivhp6\nkvShWVaxWlALsZ0vT7kp7npq6c+g9lPltJr1ZaB+aboLGUGcWv3/+FEPJsYu65Jf\nwkBUpQxusZRo2Q0Ucxlku7qR/Lkhp3pG6G9357UFqbR8bpw97jL2F9ZWtcsTXlnY\nwYqbd99OJQKBgQCsW7U8IG17cDkiaSR6uUuhn8H6uo7RZwha2+8bs5TN9+NKrhcW\nuI4uZRwHl2OOSeZ3OfmsJwGb6KByEZ7nFgPxSEIl/FwI3EER7tNa3fT9RHc2BRZw\nU++ShrtHM8S+FcMOt/kZTTfT+ZogEy0O5bnu57+qazoZLWUNodDb8NhfZQKBgBq1\nL8LUraySJU/w3ltBYHg5/TtAElXFsx8dJaYAz65AVGA3Go6eS1jRpIX6Y65ESVK1\nVvM6+5kQvpaBNPtoGGl4sjf3ATP7Bf91dbAdhEbo99f/saP5BC6MF8jQM9DzNp86\nZY3eaEWjAB8dW6dYmbO06p0f9tVlszoUpPkMve+9AoGANZkQDTDtujI9PWZpXei7\naYtLQVRAEdonPvh5RV/l390cPHkYdhwVmYN3G4wcqHM1pDBPedwUkdPe9l2+wu//\nPIKsHNcXaVXGsnQVjdAu25VhP3/yqaWHiY2iO2TJpEGYzpgy9VfIhPfsoNVhW/Do\nywvw6yL6WAh2FHuH8gTEV28=\n-----END PRIVATE KEY-----\n`;
async function quickstart() {
  try {
    //process.env.GOOGLE_PRIVATE_KEY;
    // console.log(private_key);
    // const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    const doc = new GoogleSpreadsheet(
      "1ReTleR8iSm34BMecFwlrAF-D49LkQgs9ZYYt0sOCVyQ"
    );
    await doc.useServiceAccountAuth({
      client_email:
        "gns-gpt-bot-spreadsheet-parser@gns-gpt-bot.iam.gserviceaccount.com", //process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: private_key.replace(/\\n/gm, "\n"),
    });

    await doc.getInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    console.log(rows[0]._sheet.headerValues);
    console.log(rows[0]._rawData);

    console.log(rows[1]._sheet.headerValues);
    console.log(rows[1]._rawData);

    console.log(rows[2]._sheet.headerValues);
    console.log(rows[2]._rawData);

    console.log(rows[3]._sheet.headerValues);
    console.log(rows[3]._rawData);

    // rows.map((row) => {
    //   console.log(row);
    // });
    const raw_data = rows[0]._rawData;
    const header_values = rows[0]._sheet.headerValues;
    const row_value = rows[0];

    // rows[0][id] = Number(row_value) + 1;
    // await rows[0].save();

    // console.log("raw_data", row_value);
  } catch (e) {
    console.log("----------- error -----------");
    console.log("error", e);
  }
}

const res = quickstart();
