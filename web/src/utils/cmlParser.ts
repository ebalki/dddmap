/**
 * Simple CML (Context Mapper DSL) Parser
 *
 * Parses basic CML syntax into TypeScript objects.
 * Note: This is a simplified parser focusing on common patterns.
 * For complex CML files, consider using the full Xtext-based parser.
 */

import type {
  ContextMappingModel,
  ContextMap,
  BoundedContext,
  Aggregate,
  Entity,
  ValueObject,
  Service,
  Attribute,
  Reference,
  DomainObjectOperation,
  ServiceOperation,
  Relationship,
  Partnership,
  SharedKernel,
  UpstreamDownstreamRelationship,
  CustomerSupplierRelationship,
  DomainEvent,
  CommandEvent,
  Parameter,
} from '../types/cml.types';

export class CMLParser {
  private content: string;
  private pos: number = 0;

  constructor(content: string) {
    // Remove comments
    this.content = this.removeComments(content);
  }

  private removeComments(text: string): string {
    // Remove single-line comments
    text = text.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments
    text = text.replace(/\/\*[\s\S]*?\*\//g, '');
    return text;
  }

  parse(): ContextMappingModel {
    const model: ContextMappingModel = {
      boundedContexts: [],
      domains: [],
      userRequirements: [],
    };

    // Parse ContextMap
    const contextMapMatch = this.content.match(/ContextMap\s+(\w+)?\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/s);
    if (contextMapMatch) {
      model.contextMap = this.parseContextMap(contextMapMatch[0]);
    }

    // Parse BoundedContexts - use matchAllNested to handle nested braces
    const boundedContextMatches = this.matchAllNested(this.content, /BoundedContext\s+\w+/g, 'BoundedContext');
    model.boundedContexts = boundedContextMatches.map(match => this.parseBoundedContext(match));

    return model;
  }

  private matchAll(regex: RegExp): string[] {
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(this.content)) !== null) {
      matches.push(match[0]);
    }
    return matches;
  }

  private parseContextMap(text: string): ContextMap {
    const contextMap: ContextMap = {
      boundedContexts: [],
      relationships: [],
    };

    // Extract name
    const nameMatch = text.match(/ContextMap\s+(\w+)/);
    if (nameMatch) {
      contextMap.name = nameMatch[1];
    }

    // Extract type
    const typeMatch = text.match(/type\s*=?\s*(SYSTEM_LANDSCAPE|ORGANIZATIONAL)/);
    if (typeMatch) {
      contextMap.type = typeMatch[1] as any;
    }

    // Extract state
    const stateMatch = text.match(/state\s*=?\s*(AS_IS|TO_BE)/);
    if (stateMatch) {
      contextMap.state = stateMatch[1] as any;
    }

    // Extract contained contexts
    const containsMatch = text.match(/contains\s+([\w\s,]+)/);
    if (containsMatch) {
      contextMap.boundedContexts = containsMatch[1]
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);
    }

    // Parse relationships
    contextMap.relationships = this.parseRelationships(text);

    return contextMap;
  }

  private parseRelationships(text: string): Relationship[] {
    const relationships: Relationship[] = [];

    // Partnership: [P]<->[P] or Partnership keyword
    const partnershipRegex = /(\w+)\s*(?:\[P\])?\s*<->\s*(?:\[P\])?\s*(\w+)(?:\s*:\s*(\w+))?/g;
    let match;
    while ((match = partnershipRegex.exec(text)) !== null) {
      if (text.substring(match.index - 10, match.index).includes('Partnership') ||
          match[0].includes('[P]')) {
        relationships.push({
          type: 'Partnership',
          participant1: match[1],
          participant2: match[2],
          name: match[3],
        });
      }
    }

    // SharedKernel: [SK]<->[SK] or Shared-Kernel keyword
    const sharedKernelRegex = /(\w+)\s*\[SK\]\s*<->\s*\[SK\]\s*(\w+)(?:\s*:\s*(\w+))?/g;
    while ((match = sharedKernelRegex.exec(text)) !== null) {
      relationships.push({
        type: 'SharedKernel',
        participant1: match[1],
        participant2: match[2],
        name: match[3],
      });
    }

    // Upstream-Downstream: [U] -> [D] or <- notation
    const upstreamDownstreamRegex = /(\w+)\s*\[([^\]]+)\]\s*(->|<-)\s*\[([^\]]+)\]\s*(\w+)(?:\s*:\s*(\w+))?/g;
    while ((match = upstreamDownstreamRegex.exec(text)) !== null) {
      const isReverse = match[3] === '<-';
      const upstream = isReverse ? match[5] : match[1];
      const downstream = isReverse ? match[1] : match[5];
      const upstreamRoles = this.parseRoles(isReverse ? match[4] : match[2]);
      const downstreamRoles = this.parseRoles(isReverse ? match[2] : match[4]);

      // Check if it's Customer-Supplier
      const isCustomerSupplier =
        (upstreamRoles.includes('S') || downstreamRoles.includes('C'));

      if (isCustomerSupplier) {
        relationships.push({
          type: 'CustomerSupplier',
          upstream,
          downstream,
          upstreamRoles: this.mapUpstreamRoles(upstreamRoles),
          downstreamRoles: this.mapDownstreamRoles(downstreamRoles),
          name: match[6],
        });
      } else {
        relationships.push({
          type: 'UpstreamDownstream',
          upstream,
          downstream,
          upstreamRoles: this.mapUpstreamRoles(upstreamRoles),
          downstreamRoles: this.mapDownstreamRoles(downstreamRoles),
          name: match[6],
        });
      }
    }

    return relationships;
  }

  private parseRoles(rolesText: string): string[] {
    return rolesText.split(',').map(r => r.trim()).filter(r => r.length > 0);
  }

  private mapUpstreamRoles(roles: string[]): any[] {
    return roles
      .map(r => {
        if (r === 'PL') return 'PUBLISHED_LANGUAGE';
        if (r === 'OHS') return 'OPEN_HOST_SERVICE';
        return null;
      })
      .filter(r => r !== null) as any[];
  }

  private mapDownstreamRoles(roles: string[]): any[] {
    return roles
      .map(r => {
        if (r === 'ACL') return 'ANTICORRUPTION_LAYER';
        if (r === 'CF') return 'CONFORMIST';
        return null;
      })
      .filter(r => r !== null) as any[];
  }

  private parseBoundedContext(text: string): BoundedContext {
    const context: BoundedContext = {
      name: '',
      aggregates: [],
    };

    // Extract name
    const nameMatch = text.match(/BoundedContext\s+(\w+)/);
    if (nameMatch) {
      context.name = nameMatch[1];
    }

    // Extract type
    const typeMatch = text.match(/type\s*=?\s*(FEATURE|APPLICATION|SYSTEM|TEAM)/);
    if (typeMatch) {
      context.type = typeMatch[1] as any;
    }

    // Extract domainVisionStatement
    const visionMatch = text.match(/domainVisionStatement\s*=?\s*"([^"]*)"/);
    if (visionMatch) {
      context.domainVisionStatement = visionMatch[1];
    }

    // Extract responsibilities
    const responsibilitiesMatches = text.matchAll(/responsibilities\s*=?\s*"([^"]*)"/g);
    context.responsibilities = Array.from(responsibilitiesMatches, m => m[1]);

    // Extract implementationTechnology
    const techMatch = text.match(/implementationTechnology\s*=?\s*"([^"]*)"/);
    if (techMatch) {
      context.implementationTechnology = techMatch[1];
    }

    // Parse aggregates
    const aggregateMatches = this.matchAllNested(text, /Aggregate\s+\w+/g, 'Aggregate');
    context.aggregates = aggregateMatches.map(match => this.parseAggregate(match));

    return context;
  }

  private matchAllNested(text: string, startRegex: RegExp, keyword: string): string[] {
    const matches: string[] = [];
    const regex = new RegExp(`${keyword}\\s+\\w+\\s*\\{`, 'g');
    let match;

    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const openBrace = text.indexOf('{', start);
      if (openBrace === -1) continue;

      let braceCount = 1;
      let pos = openBrace + 1;
      while (pos < text.length && braceCount > 0) {
        if (text[pos] === '{') braceCount++;
        if (text[pos] === '}') braceCount--;
        pos++;
      }

      if (braceCount === 0) {
        matches.push(text.substring(start, pos));
      }
    }

    return matches;
  }

  private parseAggregate(text: string): Aggregate {
    const aggregate: Aggregate = {
      name: '',
      entities: [],
      valueObjects: [],
      events: [],
      commands: [],
      services: [],
    };

    // Extract name
    const nameMatch = text.match(/Aggregate\s+(\w+)/);
    if (nameMatch) {
      aggregate.name = nameMatch[1];
    }

    // Extract responsibilities
    const responsibilitiesMatches = text.matchAll(/responsibilities\s*=?\s*"([^"]*)"/g);
    aggregate.responsibilities = Array.from(responsibilitiesMatches, m => m[1]);

    // Parse entities
    const entityMatches = this.matchAllNested(text, /Entity\s+\w+/g, 'Entity');
    aggregate.entities = entityMatches.map(match => this.parseEntity(match));

    // Parse value objects
    const valueObjectMatches = this.matchAllNested(text, /ValueObject\s+\w+/g, 'ValueObject');
    aggregate.valueObjects = valueObjectMatches.map(match => this.parseValueObject(match));

    // Parse services
    const serviceMatches = this.matchAllNested(text, /Service\s+\w+/g, 'Service');
    aggregate.services = serviceMatches.map(match => this.parseService(match));

    // Parse commands
    const commandMatches = this.matchAllNested(text, /CommandEvent\s+\w+/g, 'CommandEvent');
    aggregate.commands = commandMatches.map(match => this.parseCommandEvent(match));

    // Parse events
    const eventMatches = this.matchAllNested(text, /DomainEvent\s+\w+/g, 'DomainEvent');
    aggregate.events = eventMatches.map(match => this.parseDomainEvent(match));

    return aggregate;
  }

  private parseEntity(text: string): Entity {
    const entity: Entity = {
      name: '',
      attributes: [],
      references: [],
      operations: [],
    };

    // Extract name
    const nameMatch = text.match(/Entity\s+(\w+)/);
    if (nameMatch) {
      entity.name = nameMatch[1];
    }

    // Check if aggregateRoot
    entity.aggregateRoot = text.includes('aggregateRoot');

    // Parse attributes and references
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();

      // Skip if line is a keyword or bracket
      if (trimmed.startsWith('Entity') || trimmed === '{' || trimmed === '}' ||
          trimmed === 'aggregateRoot' || trimmed.length === 0) {
        continue;
      }

      // Check if it's a reference (starts with - or has @)
      if (trimmed.startsWith('-') || trimmed.includes('@')) {
        const ref = this.parseReference(trimmed);
        if (ref) entity.references.push(ref);
      }
      // Check if it's an operation (has def or *)
      else if (trimmed.includes('def ') || trimmed.startsWith('*')) {
        const op = this.parseOperation(trimmed);
        if (op) entity.operations.push(op);
      }
      // Otherwise it's an attribute
      else if (trimmed.match(/^\w+\s+\w+/)) {
        const attr = this.parseAttribute(trimmed);
        if (attr) entity.attributes.push(attr);
      }
    }

    return entity;
  }

  private parseValueObject(text: string): ValueObject {
    const valueObject: ValueObject = {
      name: '',
      attributes: [],
      references: [],
      operations: [],
    };

    // Extract name
    const nameMatch = text.match(/ValueObject\s+(\w+)/);
    if (nameMatch) {
      valueObject.name = nameMatch[1];
    }

    // Parse attributes (same as entity)
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('ValueObject') || trimmed === '{' || trimmed === '}' ||
          trimmed.length === 0) {
        continue;
      }

      if (trimmed.startsWith('-') || trimmed.includes('@')) {
        const ref = this.parseReference(trimmed);
        if (ref) valueObject.references.push(ref);
      } else if (trimmed.includes('def ') || trimmed.startsWith('*')) {
        const op = this.parseOperation(trimmed);
        if (op) valueObject.operations.push(op);
      } else if (trimmed.match(/^\w+\s+\w+/)) {
        const attr = this.parseAttribute(trimmed);
        if (attr) valueObject.attributes.push(attr);
      }
    }

    return valueObject;
  }

  private parseAttribute(text: string): Attribute | null {
    // Format: Type name [constraints]
    // Example: String customerEmail email required
    // Example: BigDecimal total required min="0"
    // Example: int quantity range="1,100"

    const match = text.match(/^([\w<>]+)\s+(\w+)\s*(.*)?$/);
    if (!match) return null;

    const attribute: Attribute = {
      name: match[2],
      type: match[1],
    };

    const constraints = match[3] || '';

    // Parse constraints
    if (constraints.includes('required')) attribute.required = true;
    if (constraints.includes('nullable')) attribute.nullable = true;
    if (constraints.includes('unique')) attribute.unique = true;
    if (constraints.includes('key')) attribute.key = true;
    if (constraints.includes('email')) attribute.email = true;
    if (constraints.includes('past')) attribute.past = true;
    if (constraints.includes('future')) attribute.future = true;
    if (constraints.includes('notEmpty')) attribute.notEmpty = true;
    if (constraints.includes('notBlank')) attribute.notBlank = true;

    const minMatch = constraints.match(/min\s*=\s*"([^"]+)"/);
    if (minMatch) attribute.min = minMatch[1];

    const maxMatch = constraints.match(/max\s*=\s*"([^"]+)"/);
    if (maxMatch) attribute.max = maxMatch[1];

    const rangeMatch = constraints.match(/range\s*=\s*"([^"]+)"/);
    if (rangeMatch) attribute.range = rangeMatch[1];

    const lengthMatch = constraints.match(/length\s*=\s*"([^"]+)"/);
    if (lengthMatch) attribute.length = lengthMatch[1];

    const patternMatch = constraints.match(/pattern\s*=\s*"([^"]+)"/);
    if (patternMatch) attribute.pattern = patternMatch[1];

    return attribute;
  }

  private parseReference(text: string): Reference | null {
    // Format: - @Type name or - List<@Type> name
    const match = text.match(/(?:-\s*)?(?:(List|Set|Collection)<)?@?(\w+)>?\s+(\w+)/);
    if (!match) return null;

    return {
      name: match[3],
      domainObjectType: match[2],
      collectionType: match[1] as any,
    };
  }

  private parseOperation(text: string): DomainObjectOperation | null {
    // Format: def ReturnType methodName(ParamType param)
    // Format: * void methodName(@Type param)

    const match = text.match(/(?:def|\*)\s+(?:(\w+)\s+)?(\w+)\s*\(([^)]*)\)/);
    if (!match) return null;

    const operation: DomainObjectOperation = {
      name: match[2],
      returnType: match[1] || 'void',
      parameters: [],
    };

    // Parse parameters
    if (match[3]) {
      const params = match[3].split(',');
      for (const param of params) {
        const paramMatch = param.trim().match(/@?(\w+)\s+(\w+)/);
        if (paramMatch) {
          operation.parameters.push({
            name: paramMatch[2],
            type: paramMatch[1],
          });
        }
      }
    }

    // Check for read-only or write operations
    if (text.includes('read-only')) {
      operation.readOnly = true;
    }

    return operation;
  }

  private parseService(text: string): Service {
    const service: Service = {
      name: '',
      operations: [],
    };

    // Extract name
    const nameMatch = text.match(/Service\s+(\w+)/);
    if (nameMatch) {
      service.name = nameMatch[1];
    }

    // Parse operations (similar to domain object operations)
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('void ') || trimmed.match(/^\w+\s+\w+\s*\(/)) {
        const op = this.parseServiceOperation(trimmed);
        if (op) service.operations.push(op);
      }
    }

    return service;
  }

  private parseServiceOperation(text: string): ServiceOperation | null {
    // Format: void methodName(@Type param) : write [STATE1 -> STATE2]

    const match = text.match(/(?:(\w+)\s+)?(\w+)\s*\(([^)]*)\)/);
    if (!match) return null;

    const operation: ServiceOperation = {
      name: match[2],
      returnType: match[1] || 'void',
      parameters: [],
    };

    // Parse parameters
    if (match[3]) {
      const params = match[3].split(',');
      for (const param of params) {
        const paramMatch = param.trim().match(/@?(\w+)\s+(\w+)/);
        if (paramMatch) {
          operation.parameters.push({
            name: paramMatch[2],
            type: paramMatch[1],
          });
        }
      }
    }

    // Check for read-only or write operations
    if (text.includes('read-only')) {
      operation.readOnly = true;
    }

    // Parse state transition: [STATE1 -> STATE2 X STATE3]
    const transitionMatch = text.match(/\[([^\]]+)\]/);
    if (transitionMatch) {
      const transitionText = transitionMatch[1];
      const parts = transitionText.split('->');

      if (parts.length === 2) {
        const fromStates = parts[0].trim().split(',').map(s => s.trim()).filter(s => s.length > 0);
        const toStates = parts[1].trim().split(/[Xx]/).map(s => s.trim()).filter(s => s.length > 0);

        operation.stateTransition = {
          from: fromStates.length > 0 ? fromStates : undefined,
          to: toStates,
          exclusive: parts[1].includes('X') || parts[1].includes('x'),
        };
      }
    }

    return operation;
  }

  private parseCommandEvent(text: string): CommandEvent {
    const command: CommandEvent = {
      name: '',
      attributes: [],
      references: [],
    };

    // Extract name
    const nameMatch = text.match(/CommandEvent\s+(\w+)/);
    if (nameMatch) {
      command.name = nameMatch[1];
    }

    // Parse attributes and references (same as entity)
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('CommandEvent') || trimmed === '{' || trimmed === '}' ||
          trimmed.length === 0) {
        continue;
      }

      if (trimmed.startsWith('-') || trimmed.includes('@')) {
        const ref = this.parseReference(trimmed);
        if (ref) command.references.push(ref);
      } else if (trimmed.match(/^\w+\s+\w+/)) {
        const attr = this.parseAttribute(trimmed);
        if (attr) command.attributes.push(attr);
      }
    }

    return command;
  }

  private parseDomainEvent(text: string): DomainEvent {
    const event: DomainEvent = {
      name: '',
      attributes: [],
      references: [],
    };

    // Extract name
    const nameMatch = text.match(/DomainEvent\s+(\w+)/);
    if (nameMatch) {
      event.name = nameMatch[1];
    }

    // Parse attributes and references (same as entity)
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('DomainEvent') || trimmed === '{' || trimmed === '}' ||
          trimmed.length === 0) {
        continue;
      }

      if (trimmed.startsWith('-') || trimmed.includes('@')) {
        const ref = this.parseReference(trimmed);
        if (ref) event.references.push(ref);
      } else if (trimmed.match(/^\w+\s+\w+/)) {
        const attr = this.parseAttribute(trimmed);
        if (attr) event.attributes.push(attr);
      }
    }

    return event;
  }
}

/**
 * Parse CML content and return a structured model
 */
export function parseCML(cmlContent: string): ContextMappingModel {
  const parser = new CMLParser(cmlContent);
  return parser.parse();
}
