# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: integration\taxpayers.spec.ts >> I2 · AC-2 · create by API with an email, then read My data › My taxpayers
- Location: tests\integration\taxpayers.spec.ts:35:5

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('link', { name: 'My data' }) resolved to 3 elements:
    1) <a class="" href="/my-data" data-nav="my-data">My data</a> aka getByRole('link', { name: 'My data', exact: true })
    2) <a class="btn" href="/training">…</a> aka getByRole('link', { name: 'Create my data' })
    3) <a class="btn" href="/my-data">…</a> aka getByRole('link', { name: 'See my data' })

Call log:
  - waiting for getByRole('link', { name: 'My data' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - note [ref=e2]: TRAINING — made-up data only
  - navigation "Main" [ref=e3]:
    - link "UCTP" [ref=e4] [cursor=pointer]:
      - /url: /
    - generic [ref=e5]:
      - link "Home" [ref=e6] [cursor=pointer]:
        - /url: /
      - link "Training setup" [ref=e7] [cursor=pointer]:
        - /url: /training
      - link "Teller POS" [ref=e8] [cursor=pointer]:
        - /url: /pos
      - link "Citizen portal" [ref=e9] [cursor=pointer]:
        - /url: /portal
      - link "Simulator" [ref=e10] [cursor=pointer]:
        - /url: /simulator
      - link "My data" [ref=e11] [cursor=pointer]:
        - /url: /my-data
      - link "API docs" [ref=e12] [cursor=pointer]:
        - /url: /docs
    - generic [ref=e14]:
      - text: "You are:"
      - strong [ref=e15]: Steve-8414
      - link "Change" [ref=e16] [cursor=pointer]:
        - /url: "#"
  - main [ref=e17]:
    - heading "Unified City Treasury Platform — Tagaytay pilot" [level=1] [ref=e18]
    - paragraph [ref=e19]: Every flow starts here. Pick a role; each screen hands off to the next step.
    - generic [ref=e20]:
      - generic [ref=e21]:
        - heading "Training setup" [level=2] [ref=e22]
        - paragraph [ref=e23]: Create the taxpayers, bills, and teller booklets you will use in class.
        - link [ref=e24] [cursor=pointer]:
          - /url: /training
          - button "Create my data" [ref=e25]
      - generic [ref=e26]:
        - 'heading "Teller: POS" [level=2] [ref=e27]'
        - paragraph [ref=e28]: Counter cashiering — load an Order of Payment, tender cash or cheque, print the OR.
        - link [ref=e29] [cursor=pointer]:
          - /url: /pos
          - button "Open POS" [ref=e30]
      - generic [ref=e31]:
        - 'heading "Citizen: portal" [level=2] [ref=e32]'
        - paragraph [ref=e33]: Taxpayer self-service — look up what you owe and pay online.
        - link [ref=e34] [cursor=pointer]:
          - /url: /portal
          - button "Open portal" [ref=e35]
      - generic [ref=e36]:
        - 'heading "Bank: settlement simulator" [level=2] [ref=e37]'
        - paragraph [ref=e38]: Training tool that drives the real settlement endpoints with a simulated bank reference.
        - link [ref=e39] [cursor=pointer]:
          - /url: /simulator
          - button "Open simulator" [ref=e40]
      - generic [ref=e41]:
        - heading "My data" [level=2] [ref=e42]
        - paragraph [ref=e43]: Everything you created — taxpayers, bills, tellers, receipts — and the next action for each.
        - link [ref=e44] [cursor=pointer]:
          - /url: /my-data
          - button "See my data" [ref=e45]
      - generic [ref=e46]:
        - heading "API docs" [level=2] [ref=e47]
        - paragraph [ref=e48]: OpenAPI / Swagger reference for every endpoint in the platform.
        - link [ref=e49] [cursor=pointer]:
          - /url: /docs
          - button "Open API docs" [ref=e50]
```

# Test source

```ts
  1  | // file: tests/integration/taxpayers.spec.ts
  2  | import { test, expect, signIn } from '../../helpers/web';
  3  | 
  4  | const URL = '/api/v1/training/taxpayers';
  5  | const H = { 'X-Tenant-ID': 'TAGAYTAY', 'X-User-ID': 'Steve-8414' };
  6  | const OTHER = { ...H, 'X-User-ID': 'Steve-8414-other' };
  7  | const DUP_MSG = 'already registered for this tenant';
  8  | const NONE_MSG = 'None yet — create one in Training setup.';
  9  | 
  10 | let seq = 0;
  11 | const rand = () => Array.from({ length: 4 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  12 | const nm = () => `Ana ${rand()} Dela Cruz`;
  13 | const mob = () => '09' + String(Date.now() + seq++ + test.info().parallelIndex * 100003).slice(-9);
  14 | 
  15 | async function toMyTaxpayers(page: any) {
> 16 |   await page.getByRole('link', { name: 'My data' }).click();
     |                                                     ^ Error: locator.click: Error: strict mode violation: getByRole('link', { name: 'My data' }) resolved to 3 elements:
  17 |   await page.getByRole('link', { name: 'My taxpayers' }).click();
  18 | }
  19 | 
  20 | test('I1 · AC-2 · create "Ana <4 letters> Dela Cruz" on screen, then read the API list', async ({ page, request }) => {
  21 |   await signIn(page);
  22 |   const n = nm(), m = mob();
  23 |   await page.getByRole('link', { name: 'Training setup' }).click();
  24 |   await page.getByLabel('Full name').fill(n);
  25 |   await page.getByLabel('Mobile (09XXXXXXXXX)').fill(m);
  26 |   await page.getByRole('button', { name: 'Create taxpayer' }).click();
  27 |   await expect(page.getByText(`${n} created — mobile ${m}.`)).toBeVisible();
  28 |   const res = await request.get(URL, { headers: H });
  29 |   expect(res.ok()).toBeTruthy();
  30 |   const text = JSON.stringify(await res.json());
  31 |   expect(text).toContain(n);
  32 |   expect(text).toContain(m);
  33 | });
  34 | 
  35 | test('I2 · AC-2 · create by API with an email, then read My data › My taxpayers', async ({ page, request }) => {
  36 |   const n = nm(), m = mob(), e = `ana.${rand()}@mail.ph`;
  37 |   const res = await request.post(URL, { headers: H, data: { full_name: n, mobile: m, email: e } });
  38 |   expect(res.status()).toBe(201);
  39 |   expect((await res.json()).taxpayer_id).toBeTruthy();
  40 |   await signIn(page);
  41 |   await toMyTaxpayers(page);
  42 |   await expect(page.getByText(n).first()).toBeVisible();
  43 |   await expect(page.getByText(m).first()).toBeVisible();
  44 |   await expect(page.getByText(e).first()).toBeVisible();
  45 | });
  46 | 
  47 | test('I3 · AC-4 · register a mobile by API, then submit it on screen', async ({ page, request }) => {
  48 |   const m = mob();
  49 |   const first = await request.post(URL, { headers: H, data: { full_name: nm(), mobile: m } });
  50 |   expect(first.status()).toBe(201);
  51 |   await signIn(page);
  52 |   await page.getByRole('link', { name: 'Training setup' }).click();
  53 |   await page.getByLabel('Full name').fill(nm());
  54 |   await page.getByLabel('Mobile (09XXXXXXXXX)').fill(m);
  55 |   await page.getByRole('button', { name: 'Create taxpayer' }).click();
  56 |   await expect(page.getByText(DUP_MSG).first()).toBeVisible();
  57 |   const again = await request.post(URL, { headers: H, data: { full_name: nm(), mobile: m } });
  58 |   expect(again.status()).toBe(409);
  59 |   expect(await again.json()).toEqual({ detail: { mobile: DUP_MSG } });
  60 | });
  61 | 
  62 | test('I4 · AC-7 · create by API as Steve-8414, then read screen and API as Steve-8414-other', async ({ page, request }) => {
  63 |   const m = mob();
  64 |   const res = await request.post(URL, { headers: H, data: { full_name: nm(), mobile: m } });
  65 |   expect(res.status()).toBe(201);
  66 |   await signIn(page, 'Steve-8414-other');
  67 |   await toMyTaxpayers(page);
  68 |   await expect(page.getByText(NONE_MSG)).toBeVisible();
  69 |   const list = await request.get(URL, { headers: OTHER });
  70 |   expect(list.ok()).toBeTruthy();
  71 |   expect(JSON.stringify(await list.json())).not.toContain(m);
  72 | });
  73 | 
```