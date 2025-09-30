# DDD Platform - Domain-Driven Design Modeling Tool

A modern, context-first DDD modeling and development platform built with React, TypeScript, and Tailwind CSS.

## Features

### Strategic Design
- **Context Map**: Visual representation of bounded contexts and their relationships
- **Integration Patterns**: Customer-Supplier, Conformist, Anti-Corruption Layer, Shared Kernel

### Tactical Design (Context-Scoped)
- **Aggregates View**: List and detail views of domain aggregates
- **Entity Diagrams**: Visual representation of aggregate structures
- **Commands & Events**: Comprehensive view of CQRS patterns
- **Business Rules**: Invariants and domain rules with formal expressions
- **Event Storming Canvas**: Interactive sticky note board for domain discovery
- **Integrations**: Cross-context event publishing and consumption

### UI/UX Highlights
- Context-scoped navigation with sidebar
- Color-coded bounded contexts
- Badge system for DDD concepts (Events, Commands, Aggregates, Rules)
- Responsive design with Tailwind CSS
- Clean, professional interface

## Technology Stack

- **React 18+** with TypeScript
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for fast development

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Server

The app is available at `http://localhost:5173/`

## Project Structure

```
src/
├── components/
│   ├── layout/          # AppShell, ContextSelector, Sidebar
│   ├── ui/              # Reusable UI components (Button, Card, Badge, Tabs)
│   └── visualization/   # Future: Advanced diagrams
├── contexts/            # React Context API for state management
├── data/                # Mock data (4 bounded contexts)
├── pages/
│   ├── context/         # Context-scoped pages
│   ├── requirement/     # Requirement management (placeholder)
│   └── workflow/        # Workflow monitoring (placeholder)
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## Mock Data

The application includes sample e-commerce bounded contexts:

1. **Order Management**: Orders, Shopping Carts, Line Items
2. **Inventory**: Product inventory, stock levels, reservations
3. **Payment**: Payment processing, refunds
4. **Fulfillment**: Shipments, tracking, delivery

Each context includes:
- Multiple aggregates with entities and value objects
- Commands and domain events
- Business rules with invariants
- Cross-context integrations

## Navigation

### Global Views
- **Dashboard**: Project overview with metrics
- **Context Map**: Strategic design view of all contexts

### Context-Scoped Views (Sidebar Navigation)
- **Overview**: Context landing page with quick actions
- **Event Storming**: Visual domain discovery canvas
- **Aggregates**: List and detail views
- **Commands & Events**: CQRS pattern exploration
- **Business Rules**: Domain invariants and constraints
- **Integrations**: Cross-context relationships
- **Workflows**: Code generation tracking (placeholder)

## Design Philosophy

### Context-First Thinking
- All tactical design views require selecting a bounded context first
- Clear visual indicators of current context
- Sidebar navigation only visible within a context

### DDD Color Coding
- **Events**: Orange
- **Commands**: Blue
- **Aggregates**: Yellow
- **Business Rules**: Green
- **Integrations**: Purple

### Professional UI/UX
- Clean, modern design with Tailwind CSS
- Hover effects and transitions
- Consistent spacing and typography
- Responsive layout

## Future Enhancements

- AI-powered requirement mapping
- Real-time code generation workflows
- Advanced context map visualizations
- Event Storming drag-and-drop functionality
- Export diagrams as PNG/SVG
- Architecture validation
- Integration with backend API

## License

MIT