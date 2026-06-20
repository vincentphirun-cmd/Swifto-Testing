Swifto dashboard navigation tile — a square card with a large 80px icon disc, title, optional brand-blue highlight ("3 active") and muted caption. Grid these on the student and lister dashboards.

```jsx
<DashboardTile
  icon={<svg .../>}
  title="Active Jobs"
  highlight="3 active"
  caption="2 pending"
  onClick={go}
/>
```

Set `square={false}` to let it size to content. Icons use the Heroicons outline style.
