Swifto star rating — brand-blue filled stars, ink/20 empties. Read-only by default; pass `onChange` to turn it into a clickable input for leaving reviews.

```jsx
<StarRating value={4.8} showValue reviewCount={23} />        {/* display */}
<StarRating value={rating} onChange={setRating} size="lg" /> {/* input */}
```

Sizes: sm 20px, md 32px, lg 40px. Ratings and accountability are core to Swifto's trust model.
