# KART Components Library

A flexible, reusable component library for the KART application built with React.

## Folder Structure

```
src/components/
├── ui/                  # Base UI Components
│   ├── Avatar.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Chip.jsx
│   ├── Divider.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   ├── ProgressBar.jsx
│   ├── StatusPill.jsx
│   └── index.js
├── shared/              # Composite/Shared Components
│   ├── EmptyState.jsx
│   ├── InfoRow.jsx
│   ├── Navigation.jsx
│   ├── OrderRow.jsx
│   ├── ZoneCard.jsx
│   └── index.js
├── constants/           # Design Tokens
│   ├── colors.js
│   └── fonts.js
└── index.js            # Main export
```

## UI Components

### Button

Flexible button component with multiple variants and states.

```jsx
import { Button } from '@/components';

<Button type="Primary" state="Default">Click Me</Button>
<Button type="Secondary">Secondary</Button>
<Button type="Ghost">Ghost</Button>
<Button type="Success">Success</Button>
<Button type="Danger">Delete</Button>
<Button type="Disabled">Disabled</Button>
```

**Props:**

- `type`: 'Primary' | 'Secondary' | 'Ghost' | 'Success' | 'Danger' | 'Disabled' (default: 'Primary')
- `state`: 'Default' | 'Pressed' (default: 'Default')
- `children`: Button text
- Standard HTML button props

---

### Input

Flexible text input with optional prefix, suffix, and textarea mode.

```jsx
import { Input } from '@/components';

<Input label="Email" placeholder="Enter email" />
<Input type="Text" state="Focused" prefix="$" />
<Input type="Textarea" maxLength={500} />
```

**Props:**

- `type`: 'Text' | 'Textarea' (default: 'Text')
- `state`: 'Default' | 'Focused' | 'Inputted' (default: 'Default')
- `label`: Optional field label
- `prefix`: Optional prefix element (e.g., "$", "₱")
- `suffix`: Optional suffix element (icon)
- `maxLength`: For textarea (default: 500)
- `value`, `onChange`: Controlled component support
- Standard HTML input props

---

### Avatar

User avatar with initials or image.

```jsx
import { Avatar } from '@/components';

<Avatar initials="JD" />
<Avatar type="Image" image={imageUrl} />
```

**Props:**

- `type`: 'Initials' | 'Image' (default: 'Initials')
- `initials`: Text to display (default: 'JD')
- `image`: Image URL for Image type

---

### Card

Container component with optional variants for different styles.

```jsx
import { Card } from '@/components';

<Card variant="Base">Content</Card>
<Card variant="Highlight">Featured Content</Card>
<Card variant="StatusAccent">Status Content</Card>
```

**Props:**

- `variant`: 'Base' | 'Highlight' | 'StatusAccent' (default: 'Base')
- `children`: Card content

---

### Chip

Selectable tag/chip component.

```jsx
import { Chip } from '@/components';

<Chip label="Tag" selected={false} />
<Chip label="Selected Tag" selected={true} />
```

**Props:**

- `label`: Chip text
- `selected`: Boolean state (default: false)

---

### Divider

Horizontal or vertical divider line.

```jsx
import { Divider } from "@/components";

<Divider />;
```

---

### Modal

Bottom sheet modal component.

```jsx
import { Modal } from "@/components";

<Modal>
  <h2>Modal Content</h2>
</Modal>;
```

**Props:**

- `type`: 'BottomSheet' (default: 'BottomSheet')
- `children`: Modal content

---

### ProgressBar

Step progress indicator with labels.

```jsx
import { ProgressBar } from "@/components";

<ProgressBar currentStep="At Store" />;
```

**Props:**

- `currentStep`: 'Accepted' | 'At Store' | 'Purchased' | 'Delivered' (default: 'Accepted')

**Steps:** Accepted → At Store → Purchased → Delivered

---

### StatusPill

Status badge component.

```jsx
import { StatusPill } from "@/components";

<StatusPill status="Delivered" />;
```

**Props:**

- `status`: 'Default' | 'Searching' | 'Accepted' | 'AtStore' | 'Purchased' | 'Delivered'

---

## Shared Components

### EmptyState

Display when no content is available.

```jsx
import { EmptyState } from "@/components";

<EmptyState
  title="No Orders"
  message="You haven't placed any orders yet"
  icon={<Icon />}
/>;
```

**Props:**

- `title`: Empty state heading
- `message`: Empty state description
- `icon`: Optional icon element

---

### ZoneCard

Zone/location selector card.

```jsx
import { ZoneCard } from "@/components";

<ZoneCard zone="Guadalupe" city="Cebu City" isSelected={false} />;
```

**Props:**

- `zone`: Zone name
- `city`: City name
- `isSelected`: Boolean selection state

---

### OrderRow

Display order information in a compact row.

```jsx
import { OrderRow } from "@/components";

<OrderRow
  itemSummary="Item 1, Item 2"
  zone="Guadalupe"
  date="01 Jan 2024"
  amount="₱1,500.00"
  role="Requester"
/>;
```

**Props:**

- `itemSummary`: Items ordered
- `zone`: Delivery zone
- `date`: Order date
- `amount`: Order amount
- `role`: 'Requester' | 'Runner'

---

### InfoRow

Display label-value pair with border.

```jsx
import { InfoRow } from "@/components";

<InfoRow label="Status" value="Delivered" />;
```

**Props:**

- `label`: Field label
- `value`: Field value

---

### Navigation

Side navigation panel with user info.

```jsx
import { Navigation } from "@/components";

<Navigation
  userName="Current User"
  userInitials="CU"
  role="Requester"
  selectedNav="home"
  onNavChange={(navId) => console.log(navId)}
/>;
```

**Props:**

- `userName`: Display name
- `userInitials`: Avatar initials
- `role`: User role
- `selectedNav`: Currently selected nav item ('home' | 'history' | 'profile')
- `onNavChange`: Callback when nav item clicked

---

## Design Tokens

### Colors

```jsx
import { colors } from "@/constants/colors";

colors.primary.orange; // #ff5c1a
colors.status.green; // #00c27c
colors.ink.default; // #12100e
colors.surface.white; // #ffffff
```

### Fonts

```jsx
import { fonts } from "@/constants/fonts";

fonts.display.family; // 'Syne'
fonts.content.primary.family; // 'DM Sans'
fonts.content.mono.family; // 'DM Mono'
fonts.general.family; // 'Inter'
```

---

## Usage Examples

### Complete Form

```jsx
import { Button, Input, Card } from "@/components";

export function OrderForm() {
  const [email, setEmail] = useState("");

  return (
    <Card variant="Base">
      <Input
        label="Email"
        type="Text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <Button type="Primary">Submit</Button>
    </Card>
  );
}
```

### Navigation Layout

```jsx
import { Navigation } from "@/components";

export function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Navigation userName="User Name" role="Requester" />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
```

---

## Customization

All components support:

- `className` prop for additional CSS classes
- `style` prop for inline styles
- Standard HTML attributes
- Full event handler support

## CSS Architecture

Each component has an accompanying CSS file with:

- Base styles
- Variant-specific styles
- State-based styles
- Responsive considerations

Colors and fonts reference the design tokens from `@/constants/`.
