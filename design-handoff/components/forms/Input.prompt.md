Swifto labelled text input — 48px tall, rounded-xl, with a 2px brand-blue focus ring. Used in login, post-job and application forms.

```jsx
<Input label="Email address" type="email" placeholder="Enter your email" />
<Input label="Price of Job" prefix="$" type="number" helper="Minimum $5.00" />
<Input label="Area" error="This field is required" />
```

Pass `prefix="$"` for currency fields, `helper` for hints, `error` to show a red invalid state. Pairs at the same height as `<Button size="md">`.
