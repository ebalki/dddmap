# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Domain-Driven Design (DDD) Discovery & Refinement Platform** for legacy modernization, built with React + TypeScript. The application:

**Primary Use Case**: AI agent analyzes legacy codebases → generates DDD model in CML format → this platform helps domain experts review, refine, and map unmapped elements.

**Key Features**:
- Load and visualize CML (Context Mapper DSL) models
- Review AI-generated bounded contexts and aggregates
- Map unmapped legacy code elements to DDD model
- Visualize Strategic Design (Context Maps with relationships)
- Explore Tactical Design (Aggregates, Entities, Value Objects)
- Track Commands, Events, and Business Rules (CQRS patterns)
- Manage cross-context integrations
- Event Storming boards

## Commands

### Development
```bash
cd web
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Architecture

### Core Design Principles

1. **Context-First Navigation**: All tactical design views require selecting a bounded context first
   - Global views: Dashboard, Context Map (strategic design)
   - Context-scoped views: Everything else (accessible via sidebar)
   - Sidebar only appears when a context is selected

2. **State Management**:
   - `ProjectContext`: Global state for all bounded contexts, aggregates, integrations
   - `BoundedContextContext`: Currently selected context (not currently used in routes, context ID comes from URL params)

3. **Routing Structure**:
   ```
   /                                 → Dashboard (global)
   /context-map                      → Context Map (strategic view, global)
   /analysis                         → DDD Analysis & Mapping (NEW: unmapped elements)
   /context/:contextId               → ContextLayout wrapper (shows sidebar)
     ├── /                           → Context Overview (landing page)
     ├── /event-storming             → Event Storming Canvas
     ├── /aggregates                 → List of aggregates
     ├── /aggregates/:aggregateId    → Aggregate detail
     ├── /commands-events            → Commands & Events (tabbed view)
     ├── /business-rules             → Business rules list
     ├── /integrations               → Cross-context integrations
     └── /workflows                  → Workflows (placeholder)
   /requirement/new                  → New requirement form (placeholder)
   ```

4. **Component Organization**:
   - `components/layout/`: AppShell, ContextSelector, Sidebar
   - `components/ui/`: Reusable primitives (Button, Card, Badge, Tabs)
   - `pages/`: Route components
   - `pages/context/`: Context-scoped pages

### DDD Type System

**Legacy Types** (`src/types/ddd.types.ts`):
- Original simple types for mock data
- Still used by existing pages
- Will be gradually replaced by CML-aligned types

**CML-Aligned Types** (`src/types/cml.types.ts`):
Complete type definitions based on Context Mapper DSL grammar:
- `ContextMappingModel`: Root model with contexts, relationships, domains
- `BoundedContext`: Full CML structure with type, domainVisionStatement, responsibilities, evolution
- `Aggregate`: With responsibilities (including "RULE: ..." business rules), user requirements
- `Entity`, `ValueObject`: With attributes, references, operations, validations
- `Service`: With operations including state transitions
- `DomainEvent`, `CommandEvent`: CQRS events with full metadata
- `Relationship`: Partnership, SharedKernel, UpstreamDownstream, CustomerSupplier with roles
- `StateTransition`: Lifecycle rules like `[PLACED -> CONFIRMED X CANCELLED]`
- `UnmappedElement`: Legacy code elements needing mapping
- `MappedElement`: Tracking of mapped elements

### Mock Data

Mock data in `src/data/mockData.ts` provides 4 e-commerce bounded contexts:
1. **Order Management**: Orders, Shopping Carts
2. **Inventory**: Products, Inventory Items, Stock
3. **Payment**: Payment processing, refunds
4. **Fulfillment**: Shipments, tracking

Each context includes complete examples of aggregates, commands, events, business rules, and cross-context integrations.

## DDD Color Coding

Consistent color scheme across the application:
- **Events**: Orange (`bg-orange-100`, `text-orange-700`, etc.)
- **Commands**: Blue (`bg-blue-100`, `text-blue-700`, etc.)
- **Aggregates**: Yellow (`bg-yellow-100`, `text-yellow-700`, etc.)
- **Business Rules**: Green (`bg-green-100`, `text-green-700`, etc.)
- **Integrations**: Purple (`bg-purple-100`, `text-purple-700`, etc.)

Each bounded context also has its own color (stored in `BoundedContext.color` field).

## CML Integration & Analysis Workflow

### Context Mapper DSL (CML)
The platform uses **Context Mapper DSL** as the standard format for DDD models. CML is an Xtext-based DSL that provides:

**Strategic Design**:
- `ContextMap` with relationship patterns: `[U,S]`, `[D,C]`, `[P]`, `[SK]`, `[OHS]`, `[ACL]`, `[PL]`, `[CF]`
- Bounded contexts with type, vision, responsibilities

**Tactical Design**:
- Aggregates with entities, value objects, services
- State transitions: `void approve() : write [SUBMITTED -> APPROVED X REJECTED];`
- Validation constraints: `String email required email`, `int quantity range="1,100"`
- Business rules in responsibilities: `"RULE: Order.total must equal sum(LineItem.subtotal)"`

**Sample CML File**: `web/public/sample-ecommerce.cml`

### CML Parser
**Location**: `src/utils/cmlParser.ts`

Simple regex-based parser that converts CML text into TypeScript objects:
```typescript
import { parseCML } from '../utils/cmlParser';

