import { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Avatar,
  Chip,
  Divider,
  StatusPill,
  ProgressBar,
  EmptyState,
  ZoneCard,
  OrderRow,
  InfoRow,
  Navigation,
  NavItem,
  NavItemGroup,
  Modal,
} from '@/components';

/**
 * COMPONENT USAGE EXAMPLES
 * 
 * This file demonstrates how to use all KART components
 * in real-world scenarios.
 */

// ===== 1. BUTTON EXAMPLES =====
export function ButtonExamples() {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '20px' }}>
      <Button type="Primary">Primary Button</Button>
      <Button type="Secondary">Secondary</Button>
      <Button type="Ghost">Ghost</Button>
      <Button type="Success">Success</Button>
      <Button type="Danger">Delete</Button>
      <Button type="Disabled" disabled>Disabled</Button>
      <Button type="Primary" state="Pressed">Pressed State</Button>
    </div>
  );
}

// ===== 2. INPUT EXAMPLES =====
export function InputExamples() {
  const [email, setEmail] = useState('');
  const [textarea, setTextarea] = useState('');

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
      <Input
        label="Email Address"
        type="Text"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Amount (with prefix)"
        type="Text"
        prefix="₱"
        placeholder="0.00"
      />

      <Input
        label="Message (textarea)"
        type="Textarea"
        value={textarea}
        onChange={(e) => setTextarea(e.target.value)}
        maxLength={500}
      />

      <Input
        label="Focused Input"
        type="Text"
        state="Focused"
        placeholder="Currently focused"
      />
    </div>
  );
}

// ===== 3. CARD EXAMPLES =====
export function CardExamples() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
      <Card variant="Base">
        <h3>Default Card</h3>
        <p>Standard white card with light border</p>
      </Card>

      <Card variant="Highlight">
        <h3>Highlighted Card</h3>
        <p>Orange border and light background for featured content</p>
      </Card>

      <Card variant="StatusAccent">
        <h3>Status Card</h3>
        <p>Left-aligned accent border for status messages</p>
      </Card>
    </div>
  );
}

// ===== 4. AVATAR & CHIPS =====
export function AvatarAndChips() {
  const [selected, setSelected] = useState('react');

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <Avatar initials="RU" />
        <Avatar initials="KU" />
        <Avatar initials="TM" />
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['react', 'tailwind', 'javascript', 'design'].map((tag) => (
          <Chip
            key={tag}
            label={tag}
            selected={selected === tag}
            onClick={() => setSelected(tag)}
          />
        ))}
      </div>
    </div>
  );
}

// ===== 5. STATUS & PROGRESS =====
export function StatusAndProgress() {
  const [progress, setProgress] = useState('Accepted');

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <h3>Status Pills</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <StatusPill status="Default" />
          <StatusPill status="Searching" />
          <StatusPill status="Accepted" />
          <StatusPill status="AtStore" />
          <StatusPill status="Purchased" />
          <StatusPill status="Delivered" />
        </div>
      </div>

      <div>
        <h3>Progress Bar</h3>
        <div style={{ maxWidth: '400px', marginBottom: '20px' }}>
          <ProgressBar currentStep={progress} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['Accepted', 'At Store', 'Purchased', 'Delivered'].map((step) => (
            <Button
              key={step}
              type={progress === step ? 'Primary' : 'Ghost'}
              onClick={() => setProgress(step)}
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              {step}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== 6. ZONE CARD =====
export function ZoneCardExample() {
  const zones = [
    { zone: 'Guadalupe', city: 'Cebu City' },
    { zone: 'Tisa', city: 'Cebu City' },
    { zone: 'Lahug', city: 'Cebu City' },
  ];

  const [selected, setSelected] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Select a Zone:</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 150px)', gap: '12px' }}>
        {zones.map((zone, idx) => (
          <ZoneCard
            key={idx}
            zone={zone.zone}
            city={zone.city}
            isSelected={selected === idx}
            onClick={() => setSelected(idx)}
          />
        ))}
      </div>
    </div>
  );
}

// ===== 7. ORDER ROW =====
export function OrderRowExample() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h3>Order History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <OrderRow
          itemSummary="Rice, Oil, Salt, Sugar"
          zone="Guadalupe"
          date="15 Jan 2026"
          amount="₱1,200.50"
          role="Requester"
        />
        <OrderRow
          itemSummary="Cereal, Milk, Eggs"
          zone="Tisa"
          date="14 Jan 2026"
          amount="₱850.00"
          role="Runner"
        />
      </div>
    </div>
  );
}

