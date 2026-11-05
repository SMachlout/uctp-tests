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