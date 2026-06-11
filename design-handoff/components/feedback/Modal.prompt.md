Swifto dialog — a rounded white card centered over a dark blurred scrim, with an optional title/subtitle, close button, and footer action row. Closes on scrim click and Esc. Used for job applications, withdrawals and deposits.

```jsx
<Modal
  open={open}
  onClose={close}
  title="Apply for Job"
  subtitle="Lawn mowing"
  footer={<Button fullWidth onClick={submit}>Submit Application</Button>}
>
  <Textarea label="Experience" />
</Modal>
```

Widths: sm 448 / md 576 / lg 672. Body scrolls past 90vh.
