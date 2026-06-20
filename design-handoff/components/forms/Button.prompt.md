Swifto's primary action button — solid brand-blue by default, used for "Post a job", "Log in", "Submit application" and every key CTA.

```jsx
<Button onClick={post}>Post a job</Button>
<Button variant="outline">Find jobs</Button>
<Button variant="white" size="lg">Withdraw earnings</Button>
```

Variants: `primary` (blue, hover → secondary), `white` (white on brand bands, hover → canvas), `outlineWhite` (ghost on brand bands), `outline` (neutral border, hover → primary), `ghost` (text-only). Sizes: `sm` 40px, `md` 48px (matches inputs), `lg` 56px. Use `fullWidth` inside forms and cards. Labels are sentence case and medium weight.
