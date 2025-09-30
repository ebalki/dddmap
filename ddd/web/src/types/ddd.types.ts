export interface BoundedContext {
  id: string;
  name: string;
  description: string;
  color: string; // Tailwind color class
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
  type: 'customer-supplier' | 'conformist' | 'anti-corruption-layer' | 'shared-kernel' | 'partnership';
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

// Event Storming types
export interface StickyNote {
  id: string;
  type: 'event' | 'command' | 'aggregate' | 'policy' | 'hotspot' | 'external';
  content: string;
  x: number;
  y: number;
  color: string;
  contextId: string;
}