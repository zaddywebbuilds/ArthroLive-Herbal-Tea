# Connecting the ArthroLive order form

Orders go into a Google Sheet you own, and optionally land in your inbox too.
Free, no server, nothing to maintain. About ten minutes.

You need a Google account. Everything below happens in your own account; nobody
else gets access unless you share the sheet.

---

## 1. Create the spreadsheet

1. Go to <https://sheets.new> to create a blank spreadsheet.
2. Name it something like **ArthroLive Orders**.

Leave it open.

## 2. Add the script

1. In that spreadsheet: **Extensions → Apps Script**. A new tab opens.
2. Delete whatever is in the editor (usually an empty `myFunction`).
3. Open [`orders.gs`](./orders.gs) from this repository, copy the whole file and
   paste it in.
4. At the top of the pasted code, set your notification email:

   ```js
   var NOTIFY_EMAIL = 'you@example.com';   // leave '' for no email
   ```

5. Optionally set a shared secret, any random string:

   ```js
   var SHARED_SECRET = 'pick-something-random-here';
   ```

6. Click the **save** icon.

## 3. Check it works before deploying

1. In the function dropdown at the top, choose **testOrder**, then click **Run**.
2. Google asks for permission the first time. Choose your account, click
   **Advanced → Go to (project name) (unsafe)**, then **Allow**. This warning is
   normal for your own unpublished script.
3. Switch back to the spreadsheet tab. There should now be an **Orders** tab with
   a header row and one test row.
4. **Delete the test row.**

If you set `NOTIFY_EMAIL`, you should also have received a test email.

## 4. Deploy it as a web app

1. In the Apps Script editor: **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** `ArthroLive orders`
   - **Execute as:** `Me (your@email)`
   - **Who has access:** `Anyone`

   "Anyone" is required, because shoppers are not signed in to Google. They can
   only send orders to it. Nobody can read your sheet through it.
4. Click **Deploy**, approve the permissions, then **copy the Web app URL**. It
   looks like:

   ```
   https://script.google.com/macros/s/AKfycb................/exec
   ```

5. Paste that URL into a browser tab. You should see
   `{"ok":true,"service":"ArthroLive order receiver","status":200}`. If you do,
   it is live.

## 5. Point the website at it

In [`src/config/site.ts`](../src/config/site.ts):

```ts
order: {
  endpoint: 'https://script.google.com/macros/s/AKfycb.../exec',   // your URL
  contentType: 'text/plain;charset=utf-8',                          // leave as is
  secret: 'pick-something-random-here',                             // must match SHARED_SECRET
  minFillSeconds: 3,
},
```

Then commit and push. GitHub Actions rebuilds and deploys the site.

## 6. Place one real test order

Open the live site, fill the form properly and submit. Check that:

- the green **Order received** panel appears,
- a new row lands in the Orders sheet,
- the notification email arrives if you configured one.

Delete that test row when you are done.

---

## Important: redeploy correctly after editing the script

If you ever change `orders.gs`, use **Deploy → Manage deployments → edit (pencil)
→ Version: New version → Deploy**.

Do **not** create a brand new deployment, because that gives you a different URL
and the website would keep posting to the old one.

## Why `text/plain`?

Apps Script web apps do not answer CORS preflight (`OPTIONS`) requests. Sending
the JSON body with a `text/plain` content type keeps it a "simple" request, so
the browser posts it directly. The body is still JSON and the script parses it.

If you ever move to a different backend that handles CORS itself (Formspree,
your own API, a Make or Zapier webhook), change `contentType` to
`application/json` and leave everything else alone.

## What the site sends

```json
{
  "secret": "...",
  "package": { "id": "double", "name": "Double Pack", "teaQty": 2, "balmQty": 2, "price": 470 },
  "delivery": { "fee": 0, "method": "Pay on delivery" },
  "total": 470,
  "currency": "GHS",
  "customer": {
    "fullName": "Akosua Darko",
    "phone": "+233245551234",
    "altPhone": "",
    "region": "Western",
    "city": "Takoradi",
    "address": "No. 9 Beach Road",
    "landmark": "Behind Market Circle"
  },
  "meta": { "submittedAt": "2026-11-20T08:48:50.638Z", "page": "https://..." }
}
```

Phone numbers are normalised to `+233XXXXXXXXX` before they are sent. No health
information is ever collected or transmitted.

## If orders stop arriving

1. Open the `/exec` URL in a browser. No `{"ok":true...}` means the deployment is
   gone or was replaced: redeploy as above and update `endpoint`.
2. In the Apps Script editor, open **Executions** in the left sidebar. Failed runs
   and their error messages appear there.
3. Check that `secret` in `site.ts` still matches `SHARED_SECRET` in the script.
   A mismatch makes the site show an error rather than a confirmation, which is
   the intended behaviour.
4. Google applies daily quotas to Apps Script (email sending in particular). For
   normal order volumes you will not come close.

## Limits worth knowing

- Apps Script is free, with generous daily quotas for this kind of use.
- The sheet is the system of record. Back it up, or use **File → Version history**.
- Anyone you share the spreadsheet with can read every customer's details, so
  share it only with people who need it.
