Swifto's surface primitive — white, hairline ink/15 border, soft `sm` shadow, rounded-2xl. The backbone of every list row, dashboard tile and feature panel.

```jsx
<Card>Static content</Card>
<Card interactive onClick={open}>Lifts and turns blue on hover</Card>
<Card padding="xl">Roomier feature panel</Card>
```

`interactive` adds the brand hover lift (translate-up + scale 1.05 + blue border). `padding`: none / sm / md / lg (default) / xl. Use `as="a"` or `as="article"` to change the element.
