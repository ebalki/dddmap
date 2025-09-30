# DDD-Driven Development Platform - Build Instructions for Claude Code

## Project Overview
Build a context-first DDD modeling and development platform with the following architecture principles:
- **Context-scoped navigation**: All views are scoped to a selected bounded context
- **Strategic Design**: High-level context map showing relationships between contexts
- **Tactical Design**: Deep dive into aggregates, events, commands within a specific context
- **Hexagonal Architecture**: Clean separation of concerns in codebase

## Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API + hooks
- **Build Tool**: Vite

## Project Structure

```
ddd-platform/
├── src/
│   ├── main.tsx                          # App entry point
│   ├── App.tsx                           # Root component with routing
│   ├── types/                            # TypeScript types
│   │   ├── ddd.types.ts                  # DDD domain types
│   │   └── workflow.types.ts             # Workflow and generation types
│   ├── contexts/                         # React contexts
│   │   ├── ProjectContext.tsx            # Global project state
│   │   └── BoundedContextContext.tsx     # Current bounded context state
│   ├── hooks/                            # Custom hooks
│   │   ├── useBoundedContexts.ts
│   │   └── useWorkflows.ts
│   ├── components/                       # Shared components
│   │   ├── layout/
│   │   │   ├── AppShell.tsx              # Main layout with header/nav
│   │   │   ├── ContextSelector.tsx       # Bounded context dropdown
│   │   │   └── Sidebar.tsx               # Context-scoped sidebar
│   │   ├── ui/                           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Tabs.tsx
│   │   └── visualization/
│   │       ├── ContextMapDiagram.tsx     # Strategic design view
│   │       └── EventStormingCanvas.tsx   # Event storming board
│   ├── pages/                            # Route pages
│   │   ├── Dashboard.tsx                 # Project overview
│   │   ├── ContextMap.tsx                # Strategic design (global view)
│   │   ├── context/                      # Context-scoped pages
│   │   │   ├── ContextOverview.tsx       # Context landing page
│   │   │   ├── EventStormingView.tsx     # Event storming canvas
│   │   │   ├── AggregatesView.tsx        # List of aggregates
│   │   │   ├── AggregateDetail.tsx       # Single aggregate deep dive
│   │   │   ├── CommandsEventsView.tsx    # Commands and events list
│   │   │   ├── BusinessRulesView.tsx     # Context-specific rules
│   │   │   ├── IntegrationsView.tsx      # Cross-context integrations
│   │   │   └── WorkflowsView.tsx         # Context-scoped workflows
│   │   ├── requirement/
│   │   │   ├── NewRequirement.tsx        # Add new requirement
│   │   │   └── RequirementMapping.tsx    # AI DDD mapping approval
│   │   └── workflow/
│   │       └── WorkflowMonitor.tsx       # Real-time workflow tracking
│   ├── data/                             # Mock data (will be replaced with API)
│   │   └── mockData.ts                   # Sample bounded contexts, aggregates
│   └── utils/
│       └── helpers.ts                    # Utility functions
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Key Components to Build

### 1. Types (src/types/ddd.types.ts)
```typescript
export interface BoundedContext {
  id: string;
  name: string;
  description: string;
  ubiquitousLanguage: Record<string, string>; // term -> definition
  aggregates: Aggregate[];
  integrations: ContextIntegration[];
}

export interface Aggregate {
  id: string;
  name: string;
  contextId: string;
  rootEntity: Entity;
  entities: Entity[];
  valueObjects: ValueObject[];
  businessRules: BusinessRule[];
  commands: Command[];
  events: DomainEvent[];
}

export interface Entity {
  id: string;
  name: string;
  properties: Property[];
  isRoot: boolean;
}

export interface ValueObject {
  id: string;
  name: string;
  properties: Property[];
  validationRules: string[];
}

export interface Command {
  id: string;
  name: string;
  aggregateId: string;
  parameters: Property[];
  producesEvents: string[]; // event IDs
}

export interface DomainEvent {
  id: string;
  name: string;
  aggregateId: string;
  properties: Property[];
  isPublished: boolean; // published to other contexts
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  invariant: string; // "Order.total must equal sum of OrderItem.subtotals"
  aggregateId: string;
}

export interface ContextIntegration {
  id: string;
  type: 'customer-supplier' | 'conformist' | 'anti-corruption-layer' | 'shared-kernel';
  sourceContextId: string;
  targetContextId: string;
  description: string;
  eventsPublished?: string[];
  eventsConsumed?: string[];
}

