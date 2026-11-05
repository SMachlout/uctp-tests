// file: tests/integration/taxpayers.spec.ts
import { test, expect, signIn } from '../../helpers/web';

const URL = '/api/v1/training/taxpayers';
const H = { 'X-Tenant-ID': 'TAGAYTAY', 'X-User-ID': 'Steve-8414' };
const OTHER = { ...H, 'X-User-ID': 'Steve-8414-other' };
const DUP_MSG = 'already registered for this tenant';
const NONE_MSG = 'None yet — create one in Training setup.';

let seq = 0;
const rand = () => Array.from({ length: 4 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
const nm = () => `Ana ${rand()} Dela Cruz`;
const mob = () => '09' + String(Date.now() + seq++ + test.info().parallelIndex * 100003).slice(-9);

async function toMyTaxpayers(page: any) {
  await page.getByRole('link', { name: 'My data' }).click();
  await page.getByRole('link', { name: 'My taxpayers' }).click();
}

test('I1 · AC-2 · create "Ana <4 letters> Dela Cruz" on screen, then read the API list', async ({ page, request }) => {
  await signIn(page);
  const n = nm(), m = mob();
  await page.getByRole('link', { name: 'Training setup' }).click();
  await page.getByLabel('Full name').fill(n);
  await page.getByLabel('Mobile (09XXXXXXXXX)').fill(m);
  await page.getByRole('button', { name: 'Create taxpayer' }).click();
  await expect(page.getByText(`${n} created — mobile ${m}.`)).toBeVisible();
  const res = await request.get(URL, { headers: H });
  expect(res.ok()).toBeTruthy();
  const text = JSON.stringify(await res.json());
  expect(text).toContain(n);
  expect(text).toContain(m);
});

test('I2 · AC-2 · create by API with an email, then read My data › My taxpayers', async ({ page, request }) => {
  const n = nm(), m = mob(), e = `ana.${rand()}@mail.ph`;
  const res = await request.post(URL, { headers: H, data: { full_name: n, mobile: m, email: e } });
  expect(res.status()).toBe(201);
  expect((await res.json()).taxpayer_id).toBeTruthy();
  await signIn(page);
  await toMyTaxpayers(page);
  await expect(page.getByText(n).first()).toBeVisible();
  await expect(page.getByText(m).first()).toBeVisible();
  await expect(page.getByText(e).first()).toBeVisible();
});

test('I3 · AC-4 · register a mobile by API, then submit it on screen', async ({ page, request }) => {
  const m = mob();
  const first = await request.post(URL, { headers: H, data: { full_name: nm(), mobile: m } });
  expect(first.status()).toBe(201);
  await signIn(page);
  await page.getByRole('link', { name: 'Training setup' }).click();
  await page.getByLabel('Full name').fill(nm());
  await page.getByLabel('Mobile (09XXXXXXXXX)').fill(m);
  await page.getByRole('button', { name: 'Create taxpayer' }).click();
  await expect(page.getByText(DUP_MSG).first()).toBeVisible();
  const again = await request.post(URL, { headers: H, data: { full_name: nm(), mobile: m } });
  expect(again.status()).toBe(409);
  expect(await again.json()).toEqual({ detail: { mobile: DUP_MSG } });
});

test('I4 · AC-7 · create by API as Steve-8414, then read screen and API as Steve-8414-other', async ({ page, request }) => {
  const m = mob();
  const res = await request.post(URL, { headers: H, data: { full_name: nm(), mobile: m } });
  expect(res.status()).toBe(201);
  await signIn(page, 'Steve-8414-other');
  await toMyTaxpayers(page);
  await expect(page.getByText(NONE_MSG)).toBeVisible();
  const list = await request.get(URL, { headers: OTHER });
  expect(list.ok()).toBeTruthy();
  expect(JSON.stringify(await list.json())).not.toContain(m);
});
