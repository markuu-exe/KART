# Component Development Guide

## Key Design Principles

### 1. **Flexibility Over Rigidity**

- Components accept `className` prop for additional styling
- All support standard HTML attributes
- Optional features (prefix, icons, etc.) are truly optional
- Don't force props that aren't always needed

### 2. **Proper Prop Defaults**

Components are designed with smart defaults so basic usage is minimal:

```jsx
// Simple usage - all defaults
<Button>Click Me</Button>

// Enhanced usage
<Button type="Secondary" state="Pressed">Advanced</Button>
```

### 3. **CSS-Based Variants**

Each component uses CSS classes for variants instead of complex logic:

- Easier to debug
- Better performance
- Clearer visual states
- Maintainable styling

---

## Input Component Details

The Input component learned from Figma showing that variants don't always use all props:

```jsx
// Prefix is ALWAYS included in the design
<Input prefix="₱" label="Amount" />

// For textarea, prefix makes no sense - so it's omitted
<Input type="Textarea" label="Message" />

// You can provide icons via suffix prop
<Input suffix={<CheckIcon />} />
```

**States available:**

- `Default` - Idle state
- `Focused` - Actively being edited
- `Inputted` - Has content

---

## Button Variants

- **Primary**: Main action buttons (submit, confirm)
- **Secondary**: Alternative actions
- **Ghost**: Minimal buttons (cancel, dismiss)
- **Success**: Positive actions (complete, confirm)
- **Danger**: Destructive actions (delete, remove)
- **Disabled**: Non-interactive state

All support `state: "Pressed"` for active/held state.

---

## Color System

The color palette is organized by purpose, not just color:

```javascript
colors.primary.*      // Brand colors (primary actions)
colors.status.*       // Semantic status colors (green, red, etc.)
colors.ink.*          // Text colors (default, mid, light)
colors.surface.*      // Background colors
colors.border.*       // Dividers and borders
```

Use semantic naming when possible:

```jsx
// Good ✅
backgroundColor: colors.status.green;

// Avoid ❌
backgroundColor: "#00c27c";
```

---

## Typography

Use font tokens instead of hardcoding:

```jsx
// In CSS or styled components
font-family: var(--font-display);        // Syne - for headings
font-family: var(--font-content-primary); // DM Sans - body text
font-family: var(--font-content-mono);   // DM Mono - monospace
font-family: var(--font-general);        // Inter - fallback
```

---

## State Management

### Local Component State

```jsx
const [email, setEmail] = useState("");
<Input value={email} onChange={(e) => setEmail(e.target.value)} />;
```

### Form State (Multiple Fields)

```jsx
const [formData, setFormData] = useState({ email: "", name: "" });
<Input
  value={formData.email}
  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
/>;
```

### Selection State

```jsx
const [selected, setSelected] = useState("home");
<ZoneCard isSelected={selected === zone} onClick={() => setSelected(zone)} />;
```

---

## Composition Patterns

### Simple Wrapper

```jsx
function MyCard() {
  return (
    <Card variant="Highlight">
      <h2>Title</h2>
      <p>Content</p>
    </Card>
  );
}
```

### With Actions

```jsx
function OrderCard({ order }) {
  return (
    <Card>
      <OrderRow {...order} />
      <Divider />
      <div style={{ display: "flex", gap: "8px" }}>
        <Button type="Primary">Accept</Button>
        <Button type="Ghost">Decline</Button>
      </div>
    </Card>
  );
}
```

### With Layout

```jsx
function AppLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Navigation />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
```

---

## Common Patterns

### Loading State

```jsx
<Button disabled>Loading...</Button>
```

### Empty States

```jsx
{
  items.length === 0 ? (
    <EmptyState title="No items" message="Add some items to get started" />
  ) : (
    <ItemList items={items} />
  );
}
```

### Success/Error Messages

```jsx
<StatusPill status="Delivered" />  // Green
<StatusPill status="Purchased" />  // Orange
```

### Form Validation

```jsx
const [error, setError] = useState("");
<Input
  state={error ? "Inputted" : "Default"}
  // Show error message
/>;
{
  error && <p style={{ color: colors.status.red }}>{error}</p>;
}
```

---

## Styling Customization

### Override via className

```jsx
<Button className="my-custom-class">Custom</Button>
```

### Inline styles

```jsx
<Card style={{ maxWidth: "500px", margin: "0 auto" }}>Content</Card>
```

### CSS modules (recommended)

```jsx
import styles from "./MyComponent.module.css";

<Button className={styles.myButton}>Custom</Button>;
```

---

## Accessibility Considerations

### Semantic HTML

Components use proper HTML elements:

- `<button>` for buttons (not divs)
- `<input>` for inputs
- `<nav>` for navigation
- `<article>` or `<section>` for cards

### ARIA Labels

Add when needed:

```jsx
<Button aria-label="Close dialog">✕</Button>
<Input aria-label="Search items" />
```

### Keyboard Navigation

All interactive components support:

- Tab key navigation
- Enter key activation
- Escape key for modals

### Color Contrast

All text meets WCAG standards:

- Dark text on light backgrounds
- Light text on dark backgrounds

---

## Performance Tips

### Avoid Unnecessary Re-renders

```jsx
// Bad - recreates function on every render
<Button onClick={() => setActive(!active)}>Toggle</Button>;

// Good - reference existing function
const handleToggle = () => setActive(!active);
<Button onClick={handleToggle}>Toggle</Button>;
```

### Memoize Lists

```jsx
const items = useMemo(
  () => data.map((item) => <Item key={item.id} {...item} />),
  [data],
);
```

### Lazy Load Modals

```jsx
const Modal = lazy(() => import("./Modal"));
```

---

## Component Composition Checklist

- ✅ Determine if component needs state
- ✅ Choose appropriate variant
- ✅ Add required labels/text
- ✅ Connect event handlers
- ✅ Add accessibility attributes
- ✅ Test responsive behavior
- ✅ Verify color contrast
- ✅ Check with screen readers

---

## File Structure

```
ComponentName/
├── ComponentName.jsx      # Component logic
├── ComponentName.css      # Styles
├── ComponentName.test.jsx # Tests (future)
└── index.js              # Export

# OR for simpler components:
ComponentName.jsx          # Logic + inline styles reference
ComponentName.css          # Dedicated styles
```

---

## Testing Components

```jsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components";

test("renders button with text", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});

test("handles click events", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  screen.getByText("Click").click();
  expect(handleClick).toHaveBeenCalled();
});
```

---

## Future Enhancements

- [ ] Add more status colors
- [ ] Create compound component patterns
- [ ] Add animation examples
- [ ] Build a design tokens editor
- [ ] Add dark mode support
- [ ] Create component composition tools
- [ ] Expand icon library
- [ ] Add more form components (Select, Checkbox, Radio)

---

## Questions & Support

When building new components, ask:

1. **Is this truly a new component, or a composition of existing ones?**
2. **What are the different states/variants?**
3. **How will users customize this?**
4. **What's the simplest way to use it?**
5. **What CSS patterns are already established?**

Keep it simple. Keep it flexible. Keep it consistent.