const model = parseCML(cmlFileContent);
// Returns: ContextMappingModel with boundedContexts, relationships, etc.
```

**Capabilities**:
- Parses ContextMap with relationships
- Extracts BoundedContexts with all metadata
- Parses Aggregates, Entities, ValueObjects, Services
- Extracts responsibilities (including RULE: patterns)
- Parses attributes with validation constraints
- Extracts operations with state transitions

**Limitations**: Simplified parser for common patterns. For complex CML, consider using full Xtext parser.

### Analysis Workflow (AnalysisView Page)

**Input Format** (`DDDAnalysisResult`):
```json
{
  "cml": "... CML model content ...",
  "unmappedElements": [
    {
      "id": "um_001",
      "type": "action",
      "name": "calculateShippingCost",
      "description": "Plain English: what this code does",
      "location": "src/OrderProcessor.java:156"
    }
  ],
  "metadata": {
    "sourceProject": "legacy-ecommerce",
    "analyzedAt": "2025-09-30T10:00:00Z"
  }
}
```

**Unmapped Elements**:
- **type**: `"structure"` (data) or `"action"` (behavior)
- **description**: Plain English explanation for domain experts
- **No code snippets**: Just reference to file:line

**Mapping Interface**:
Domain experts review unmapped elements and map them to:
1. Select Bounded Context
2. Select Aggregate
3. Select Element Type (Entity/Service/ValueObject/etc.)
4. Optionally provide new element name

**Output**: Mapped elements with full lineage back to legacy code.

## Key Implementation Notes

### Context Selection
- The `ContextSelector` component in the header allows switching between contexts
- When a context is selected, navigate to `/context/:contextId`
- The `ContextLayout` component provides the context-scoped wrapper with sidebar navigation

### Finding Related Data
Use helper patterns like:
```typescript
const context = contexts.find(c => c.id === contextId);
const aggregate = context?.aggregates.find(a => a.id === aggregateId);
const command = aggregate?.commands.find(c => c.id === commandId);
```

### Business Rules in CML
Business rules are expressed as responsibilities with `RULE:` prefix:

```cml
Aggregate Order {
  responsibilities = "RULE: Order.total must equal sum(LineItem.subtotal)",
                    "RULE: Cannot modify order after shipment"

  Entity Order {
    // Implementation enforces the rules
  }
}
```

This approach is DDD-correct: rules are embedded in the domain model, not separate metadata. The textual form serves as:
1. **Documentation** for domain experts
2. **LLM hints** for code generation (AI reads "RULE: ..." and generates enforcement code)
3. **Design guidance** for developers

**Legacy UI**: Business rules display with name/description/invariant (will be updated to use CML responsibilities)

### Event Storming Canvas
Currently a static placeholder showing sticky note categories. Future enhancement: drag-and-drop functionality with positioned `StickyNote` objects.

## Technology Stack

- **React 19** + **TypeScript**
- **React Router v6** (client-side routing)
- **Tailwind CSS v4** (styling)
- **Lucide React** (icons)
- **Vite 7** (build tool)

## Future Enhancements (Noted in README)

- AI-powered requirement mapping
- Real-time code generation workflows
- Advanced context map visualizations with diagram libraries
- Drag-and-drop Event Storming
- Export diagrams (PNG/SVG)
- Backend API integration
- Architecture validation
