/**
 * AeroLux — Google Sheets Live Webhook Integration
 * 
 * Instructions to set up:
 * 1. Open Google Sheets -> Extensions -> Apps Script.
 * 2. Replace any default code with this script.
 * 3. Click 'Deploy' -> 'New deployment'.
 * 4. Select type: 'Web app'.
 * 5. Set 'Execute as': 'Me', and 'Who has access': 'Anyone'.
 * 6. Copy the Web App URL and set it as VITE_GOOGLE_SHEETS_WEBHOOK_URL in client/.env.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Set headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Booking Ref",
        "Lead Passenger",
        "Contact Phone",
        "Departure City",
        "Arrival City",
        "Flight Date",
        "Passengers",
        "Aircraft",
        "Flight Hours",
        "Total Price ($USD)",
        "Status"
      ]);
      sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#d4af37").setFontColor("#000000");
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.bookingRef,
      data.passengerName,
      data.passengerPhone,
      data.fromCity,
      data.toCity,
      data.flightDate,
      data.passengers,
      data.aircraft,
      data.flightHours,
      data.totalPrice,
      data.status
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
