The signature Swifto unit — a job listing tile. Title with optional status badges, pay in brand-blue, and a map-pin location row. Built on `Card`, so it lifts on hover when clickable.

```jsx
<JobCard title="Lawn mowing" detail="Backyard, ~50 sq m" pay="$45" location="Ponsonby, Auckland" onClick={open} />

<JobCard
  title="Moving boxes" detail="2-bedroom flat" pay="$120" location="Newmarket, Auckland" urgent
  actions={<>
    <Button size="sm">Quick Apply</Button>
    <Button size="sm" variant="outline">Apply</Button>
  </>}
/>
```

Use `urgent` / `applied` for status, and `actions` for an apply footer.
