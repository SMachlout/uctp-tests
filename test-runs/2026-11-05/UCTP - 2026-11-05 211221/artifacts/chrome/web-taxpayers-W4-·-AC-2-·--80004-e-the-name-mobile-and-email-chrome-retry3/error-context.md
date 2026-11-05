# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\taxpayers.spec.ts >> W4 · AC-2 · reload My taxpayers and still see the name, mobile and email
- Location: tests\web\taxpayers.spec.ts:64:5

# Error details

```
Test timeout of 30000ms exceeded.
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
    - generic [ref=e18]:
      - heading "My data" [level=1] [ref=e19]
      - paragraph [ref=e20]: Everything created under your name. Another name — even the same name typed again — sees nothing here.
      - generic [ref=e21]:
        - heading "My taxpayers" [level=2] [ref=e22]
        - table [ref=e23]:
          - rowgroup [ref=e24]:
            - row [ref=e25]:
              - columnheader "Name" [ref=e26]
              - columnheader "Mobile" [ref=e27]
              - columnheader "Email" [ref=e28]
          - rowgroup [ref=e29]:
            - row [ref=e30]:
              - cell "Ana ytks Dela Cruz" [ref=e31]
              - cell "09884449908" [ref=e32]
              - cell "ana.pegu@mail.ph" [ref=e33]
            - row [ref=e34]:
              - cell "Ana aosw Dela Cruz" [ref=e35]
              - cell "09884419048" [ref=e36]
              - cell "ana.aler@mail.ph" [ref=e37]
            - row [ref=e38]:
              - cell "Ana sxbp Dela Cruz" [ref=e39]
              - cell "09884388259" [ref=e40]
              - cell "ana.eyll@mail.ph" [ref=e41]
            - row [ref=e42]:
              - cell "Rosa Web" [ref=e43]
              - cell "09843834822" [ref=e44]
              - cell "—" [ref=e45]
            - row [ref=e46]:
              - cell "Ana Dela Cruz" [ref=e47]
              - cell "09843797721" [ref=e48]
              - cell "rosa@example.com" [ref=e49]
            - row [ref=e50]:
              - cell "Ana jzrs Dela Cruz" [ref=e51]
              - cell "09884375707" [ref=e52]
              - cell "ana.uint@mail.ph" [ref=e53]
            - row [ref=e54]:
              - cell "Ana cogu Dela Cruz" [ref=e55]
              - cell "09884372460" [ref=e56]
              - cell "ana.txzv@mail.ph" [ref=e57]
            - row [ref=e58]:
              - cell "Ana kihx Dela Cruz" [ref=e59]
              - cell "09884369283" [ref=e60]
              - cell "ana.mtyw@mail.ph" [ref=e61]
            - row [ref=e62]:
              - cell "Ana wgzx Dela Cruz" [ref=e63]
              - cell "09884366188" [ref=e64]
              - cell "ana.tytk@mail.ph" [ref=e65]
            - row [ref=e66]:
              - cell "Ana xzno Dela Cruz" [ref=e67]
              - cell "09884363403" [ref=e68]
              - cell "—" [ref=e69]
            - row [ref=e70]:
              - cell "Ana Dela Cruz" [ref=e71]
              - cell "09843555517" [ref=e72]
              - cell "—" [ref=e73]
            - row [ref=e74]:
              - cell "Ana Dela Cruz" [ref=e75]
              - cell "09843546906" [ref=e76]
              - cell "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com" [ref=e77]
            - row [ref=e78]:
              - cell "Ana Dela Cruz" [ref=e79]
              - cell "09843538735" [ref=e80]
              - cell "rosa@example.com" [ref=e81]
            - row [ref=e82]:
              - cell "Ana Dela Cruz" [ref=e83]
              - cell "09843530534" [ref=e84]
              - cell "—" [ref=e85]
            - row [ref=e86]:
              - cell "Ñoño O'Brien-Cruz Jr." [ref=e87]
              - cell "09843522323" [ref=e88]
              - cell "—" [ref=e89]
            - row [ref=e90]:
              - cell "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" [ref=e91]
              - cell "09843513412" [ref=e92]
              - cell "—" [ref=e93]
            - row [ref=e94]:
              - cell "Ana Dela Cruz" [ref=e95]
              - cell "09843504881" [ref=e96]
              - cell "—" [ref=e97]
            - row [ref=e98]:
              - cell "Ana-Marie izpz O'Neil Ñ Jr." [ref=e99]
              - cell "09884347459" [ref=e100]
              - cell "—" [ref=e101]
            - row [ref=e102]:
              - cell "Ana zfhq xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" [ref=e103]
              - cell "09884345777" [ref=e104]
              - cell "—" [ref=e105]
            - row [ref=e106]:
              - cell "Al" [ref=e107]
              - cell "09884343632" [ref=e108]
              - cell "—" [ref=e109]
      - generic [ref=e110]:
        - heading "My bills" [level=2] [ref=e111]
        - paragraph [ref=e112]: None yet.
      - generic [ref=e113]:
        - heading "My tellers" [level=2] [ref=e114]
        - paragraph [ref=e115]: None yet.
      - generic [ref=e116]:
        - heading "My approver" [level=2] [ref=e117]
        - paragraph [ref=e118]: None yet — create one in Training setup (step 5).
      - generic [ref=e119]:
        - heading "My receipts" [level=2] [ref=e120]
        - paragraph [ref=e121]: None yet — collect a payment at the POS.
```