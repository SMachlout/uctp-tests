// file: tests/api/taxpayers.spec.ts
import { test, expect } from '@playwright/test';

const URL = '/api/v1/training/taxpayers';
const H = { 'X-Tenant-ID': 'TAGAYTAY', 'X-User-ID': 'Steve-8414' };
const OTHER = { ...H, 'X-User-ID': 'Steve-8414-other' };
const NAME_MSG = "2-100 characters: letters, spaces, . - ' and Ñ only";
const MOBILE_MSG = 'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX';
const EMAIL_MSG = 'invalid email format';
const DUP_MSG = 'already registered for this tenant';

let seq = 0;
const rand = () => Array.from({ length: 4 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
const nm = () => `Ana ${rand()} Dela Cruz`;
const digits = (n: number) => String(Date.now() + seq++).slice(-n);
const mob = () => '09' + String(Date.now() + seq++ + test.info().parallelIndex * 100003).slice(-9);
const longName = (n: number) => { const b = `Ana ${rand()} `; return b + 'x'.repeat(n - b.length); };

const post = (request: any, data: any, headers = H) => request.post(URL, { headers, data });
const created = async (res: any) => {
  expect(res.status()).toBe(201);
  expect((await res.json()).taxpayer_id).toBeTruthy();
};
const refused = async (res: any, field: string, msg: string) => {
  expect(res.status()).toBe(422);
  expect(await res.json()).toEqual({ detail: { [field]: msg } });
};

test('A1 · AC-1 · create a taxpayer using "Ana <4 letters> Dela Cruz" and a 09 mobile, no email', async ({ request }) => {
  await created(await post(request, { full_name: nm(), mobile: mob() }));
});

test('A2 · AC-1 · create a taxpayer using a +639 mobile and an email', async ({ request }) => {
  const mobile = '+639' + digits(9);
  await created(await post(request, { full_name: nm(), mobile, email: 'ana.dela@mail.ph' }));
});

test('A3 · AC-3 · create using 3 spaces before and after the full name', async ({ request }) => {
  await created(await post(request, { full_name: `   ${nm()}   `, mobile: mob() }));
});

test('A4 · AC-4 · refuse the same mobile sent twice', async ({ request }) => {
  const mobile = mob();
  await created(await post(request, { full_name: nm(), mobile }));
  const res = await post(request, { full_name: nm(), mobile });
  expect(res.status()).toBe(409);
  expect(await res.json()).toEqual({ detail: { mobile: DUP_MSG } });
});

test('A5 · AC-4 · refuse a registered mobile sent with another name and another email', async ({ request }) => {
  const mobile = mob();
  await created(await post(request, { full_name: nm(), mobile }));
  const res = await post(request, { full_name: `Maria ${rand()} Santos`, mobile, email: 'maria.santos@mail.ph' });
  expect(res.status()).toBe(409);
  expect(await res.json()).toEqual({ detail: { mobile: DUP_MSG } });
});

test('A6 · AC-5 · create using the full name "Al" (2 characters)', async ({ request }) => {
  await created(await post(request, { full_name: 'Al', mobile: mob() }));
});

test('A7 · AC-5 · refuse the full name "A" (1 letter)', async ({ request }) => {
  await refused(await post(request, { full_name: 'A', mobile: mob() }), 'full_name', NAME_MSG);
});

test('A8 · AC-5 · create using a full name of 100 characters', async ({ request }) => {
  await created(await post(request, { full_name: longName(100), mobile: mob() }));
});

test('A9 · AC-5 · refuse a full name of 101 characters', async ({ request }) => {
  await refused(await post(request, { full_name: longName(101), mobile: mob() }), 'full_name', NAME_MSG);
});

test("A10 · AC-5 · create using a name with hyphen, apostrophe, period and Ñ", async ({ request }) => {
  await created(await post(request, { full_name: `Ana-Marie ${rand()} O'Neil Ñ Jr.`, mobile: mob() }));
});

test('A11 · AC-5 · refuse a full name with the digit 2', async ({ request }) => {
  await refused(await post(request, { full_name: `Ana ${rand()}2 Cruz`, mobile: mob() }), 'full_name', NAME_MSG);
});

test('A12 · AC-5 · refuse a full name with the symbol @', async ({ request }) => {
  await refused(await post(request, { full_name: `Ana ${rand()} @ Cruz`, mobile: mob() }), 'full_name', NAME_MSG);
});

test('A13 · AC-5 · refuse an empty full name (0 characters)', async ({ request }) => {
  await refused(await post(request, { full_name: '', mobile: mob() }), 'full_name', NAME_MSG);
});

test('A14 · AC-6 · create using an email of 254 characters', async ({ request }) => {
  const email = 'a'.repeat(249) + '@x.co';
  expect(email.length).toBe(254);
  await created(await post(request, { full_name: nm(), mobile: mob(), email }));
});

test('A15 · AC-6 · refuse an email of 255 characters', async ({ request }) => {
  const email = 'a'.repeat(250) + '@x.co';
  expect(email.length).toBe(255);
  await refused(await post(request, { full_name: nm(), mobile: mob(), email }), 'email', EMAIL_MSG);
});

test('A16 · AC-6 · refuse the email "ana.mail.ph" (no @)', async ({ request }) => {
  await refused(await post(request, { full_name: nm(), mobile: mob(), email: 'ana.mail.ph' }), 'email', EMAIL_MSG);
});

test('A17 · AC-6 · refuse the email "ana@dela@mail.ph" (two @)', async ({ request }) => {
  await refused(await post(request, { full_name: nm(), mobile: mob(), email: 'ana@dela@mail.ph' }), 'email', EMAIL_MSG);
});

test('A18 · AC-6 · refuse the email "ana@mail" (no dot after @)', async ({ request }) => {
  await refused(await post(request, { full_name: nm(), mobile: mob(), email: 'ana@mail' }), 'email', EMAIL_MSG);
});

test('A19 · AC-6 · refuse the email "ana.dela@mail" (dot only before @)', async ({ request }) => {
  await refused(await post(request, { full_name: nm(), mobile: mob(), email: 'ana.dela@mail' }), 'email', EMAIL_MSG);
});

test('A20 · AC-7 · list under Steve-8414 shows the new mobile, list under Steve-8414-other does not', async ({ request }) => {
  const mobile = mob();
  await created(await post(request, { full_name: nm(), mobile }));
  const mine = await request.get(URL, { headers: H });
  expect(mine.ok()).toBeTruthy();
  expect(JSON.stringify(await mine.json())).toContain(mobile);
  const other = await request.get(URL, { headers: OTHER });
  expect(other.ok()).toBeTruthy();
  expect(JSON.stringify(await other.json())).not.toContain(mobile);
});

const badMobile = (id: string, what: string, value: () => string) =>
  test(`${id} · AC-8 · refuse the mobile ${what}`, async ({ request }) => {
    await refused(await post(request, { full_name: nm(), mobile: value() }), 'mobile', MOBILE_MSG);
  });

badMobile('A21', '"09" + 8 digits (10 characters)', () => '09' + digits(8));
badMobile('A22', '"09" + 10 digits (12 characters)', () => '09' + digits(10));
badMobile('A23', '"+639" + 8 digits', () => '+639' + digits(8));
badMobile('A24', '"+639" + 10 digits', () => '+639' + digits(10));
badMobile('A25', '"0917 1234567" (a space)', () => '0917 1234567');
badMobile('A26', '"0917-123-4567" (dashes)', () => '0917-123-4567');
badMobile('A27', 'of 10 digits with no 09 or +639 prefix', () => '9' + digits(9));
badMobile('A28', '"09abcdefghi" (letters)', () => '09abcdefghi');
badMobile('A29', '"08" + 9 digits', () => '08' + digits(9));
badMobile('A30', '"+638" + 9 digits', () => '+638' + digits(9));
