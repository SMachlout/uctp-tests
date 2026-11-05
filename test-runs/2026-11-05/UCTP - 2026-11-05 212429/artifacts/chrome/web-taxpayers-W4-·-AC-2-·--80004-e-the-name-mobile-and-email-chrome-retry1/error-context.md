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