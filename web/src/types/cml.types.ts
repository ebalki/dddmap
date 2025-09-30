/**
 * TypeScript types aligned with Context Mapper DSL (CML) schema
 * Based on ContextMappingDSL.xtext and TacticDDDLanguage.xtext
 */

// ============================================================================
// STRATEGIC DESIGN - Context Map Layer
// ============================================================================

export interface ContextMappingModel {
  contextMap?: ContextMap;
  boundedContexts: BoundedContext[];
  domains?: Domain[];
  userRequirements?: UserRequirement[];
  metadata?: ModelMetadata;
}

export interface ModelMetadata {
  sourceProject?: string;
  analyzedAt?: string;
  agentVersion?: string;
}

export interface ContextMap {
  name?: string;
  type?: ContextMapType;
  state?: ContextMapState;
  boundedContexts: string[]; // References to BoundedContext names
  relationships: Relationship[];
}

export type ContextMapType = 'SYSTEM_LANDSCAPE' | 'ORGANIZATIONAL';
export type ContextMapState = 'AS_IS' | 'TO_BE';

// ============================================================================
// RELATIONSHIPS
// ============================================================================

export type Relationship =
  | Partnership
  | SharedKernel
  | UpstreamDownstreamRelationship
  | CustomerSupplierRelationship;

export interface Partnership {
  type: 'Partnership';
  participant1: string; // BoundedContext name
  participant2: string;
  name?: string;
  implementationTechnology?: string;
}

export interface SharedKernel {
  type: 'SharedKernel';
  participant1: string;
  participant2: string;
  name?: string;
  implementationTechnology?: string;
}

export interface UpstreamDownstreamRelationship {
  type: 'UpstreamDownstream';
  upstream: string; // BoundedContext name
  downstream: string;
  upstreamRoles?: UpstreamRole[];
  downstreamRoles?: DownstreamRole[];
  name?: string;
  implementationTechnology?: string;
  exposedAggregates?: string[]; // Aggregate names
  downstreamRights?: DownstreamGovernanceRights;
}

export interface CustomerSupplierRelationship {
  type: 'CustomerSupplier';
  upstream: string; // Supplier
  downstream: string; // Customer
  upstreamRoles?: UpstreamRole[];
  downstreamRoles?: DownstreamRole[];
  name?: string;
  implementationTechnology?: string;
  exposedAggregates?: string[];
  downstreamRights?: DownstreamGovernanceRights;
}

export type UpstreamRole = 'PUBLISHED_LANGUAGE' | 'OPEN_HOST_SERVICE';
export type DownstreamRole = 'ANTICORRUPTION_LAYER' | 'CONFORMIST';
export type DownstreamGovernanceRights =
  | 'INFLUENCER'
  | 'OPINION_LEADER'
  | 'VETO_RIGHT'
  | 'DECISION_MAKER'
  | 'MONOPOLIST';

// ============================================================================
// BOUNDED CONTEXT
// ============================================================================

export interface BoundedContext {
  name: string;
  type?: BoundedContextType;
  domainVisionStatement?: string;
  responsibilities?: string[]; // Including "RULE: ..." for business rules
  implementationTechnology?: string;
  knowledgeLevel?: KnowledgeLevel;
  businessModel?: string;
  evolution?: Evolution;

  // Tactical DDD elements
  application?: Application;
  modules?: Module[];
  aggregates: Aggregate[];
  domainServices?: Service[];

  // For UI
  color?: string; // Tailwind color class
}

export type BoundedContextType = 'FEATURE' | 'APPLICATION' | 'SYSTEM' | 'TEAM';
export type KnowledgeLevel = 'META' | 'CONCRETE';
export type Evolution = 'GENESIS' | 'CUSTOM_BUILT' | 'PRODUCT' | 'COMMODITY';

// ============================================================================
// DOMAIN & SUBDOMAIN
// ============================================================================

export interface Domain {
  name: string;
  domainVisionStatement?: string;
  subdomains: Subdomain[];
}

export interface Subdomain {
  name: string;
  type?: SubDomainType;
  domainVisionStatement?: string;
  supportedFeatures?: string[]; // UserRequirement names
  entities?: Entity[];
  services?: Service[];
}

export type SubDomainType = 'CORE_DOMAIN' | 'SUPPORTING_DOMAIN' | 'GENERIC_SUBDOMAIN';

// ============================================================================
// TACTICAL DESIGN - Aggregate & Domain Objects
// ============================================================================

export interface Aggregate {
  name: string;
  responsibilities?: string[]; // Including "RULE: ..." business rules
  userRequirements?: string[]; // UseCase/UserStory names
  owner?: string; // BoundedContext name (for team ownership)
  knowledgeLevel?: KnowledgeLevel;
  likelihoodForChange?: Volatility;
  contentVolatility?: Volatility;

  // Domain objects
  entities: Entity[];
  valueObjects: ValueObject[];
  events: DomainEvent[];
  commands: CommandEvent[];
  services: Service[];
}

export type Volatility = 'NORMAL' | 'RARELY' | 'OFTEN';
export type Criticality = 'NORMAL' | 'HIGH' | 'LOW';

// ============================================================================
// ENTITY & VALUE OBJECT
// ============================================================================

export interface Entity {
  name: string;
  abstract?: boolean;
  extends?: string; // Parent entity name
  aggregateRoot?: boolean;
  attributes: Attribute[];
  references: Reference[];
  operations: DomainObjectOperation[];
  repository?: Repository;
}

