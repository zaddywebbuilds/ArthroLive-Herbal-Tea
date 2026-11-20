/**
 * ArthroLive Ghana - order receiver
 * =================================
 * A Google Apps Script web app that receives orders from the website,
 * appends each one to a Google Sheet and (optionally) emails you.
 *
 * Free, no server, works with a static site on GitHub Pages.
 *
 * SETUP: see backend/SETUP.md in this repository.
 *
 * Why the website posts as text/plain:
 * Apps Script web apps do not answer CORS preflight (OPTIONS) requests.
 * Posting JSON with a text/plain content type keeps it a "simple request",
 * so the browser sends it directly. The body is still JSON and is parsed
 * below. Do not change the site to application/json or orders will fail.
 */

// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------

/** Email address(es) to notify on each order. Comma separated. '' = no email. */
var NOTIFY_EMAIL = '';

/** Name of the tab inside the spreadsheet. Created automatically. */
var SHEET_NAME = 'Orders';

/**
 * Shared secret. Set the SAME value here and in `order.secret` in
 * src/config/site.ts. Leave both empty to skip the check.
 * This is a light filter against random bots, not real authentication:
 * anyone reading the page source can see it.
 */
var SHARED_SECRET = '';

// ---------------------------------------------------------------------------

var HEADERS = [
  'Received at',
  'Status',
  'Package',
  'Teas',
  'Balms',
  'Total (GHS)',
  'Payment',
  'Full name',
  'Phone',
  'Alt phone',
  'Region',
  'City or town',
  'Delivery address',
  'Nearest landmark',
  'Source page'
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return respond(400, { ok: false, error: 'Empty request' });
    }

    var order = JSON.parse(e.postData.contents);

    if (SHARED_SECRET && order.secret !== SHARED_SECRET) {
      return respond(401, { ok: false, error: 'Rejected' });
    }

    var customer = order.customer || {};
    var pkg = order.package || {};

    // Minimum viable order. Anything less is a bot or a broken request.
    if (!customer.fullName || !customer.phone || !customer.region || !customer.address) {
      return respond(400, { ok: false, error: 'Missing required fields' });
    }

    var sheet = getSheet();
    var row = [
      new Date(),
      'New',
      pkg.name || '',
      pkg.teaQty || '',
      pkg.balmQty || '',
      order.total || '',
      (order.delivery && order.delivery.method) || '',
      customer.fullName,
      // Leading apostrophe keeps Sheets from mangling +233... into a formula
      "'" + customer.phone,
      customer.altPhone ? "'" + customer.altPhone : '',
      customer.region,
      customer.city || '',
      customer.address,
      customer.landmark || '',
      (order.meta && order.meta.page) || ''
    ];
    sheet.appendRow(row);

    notify(order, pkg, customer);

    return respond(200, { ok: true, row: sheet.getLastRow() });
  } catch (err) {
    // Log so failures are visible in Apps Script > Executions
    console.error('Order failed: ' + err);
    return respond(500, { ok: false, error: 'Could not record the order' });
  }
}

/** Lets you open the /exec URL in a browser to check the app is deployed. */
function doGet() {
  return respond(200, { ok: true, service: 'ArthroLive order receiver' });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#00565C')
      .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(13, 260); // Delivery address
    sheet.setColumnWidth(14, 220); // Landmark
  }
  return sheet;
}

function notify(order, pkg, customer) {
  if (!NOTIFY_EMAIL) return;
  try {
    var lines = [
      'New ArthroLive order',
      '',
      'Package:  ' + (pkg.name || '') + '  (' + (pkg.teaQty || 0) + ' tea, ' + (pkg.balmQty || 0) + ' balm)',
      'Total:    GHS ' + (order.total || ''),
      'Payment:  ' + ((order.delivery && order.delivery.method) || ''),
      '',
      'Name:     ' + customer.fullName,
      'Phone:    ' + customer.phone,
      'Alt:      ' + (customer.altPhone || '-'),
      '',
      'Region:   ' + customer.region,
      'Town:     ' + (customer.city || ''),
      'Address:  ' + customer.address,
      'Landmark: ' + (customer.landmark || ''),
      '',
      'Call the customer to confirm before dispatch.'
    ];
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'ArthroLive order: ' + customer.fullName + ' (' + (pkg.name || '') + ')',
      body: lines.join('\n')
    });
  } catch (err) {
    // Never fail the order just because the email did not go out.
    console.error('Notification email failed: ' + err);
  }
}

function respond(status, payload) {
  payload.status = status;
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this once from the Apps Script editor to confirm the sheet and the
 * email notification both work. It writes a clearly marked test row.
 */
function testOrder() {
  var result = doPost({
    postData: {
      contents: JSON.stringify({
        secret: SHARED_SECRET,
        package: { id: 'double', name: 'TEST - Double Pack', teaQty: 2, balmQty: 2, price: 470 },
        delivery: { fee: 0, method: 'Pay on delivery' },
        total: 470,
        currency: 'GHS',
        customer: {
          fullName: 'TEST ORDER - delete this row',
          phone: '+233200000000',
          altPhone: '',
          region: 'Greater Accra',
          city: 'Accra',
          address: 'Test address, do not dispatch',
          landmark: 'Test landmark'
        },
        meta: { submittedAt: new Date().toISOString(), page: 'manual test' }
      })
    }
  });
  console.log(result.getContent());
}