export interface Property {
  name: string;
  type: string;
  required: boolean;
}
```

### 2. App Shell (src/components/layout/AppShell.tsx)
- Header with project name and context selector
- Sidebar navigation (only shown when context is selected)
- Main content area

### 3. Context Selector (src/components/layout/ContextSelector.tsx)
- Dropdown showing all bounded contexts
- Current context highlighted
- "View Context Map" option (strategic view)
- "Add New Context" option

### 4. Sidebar Navigation (src/components/layout/Sidebar.tsx)
**Only visible when a bounded context is selected**

Navigation items:
- Overview (context landing page)
- Event Storming Canvas
- Aggregates
- Commands & Events
- Business Rules
- Integrations
- Workflows (context-scoped)

### 5. Context Map Page (src/pages/ContextMap.tsx)
**Strategic Design View** - The only global view

Features:
- Visual diagram showing all bounded contexts as boxes
- Lines connecting them showing relationships
- Relationship types labeled (Customer-Supplier, etc.)
- Click a context → navigate into that context
- Add new context button

### 6. Context Overview Page (src/pages/context/ContextOverview.tsx)
Landing page when entering a context

Shows:
- Context description
- Key metrics (# aggregates, # commands, # events, # active workflows)
- Ubiquitous language quick reference
- Recent changes to this context
- Quick actions (Add Aggregate, New Requirement, View Event Storming)

### 7. Event Storming Canvas (src/pages/context/EventStormingView.tsx)
**Critical component** - Visual board for domain discovery

Features:
- Horizontal timeline layout
- Color-coded sticky notes:
  - Orange: Domain Events
  - Blue: Commands
  - Yellow: Aggregates
  - Pink: Policies/Reactions
  - Red: Hotspots (unclear areas)
  - Purple: External Systems
- Drag and drop to organize
- Add new stickies
- Connect related items
- Export to PNG

### 8. Aggregates View (src/pages/context/AggregatesView.tsx)
List of aggregates within the current context

Each card shows:
- Aggregate name
- Root entity
- # of entities, value objects
- # of commands handled
- # of events produced
- Key business rules (max 2 preview)
- Click to see detail

### 9. Aggregate Detail (src/pages/context/AggregateDetail.tsx)
Deep dive into single aggregate

Shows:
- Visual diagram: Root entity → child entities → value objects
- Business rules panel (prominent)
- Commands handled (with parameters)
- Events produced (with properties)
- Invariants enforced
- Edit aggregate button

### 10. Commands & Events View (src/pages/context/CommandsEventsView.tsx)
Two tabs:
- **Commands**: List of commands in this context, grouped by aggregate
- **Events**: List of events, marked if published externally

For each command:
- Name, triggering aggregate
- Parameters
- Events it produces
- Validation rules

For each event:
- Name, source aggregate
- Properties
- Published to other contexts? (if yes, list which contexts consume)

### 11. Business Rules View (src/pages/context/BusinessRulesView.tsx)
List of all business rules and invariants within this context

Grouped by aggregate, showing:
- Rule description
- Invariant expression
- Where enforced (aggregate/entity)
- Related commands

### 12. Integrations View (src/pages/context/IntegrationsView.tsx)
Show how THIS context integrates with others

Two sections:
- **Events We Publish**: Events from this context consumed by others
- **Events We Consume**: Events from other contexts we react to

For each integration:
- Remote context name
- Relationship type
- Event name
- What we do with it (policy/reaction)

### 13. New Requirement Page (src/pages/requirement/NewRequirement.tsx)
Context-aware requirement input

Flow:
1. Select target bounded context (defaults to current)
2. Describe requirement (guided form):
   - What business capability?
   - What triggers this?
   - What's the desired outcome?
   - Which actors involved?
3. AI analyzes and proposes DDD mapping
4. Show side-by-side: Current model vs. Proposed changes
5. Approve/Refine/Reject

### 14. Requirement Mapping (src/pages/requirement/RequirementMapping.tsx)
AI-proposed DDD changes review

Shows:
- Requirement summary
- Target context highlighted
- Proposed changes (within that context):
  - New aggregates
  - Modified aggregates
  - New commands
  - New events
  - New business rules
  - Cross-context integrations needed
- Visual diff
- Approve → triggers workflow

### 15. Workflow Monitor (src/pages/workflow/WorkflowMonitor.tsx)
Real-time view of code generation workflow

Context filter: Show workflows for current context only

Shows:
- Progress steps (DDD mapping → Domain layer → Application layer → Infrastructure → Tests)
- Agent logs
- Generated files (with diff viewer)
- Architecture validation results
- PR link when ready

## Mock Data (src/data/mockData.ts)

Create sample data for 3-4 bounded contexts:

**1. Order Management Context**
- Aggregates: Order, ShoppingCart
- Commands: PlaceOrder, CancelOrder, AddLineItem, ApplyDiscount
- Events: OrderPlaced, OrderCancelled, OrderShipped
- Business Rules: "Order total must equal sum of line items", "Cannot cancel shipped order"
- Integrations: Publishes OrderPlaced → consumed by Fulfillment, Inventory

**2. Inventory Context**
- Aggregates: Product, InventoryItem
- Commands: ReserveInventory, ReleaseInventory, UpdateStock
- Events: InventoryReserved, StockUpdated, LowStockAlert
- Integrations: Consumes OrderPlaced → triggers ReserveInventory

**3. Payment Context**
- Aggregates: Payment, PaymentMethod
- Commands: ProcessPayment, RefundPayment
- Events: PaymentProcessed, PaymentFailed
- Integrations: Consumes OrderPlaced → triggers ProcessPayment

**4. Fulfillment Context**
- Aggregates: Shipment
- Commands: CreateShipment, UpdateTrackingInfo
- Events: ShipmentCreated, ShipmentDelivered
- Integrations: Consumes OrderPlaced + PaymentProcessed → triggers CreateShipment

## Routing Structure (src/App.tsx)

```typescript
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/context-map" element={<ContextMap />} />
  
  {/* Context-scoped routes */}
  <Route path="/context/:contextId" element={<ContextLayout />}>
    <Route index element={<ContextOverview />} />
    <Route path="event-storming" element={<EventStormingView />} />
    <Route path="aggregates" element={<AggregatesView />} />
    <Route path="aggregates/:aggregateId" element={<AggregateDetail />} />
    <Route path="commands-events" element={<CommandsEventsView />} />
    <Route path="business-rules" element={<BusinessRulesView />} />
    <Route path="integrations" element={<IntegrationsView />} />
    <Route path="workflows" element={<WorkflowsView />} />
  </Route>
  
  <Route path="/requirement/new" element={<NewRequirement />} />
  <Route path="/requirement/:requirementId/mapping" element={<RequirementMapping />} />
  <Route path="/workflow/:workflowId" element={<WorkflowMonitor />} />