export interface ValueObject {
  name: string;
  abstract?: boolean;
  extends?: string;
  persistent?: boolean;
  immutable?: boolean;
  attributes: Attribute[];
  references: Reference[];
  operations: DomainObjectOperation[];
}

export interface Attribute {
  name: string;
  type: string; // String, int, BigDecimal, Date, etc.
  collectionType?: CollectionType;
  visibility?: Visibility;

  // Constraints (business rules at field level)
  key?: boolean;
  required?: boolean;
  nullable?: boolean;
  unique?: boolean;

  // Validation
  min?: string;
  max?: string;
  range?: string;
  length?: string;
  pattern?: string;
  email?: boolean;
  past?: boolean;
  future?: boolean;
  notEmpty?: boolean;
  notBlank?: boolean;
}

export interface Reference {
  name: string;
  domainObjectType: string; // Entity/ValueObject name
  collectionType?: CollectionType;
  visibility?: Visibility;

  // Constraints
  required?: boolean;
  nullable?: boolean;
  cascade?: string;

  // Associations
  opposite?: string; // Bidirectional reference
}

export type CollectionType = 'List' | 'Set' | 'Bag' | 'Collection' | 'Map';
export type Visibility = 'public' | 'protected' | 'private' | 'package';

// ============================================================================
// OPERATIONS
// ============================================================================

export interface DomainObjectOperation {
  name: string;
  returnType?: string;
  parameters: Parameter[];
  visibility?: Visibility;
  abstract?: boolean;
  readOnly?: boolean;
  stateTransition?: StateTransition;
}

export interface ServiceOperation {
  name: string;
  returnType?: string;
  parameters: Parameter[];
  visibility?: Visibility;
  readOnly?: boolean;
  stateTransition?: StateTransition;
  delegate?: {
    service: string;
    operation: string;
  };
}

export interface Parameter {
  name: string;
  type: string;
  domainObjectType?: string; // If type is a domain object
}

export interface StateTransition {
  from?: string[]; // State enum values
  to: string[];    // Target state(s) - can be exclusive alternatives (X)
  exclusive?: boolean; // X means exclusive choice
}

// ============================================================================
// EVENTS & COMMANDS
// ============================================================================

export interface DomainEvent {
  name: string;
  abstract?: boolean;
  extends?: string;
  persistent?: boolean;
  attributes: Attribute[];
  references: Reference[];
}

export interface CommandEvent {
  name: string;
  abstract?: boolean;
  extends?: string;
  persistent?: boolean;
  attributes: Attribute[];
  references: Reference[];
}

// ============================================================================
// SERVICES
// ============================================================================

export interface Service {
  name: string;
  operations: ServiceOperation[];
  dependencies?: string[]; // Service/Repository names
}

export interface Repository {
  name: string;
  operations: RepositoryOperation[];
}

export interface RepositoryOperation {
  name: string;
  returnType?: string;
  parameters: Parameter[];
  visibility?: Visibility;
  query?: string;
}

// ============================================================================
// APPLICATION LAYER
// ============================================================================

export interface Application {
  name?: string;
  commands?: CommandEvent[];
  events?: DomainEvent[];
  services?: Service[];
  flows?: Flow[];
}

export interface Flow {
  name: string;
  steps: FlowStep[];
}

export type FlowStep =
  | DomainEventProductionStep
  | CommandInvocationStep;

export interface DomainEventProductionStep {
  type: 'DomainEventProduction';
  command?: string;
  operation?: string;
  actor?: string;
  aggregate?: string;
  stateTransition?: StateTransition;
  events: string[]; // Event names
}

export interface CommandInvocationStep {
  type: 'CommandInvocation';
  events: string[]; // Triggering events
  commands: string[]; // Commands to invoke
}

// ============================================================================
// MODULE
// ============================================================================

export interface Module {
  name: string;
  aggregates: Aggregate[];
  services: Service[];
  entities: Entity[];
  valueObjects: ValueObject[];
}

// ============================================================================
// USER REQUIREMENTS
// ============================================================================

export type UserRequirement = UseCase | UserStory;

export interface UseCase {
  type: 'UseCase';
  name: string;
  actor?: string;
  secondaryActors?: string[];
  interactions?: string[];
  benefit?: string;
  scope?: string;
  level?: string;
}

export interface UserStory {
  type: 'UserStory';
  name: string;
  role?: string;
  features?: string[];
  benefit?: string;
}

// ============================================================================
// UNMAPPED ELEMENTS (Agent Analysis Output)
// ============================================================================

export interface DDDAnalysisResult {
  cml: string; // Raw CML content
  unmappedElements: UnmappedElement[];
  metadata?: ModelMetadata;
}

export interface UnmappedElement {
  id: string;
  type: 'structure' | 'action';
  name: string; // Class/method/table name
  description: string; // Plain English explanation
  location: string; // file:line reference
}

export interface MappedElement {
  unmappedId: string;
  mappedTo: {
    contextName: string;
    aggregateName: string;
    elementType: 'Entity' | 'Service' | 'ValueObject' | 'DomainEvent' | 'Command';
    elementName?: string; // If creating new element
  };
  mappedAt: string;
  mappedBy?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

export interface Property {
  name: string;
  type: string;
  required: boolean;
}
