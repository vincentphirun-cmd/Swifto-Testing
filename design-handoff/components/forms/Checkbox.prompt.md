Swifto checkbox — a custom box that fills brand-blue with a white check, plus an inline label. Used for opt-ins like "Flexible (no specific deadline)".

```jsx
const [flexible, setFlexible] = React.useState(false);
<Checkbox label="Flexible (no specific deadline)" checked={flexible} onChange={setFlexible} />
```

`onChange` receives `(checked, event)`.