</Routes>
```

## Design Guidelines

### Visual Design
- Use Tailwind CSS utilities
- Color palette:
  - Primary: Blue (strategic actions, navigation)
  - Context-specific: Different pastel for each context
  - Events: Orange
  - Commands: Blue
  - Aggregates: Yellow
  - Rules: Green
  - Integrations: Purple

### Context Indicator
Every page within a context should show:
```
[Icon] Order Management Context
```
in the header, so users always know where they are.

### Navigation Philosophy
- Dashboard and Context Map are global views
- Everything else requires selecting a bounded context first
- Breadcrumbs: Dashboard > Order Management > Aggregates > Order

### Empty States
When no context is selected, show:
"Select a bounded context to begin, or view the Context Map for strategic design"

## Build Instructions for Claude Code

1. Initialize Vite + React + TypeScript project
2. Install dependencies: react-router-dom, lucide-react, tailwindcss
3. Create file structure as outlined above
4. Implement types first (ddd.types.ts)
5. Create mock data (mockData.ts)
6. Build layout components (AppShell, ContextSelector, Sidebar)
7. Implement routing in App.tsx
8. Build pages in order:
   - Dashboard (simple, links to context map)
   - ContextMap (strategic view)
   - ContextOverview (landing page for context)
   - AggregatesView (list)
   - AggregateDetail (deep dive)
   - EventStormingView (visual canvas)
   - Other context pages
9. Style with Tailwind
10. Add interactions and navigation

## Key Features to Implement

✅ Context-scoped navigation (sidebar only shows when context selected)
✅ Context selector in header (always visible)
✅ Strategic view (Context Map) showing all contexts
✅ Tactical views (Aggregates, Events, etc.) scoped to current context
✅ Event Storming canvas with drag-and-drop sticky notes
✅ Aggregate detail with visual entity diagram
✅ Integration view showing cross-context relationships
✅ Business rules prominently displayed
✅ Ubiquitous language tooltips/glossary
✅ Breadcrumb navigation
✅ Mock workflow monitoring

## Success Criteria

The application should demonstrate:
1. **Context-first thinking**: Can't see aggregates without selecting a context
2. **Clear boundaries**: Each context view is isolated
3. **Strategic vs Tactical**: Context Map vs Context Details
4. **Visual DDD tools**: Event Storming, Context Map diagrams
5. **Business-friendly**: Rules and language are prominent
6. **Integration awareness**: Cross-context dependencies are explicit

Start building! 🚀
