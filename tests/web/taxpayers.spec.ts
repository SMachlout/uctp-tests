// file: tests/web/taxpayers.spec.ts
import { test, expect, signIn } from '../../helpers/web';

const NAME_MSG = "2-100 characters: letters, spaces, . - ' and Ñ only";
const MOBILE_MSG = 'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX';
const EMAIL_MSG = 'invalid email format';
const DUP_MSG = 'already registered for this tenant';
const NONE_MSG = 'None yet — create one in Training setup.';
const OTHER_TAG = 'Steve-8414-other';

let seq = 0;
const rand = () => Array.from({ length: 4 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
const nm = () => `Ana ${rand()} Dela Cruz`;
const mob = () => '09' + String(Date.now() + seq++ + test.info().parallelIndex * 100003).slice(-9);
const digits = (n: number) => String(Date.now() + seq++).slice(-n);
const made = (name: string, mobile: string) => `${name} created — mobile ${mobile}.`;

async function toSetup(page: any) {
  await page.getByRole('link', { name: 'Training setup' }).click();
}
async function submit(page: any, name: string, mobile: string, email?: string) {
  await page.getByLabel('Full name').fill(name);
  await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
  if (email !== undefined) await page.getByLabel('Email (optional)').fill(email);
  await page.getByRole('button', { name: 'Create taxpayer' }).click();
}
async function toMyTaxpayers(page: any) {
  await page.getByRole('link', { name: 'My data' }).click();
  await page.getByRole('link', { name: 'My taxpayers' }).click();
}
async function refusedOnScreen(page: any, msg: string) {
  await expect(page.getByText(msg).first()).toBeVisible();
  await expect(page.getByText('created — mobile')).toHaveCount(0);
}

test('W1 · AC-1 · create "Ana <4 letters> Dela Cruz" using a 09 mobile and read the result box', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  const n = nm(), m = mob();
  await submit(page, n, m);
  await expect(page.getByText(made(n, m))).toBeVisible();
});

test('W2 · AC-1 · create using a +639 mobile and read the result box', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  const n = nm(), m = '+639' + digits(9);
  await submit(page, n, m);
  await expect(page.getByText(made(n, m))).toBeVisible();
});

test('W3 · AC-2 · create with an email, then find the name, mobile and email under My data › My taxpayers', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  const n = nm(), m = mob(), e = `ana.${rand()}@mail.ph`;
  await submit(page, n, m, e);
  await expect(page.getByText(made(n, m))).toBeVisible();
  await toMyTaxpayers(page);
  await expect(page.getByText(n).first()).toBeVisible();
  await expect(page.getByText(m).first()).toBeVisible();
  await expect(page.getByText(e).first()).toBeVisible();
});

test('W4 · AC-2 · reload My taxpayers and still see the name, mobile and email', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  const n = nm(), m = mob(), e = `ana.${rand()}@mail.ph`;
  await submit(page, n, m, e);
  await expect(page.getByText(made(n, m))).toBeVisible();
  await toMyTaxpayers(page);
  await page.reload();
  await expect(page.getByText(n).first()).toBeVisible();
  await expect(page.getByText(m).first()).toBeVisible();
  await expect(page.getByText(e).first()).toBeVisible();
});

test('W5 · AC-3 · type 3 spaces around the name and read the "created" message', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  const n = nm(), m = mob();
  await submit(page, `   ${n}   `, m);
  const box = page.getByText(made(n, m)).first();
  await expect(box).toBeVisible();
  const raw: string = await box.evaluate((e: any) => e.textContent ?? '');
  expect(raw).toContain(made(n, m));
  expect(raw).not.toMatch(/\S {2,}Ana/);
});

test('W6 · AC-3 · type 3 spaces around the name and read it under My data › My taxpayers', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  const n = nm(), m = mob();
  await submit(page, `   ${n}   `, m);
  await expect(page.getByText(made(n, m))).toBeVisible();
  await toMyTaxpayers(page);
  const cell = page.getByText(n).first();
  await expect(cell).toBeVisible();
  const raw: string = await cell.evaluate((e: any) => e.textContent ?? '');
  expect(raw).not.toMatch(/\S {2,}Ana/);
  expect(raw).not.toContain(`${n}  `);
});

test('W7 · AC-4 · create the same mobile twice and read the second message', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  const n = nm(), m = mob();
  await submit(page, n, m);
  await expect(page.getByText(made(n, m))).toBeVisible();
  await submit(page, `Maria ${rand()} Santos`, m);
  await expect(page.getByText(DUP_MSG).first()).toBeVisible();
});

test('W8 · AC-5 · type the full name "A" (1 letter)', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  await submit(page, 'A', mob());
  await refusedOnScreen(page, NAME_MSG);
});

test('W9 · AC-5 · type a full name with the digit 2', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  await submit(page, `Ana ${rand()}2 Cruz`, mob());
  await refusedOnScreen(page, NAME_MSG);
});

test('W10 · AC-5 · type a full name of 101 characters', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  const base = `Ana ${rand()} `;
  await submit(page, base + 'x'.repeat(101 - base.length), mob());
  await refusedOnScreen(page, NAME_MSG);
});

test('W11 · AC-6 · type the email "ana.mail.ph" (no @)', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  await submit(page, nm(), mob(), 'ana.mail.ph');
  await refusedOnScreen(page, EMAIL_MSG);
});

test('W12 · AC-6 · leave Email empty and create', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  const n = nm(), m = mob();
  await submit(page, n, m);
  await expect(page.getByText(made(n, m))).toBeVisible();
});

test('W13 · AC-7 · create as Steve-8414, then open My data › My taxpayers as Steve-8414-other', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  const n = nm(), m = mob();
  await submit(page, n, m);
  await expect(page.getByText(made(n, m))).toBeVisible();
  await signIn(page, OTHER_TAG);
  await toMyTaxpayers(page);
  await expect(page.getByText(NONE_MSG)).toBeVisible();
  await expect(page.getByText(m)).toHaveCount(0);
});

test('W14 · AC-8 · type the mobile "0917 1234567" (a space)', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  await submit(page, nm(), '0917 1234567');
  await refusedOnScreen(page, MOBILE_MSG);
});

test('W15 · AC-8 · type the mobile "09" + 8 digits', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  await submit(page, nm(), '09' + digits(8));
  await refusedOnScreen(page, MOBILE_MSG);
});

test('W16 · AC-8 · type the mobile "0917-123-4567" (dashes)', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  await submit(page, nm(), '0917-123-4567');
  await refusedOnScreen(page, MOBILE_MSG);
});

test('W17 · AC-1 · open Training setup from the top bar', async ({ page }) => {
  await signIn(page);
  await toSetup(page);
  await expect(page.getByText('1 — Create a taxpayer')).toBeVisible();
  await expect(page.getByLabel('Full name')).toBeVisible();
  await expect(page.getByLabel('Mobile (09XXXXXXXXX)')).toBeVisible();
  await expect(page.getByLabel('Email (optional)')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create taxpayer' })).toBeVisible();
});