// ===== 8. FORM EXAMPLE =====
export function CompleteForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    zone: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <Card variant="Base" style={{ maxWidth: '400px', margin: '20px' }}>
      <h2>Order Form</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your name"
        />

        <Input
          label="Email"
          type="Text"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@email.com"
        />

        <Input
          label="Additional Notes"
          type="Textarea"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          maxLength={200}
        />

        <Divider />

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="Primary" style={{ flex: 1 }}>Submit</Button>
          <Button type="Ghost" style={{ flex: 1 }}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

// ===== 9. EMPTY STATE =====
export function EmptyStateExample() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f5f5f5' }}>
      <EmptyState
        title="No Orders Yet"
        message="You haven't placed any orders. Start by selecting a zone and browsing available items."
        icon="📦"
      />
    </div>
  );
}

// ===== 10. NAVIGATION LAYOUT =====
export function LayoutWithNavigation() {
  const [selectedNav, setSelectedNav] = useState('home');

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Navigation
        userName="Current User"
        userInitials="CU"
        role="Requester"
        selectedNav={selectedNav}
        onNavChange={setSelectedNav}
      />
      <main style={{ flex: 1, padding: '24px', backgroundColor: '#fafaf8', overflowY: 'auto' }}>
        {selectedNav === 'home' && <h2>Home Dashboard</h2>}
        {selectedNav === 'history' && <h2>Order History</h2>}
        {selectedNav === 'profile' && <h2>User Profile</h2>}
      </main>
    </div>
  );
}

// ===== 11. INFO ROW (DISPLAY DETAILS) =====
export function InfoRowExample() {
  return (
    <Card variant="Base" style={{ maxWidth: '300px', margin: '20px' }}>
      <h3>Order Details</h3>
      <InfoRow label="Order ID" value="#12345" />
      <InfoRow label="Status" value="Delivered" />
      <InfoRow label="Zone" value="Guadalupe" />
      <InfoRow label="Total" value="₱2,500.00" />
    </Card>
  );
}

// ===== 12. MODAL EXAMPLE =====
export function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <Button type="Primary" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
          <Modal>
            <h2>Confirm Action</h2>
            <p>Are you sure you want to proceed?</p>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <Button type="Primary" style={{ flex: 1 }} onClick={() => setIsOpen(false)}>
                Confirm
              </Button>
              <Button type="Ghost" style={{ flex: 1 }} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}

// ===== DEMO PAGE =====
export default function ComponentShowcase() {
  const [activeTab, setActiveTab] = useState('buttons');

  const tabs = [
    { id: 'buttons', label: 'Buttons', component: ButtonExamples },
    { id: 'inputs', label: 'Inputs', component: InputExamples },
    { id: 'cards', label: 'Cards', component: CardExamples },
    { id: 'avatar', label: 'Avatar & Chips', component: AvatarAndChips },
    { id: 'status', label: 'Status & Progress', component: StatusAndProgress },
    { id: 'zones', label: 'Zones', component: ZoneCardExample },
    { id: 'orders', label: 'Orders', component: OrderRowExample },
    { id: 'form', label: 'Form', component: CompleteForm },
    { id: 'empty', label: 'Empty State', component: EmptyStateExample },
    { id: 'details', label: 'Details', component: InfoRowExample },
    { id: 'modal', label: 'Modal', component: ModalExample },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ButtonExamples;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e8e4e0',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              border: '1px solid',
              borderColor: activeTab === tab.id ? '#ff5c1a' : '#e8e4e0',
              backgroundColor: activeTab === tab.id ? '#fff3ee' : 'white',
              color: activeTab === tab.id ? '#ff5c1a' : '#4a4540',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? '600' : '400',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px' }}>
        <ActiveComponent />
      </div>
    </div>
  );
}
