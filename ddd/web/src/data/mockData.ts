import type { BoundedContext, Aggregate, Entity, Command, DomainEvent, BusinessRule, ValueObject, ContextIntegration, Property } from '../types/ddd.types';

// Order Management Context
const orderManagementContext: BoundedContext = {
  id: 'order-management',
  name: 'Order Management',
  description: 'Handles customer orders, shopping carts, and order lifecycle',
  color: 'bg-blue-100',
  ubiquitousLanguage: {
    'Order': 'A customer\'s purchase request containing line items',
    'Shopping Cart': 'Temporary collection of items before order placement',
    'Line Item': 'Individual product with quantity in an order',
    'Order Total': 'Sum of all line item subtotals plus taxes and shipping',
  },
  aggregates: [
    {
      id: 'order-agg',
      name: 'Order',
      contextId: 'order-management',
      rootEntity: {
        id: 'order-entity',
        name: 'Order',
        isRoot: true,
        properties: [
          { name: 'orderId', type: 'string', required: true },
          { name: 'customerId', type: 'string', required: true },
          { name: 'status', type: 'OrderStatus', required: true },
          { name: 'total', type: 'Money', required: true },
          { name: 'placedAt', type: 'Date', required: true },
        ],
      },
      entities: [
        {
          id: 'lineitem-entity',
          name: 'LineItem',
          isRoot: false,
          properties: [
            { name: 'productId', type: 'string', required: true },
            { name: 'quantity', type: 'number', required: true },
            { name: 'unitPrice', type: 'Money', required: true },
            { name: 'subtotal', type: 'Money', required: true },
          ],
        },
      ],
      valueObjects: [
        {
          id: 'money-vo',
          name: 'Money',
          properties: [
            { name: 'amount', type: 'number', required: true },
            { name: 'currency', type: 'string', required: true },
          ],
          validationRules: ['Amount must be non-negative', 'Currency must be valid ISO code'],
        },
      ],
      businessRules: [
        {
          id: 'order-total-rule',
          name: 'Order Total Consistency',
          description: 'Order total must equal the sum of all line item subtotals',
          invariant: 'Order.total == sum(LineItem.subtotal)',
          aggregateId: 'order-agg',
        },
        {
          id: 'no-cancel-shipped',
          name: 'Cannot Cancel Shipped Orders',
          description: 'Orders cannot be cancelled once they are shipped',
          invariant: 'if Order.status == SHIPPED then CancelOrder command must fail',
          aggregateId: 'order-agg',
        },
      ],
      commands: [
        {
          id: 'place-order-cmd',
          name: 'PlaceOrder',
          aggregateId: 'order-agg',
          parameters: [
            { name: 'customerId', type: 'string', required: true },
            { name: 'lineItems', type: 'LineItem[]', required: true },
          ],
          producesEvents: ['order-placed-event'],
        },
        {
          id: 'cancel-order-cmd',
          name: 'CancelOrder',
          aggregateId: 'order-agg',
          parameters: [
            { name: 'orderId', type: 'string', required: true },
            { name: 'reason', type: 'string', required: false },
          ],
          producesEvents: ['order-cancelled-event'],
        },
      ],
      events: [
        {
          id: 'order-placed-event',
          name: 'OrderPlaced',
          aggregateId: 'order-agg',
          properties: [
            { name: 'orderId', type: 'string', required: true },
            { name: 'customerId', type: 'string', required: true },
            { name: 'total', type: 'Money', required: true },
            { name: 'placedAt', type: 'Date', required: true },
          ],
          isPublished: true,
        },
        {
          id: 'order-cancelled-event',
          name: 'OrderCancelled',
          aggregateId: 'order-agg',
          properties: [
            { name: 'orderId', type: 'string', required: true },
            { name: 'reason', type: 'string', required: false },
            { name: 'cancelledAt', type: 'Date', required: true },
          ],
          isPublished: true,
        },
      ],
    },
    {
      id: 'cart-agg',
      name: 'ShoppingCart',
      contextId: 'order-management',
      rootEntity: {
        id: 'cart-entity',
        name: 'ShoppingCart',
        isRoot: true,
        properties: [
          { name: 'cartId', type: 'string', required: true },
          { name: 'customerId', type: 'string', required: true },
          { name: 'items', type: 'CartItem[]', required: true },
        ],
      },
      entities: [],
      valueObjects: [],
      businessRules: [],
      commands: [
        {
          id: 'add-to-cart-cmd',
          name: 'AddToCart',
          aggregateId: 'cart-agg',
          parameters: [
            { name: 'productId', type: 'string', required: true },
            { name: 'quantity', type: 'number', required: true },
          ],
          producesEvents: ['item-added-event'],
        },
      ],
      events: [
        {
          id: 'item-added-event',
          name: 'ItemAddedToCart',
          aggregateId: 'cart-agg',
          properties: [
            { name: 'cartId', type: 'string', required: true },
            { name: 'productId', type: 'string', required: true },
            { name: 'quantity', type: 'number', required: true },
          ],
          isPublished: false,
        },
      ],
    },
  ],
  integrations: [],
};

// Inventory Context
const inventoryContext: BoundedContext = {
  id: 'inventory',
  name: 'Inventory',
  description: 'Manages product inventory, stock levels, and reservations',
  color: 'bg-green-100',
  ubiquitousLanguage: {
    'Inventory Item': 'A product\'s stock information',
    'Reserve': 'Hold inventory for a pending order',
    'Stock Level': 'Current quantity available',
  },
  aggregates: [
    {
      id: 'inventory-item-agg',
      name: 'InventoryItem',
      contextId: 'inventory',
      rootEntity: {
        id: 'inventory-item-entity',
        name: 'InventoryItem',
        isRoot: true,
        properties: [
          { name: 'productId', type: 'string', required: true },
          { name: 'available', type: 'number', required: true },
          { name: 'reserved', type: 'number', required: true },
        ],
      },
      entities: [],
      valueObjects: [],
      businessRules: [
        {
          id: 'no-negative-stock',
          name: 'No Negative Stock',
          description: 'Available quantity cannot go below zero',
          invariant: 'InventoryItem.available >= 0',
          aggregateId: 'inventory-item-agg',
        },
      ],
      commands: [
        {
          id: 'reserve-inventory-cmd',
          name: 'ReserveInventory',
          aggregateId: 'inventory-item-agg',
          parameters: [
            { name: 'productId', type: 'string', required: true },
            { name: 'quantity', type: 'number', required: true },
            { name: 'orderId', type: 'string', required: true },
          ],
          producesEvents: ['inventory-reserved-event'],
        },
        {
          id: 'update-stock-cmd',
          name: 'UpdateStock',
          aggregateId: 'inventory-item-agg',
          parameters: [
            { name: 'productId', type: 'string', required: true },
            { name: 'quantity', type: 'number', required: true },
          ],
          producesEvents: ['stock-updated-event'],
        },
      ],
      events: [
        {
          id: 'inventory-reserved-event',
          name: 'InventoryReserved',
          aggregateId: 'inventory-item-agg',
          properties: [
            { name: 'productId', type: 'string', required: true },
            { name: 'quantity', type: 'number', required: true },
            { name: 'orderId', type: 'string', required: true },
          ],
          isPublished: true,
        },
        {
          id: 'stock-updated-event',
          name: 'StockUpdated',
          aggregateId: 'inventory-item-agg',
          properties: [
            { name: 'productId', type: 'string', required: true },
            { name: 'newQuantity', type: 'number', required: true },
          ],
          isPublished: false,
        },
      ],
    },
  ],
  integrations: [],
};

// Payment Context
const paymentContext: BoundedContext = {
  id: 'payment',
  name: 'Payment',
  description: 'Processes payments and handles payment methods',
  color: 'bg-yellow-100',
  ubiquitousLanguage: {
    'Payment': 'A financial transaction for an order',
    'Payment Method': 'Customer\'s payment instrument (card, bank account)',
    'Process': 'Charge the payment method',
  },
  aggregates: [
    {
      id: 'payment-agg',
      name: 'Payment',
      contextId: 'payment',
      rootEntity: {
        id: 'payment-entity',
        name: 'Payment',
        isRoot: true,
        properties: [
          { name: 'paymentId', type: 'string', required: true },
          { name: 'orderId', type: 'string', required: true },
          { name: 'amount', type: 'Money', required: true },
          { name: 'status', type: 'PaymentStatus', required: true },
        ],
      },
      entities: [],
      valueObjects: [],
      businessRules: [],
      commands: [
        {
          id: 'process-payment-cmd',
          name: 'ProcessPayment',
          aggregateId: 'payment-agg',
          parameters: [
            { name: 'orderId', type: 'string', required: true },
            { name: 'amount', type: 'Money', required: true },
            { name: 'paymentMethodId', type: 'string', required: true },
          ],
          producesEvents: ['payment-processed-event', 'payment-failed-event'],
        },
        {
          id: 'refund-payment-cmd',
          name: 'RefundPayment',
          aggregateId: 'payment-agg',
          parameters: [
            { name: 'paymentId', type: 'string', required: true },
            { name: 'amount', type: 'Money', required: true },
          ],
          producesEvents: ['payment-refunded-event'],
        },
      ],
      events: [
        {
          id: 'payment-processed-event',
          name: 'PaymentProcessed',
          aggregateId: 'payment-agg',
          properties: [
            { name: 'paymentId', type: 'string', required: true },
            { name: 'orderId', type: 'string', required: true },
            { name: 'amount', type: 'Money', required: true },
          ],
          isPublished: true,
        },
        {
          id: 'payment-failed-event',
          name: 'PaymentFailed',
          aggregateId: 'payment-agg',
          properties: [
            { name: 'orderId', type: 'string', required: true },
            { name: 'reason', type: 'string', required: true },
          ],
          isPublished: true,
        },
        {
          id: 'payment-refunded-event',
          name: 'PaymentRefunded',
          aggregateId: 'payment-agg',
          properties: [
            { name: 'paymentId', type: 'string', required: true },
            { name: 'amount', type: 'Money', required: true },
          ],
          isPublished: true,
        },
      ],
    },
  ],
  integrations: [],
};

// Fulfillment Context
const fulfillmentContext: BoundedContext = {
  id: 'fulfillment',
  name: 'Fulfillment',
  description: 'Handles order shipment and delivery tracking',
  color: 'bg-purple-100',
  ubiquitousLanguage: {
    'Shipment': 'Physical delivery of an order',
    'Tracking Info': 'Carrier tracking number and status',
  },
  aggregates: [
    {
      id: 'shipment-agg',
      name: 'Shipment',
      contextId: 'fulfillment',
      rootEntity: {
        id: 'shipment-entity',
        name: 'Shipment',
        isRoot: true,
        properties: [
          { name: 'shipmentId', type: 'string', required: true },
          { name: 'orderId', type: 'string', required: true },
          { name: 'trackingNumber', type: 'string', required: false },
          { name: 'status', type: 'ShipmentStatus', required: true },
        ],
      },
      entities: [],
      valueObjects: [],
      businessRules: [],
      commands: [
        {
          id: 'create-shipment-cmd',
          name: 'CreateShipment',
          aggregateId: 'shipment-agg',
          parameters: [
            { name: 'orderId', type: 'string', required: true },
            { name: 'address', type: 'Address', required: true },
          ],
          producesEvents: ['shipment-created-event'],
        },
        {
          id: 'update-tracking-cmd',
          name: 'UpdateTrackingInfo',
          aggregateId: 'shipment-agg',
          parameters: [
            { name: 'shipmentId', type: 'string', required: true },
            { name: 'trackingNumber', type: 'string', required: true },
          ],
          producesEvents: ['tracking-updated-event'],
        },
      ],
      events: [
        {
          id: 'shipment-created-event',
          name: 'ShipmentCreated',
          aggregateId: 'shipment-agg',
          properties: [
            { name: 'shipmentId', type: 'string', required: true },
            { name: 'orderId', type: 'string', required: true },
          ],
          isPublished: true,
        },
        {
          id: 'tracking-updated-event',
          name: 'TrackingInfoUpdated',
          aggregateId: 'shipment-agg',
          properties: [
            { name: 'shipmentId', type: 'string', required: true },
            { name: 'trackingNumber', type: 'string', required: true },
          ],
          isPublished: false,
        },
        {
          id: 'shipment-delivered-event',
          name: 'ShipmentDelivered',
          aggregateId: 'shipment-agg',
          properties: [
            { name: 'shipmentId', type: 'string', required: true },
            { name: 'deliveredAt', type: 'Date', required: true },
          ],
          isPublished: true,
        },
      ],
    },
  ],
  integrations: [],
};

// Context Integrations
const integrations: ContextIntegration[] = [
  {
    id: 'order-to-inventory',
    type: 'customer-supplier',
    sourceContextId: 'order-management',
    targetContextId: 'inventory',
    description: 'Order Management publishes OrderPlaced events that Inventory consumes to reserve stock',
    eventsPublished: ['OrderPlaced'],
    eventsConsumed: ['InventoryReserved'],
  },
  {
    id: 'order-to-payment',
    type: 'customer-supplier',
    sourceContextId: 'order-management',
    targetContextId: 'payment',
    description: 'Order Management publishes OrderPlaced events that Payment consumes to process payment',
    eventsPublished: ['OrderPlaced'],
    eventsConsumed: ['PaymentProcessed', 'PaymentFailed'],
  },
  {
    id: 'payment-to-fulfillment',
    type: 'customer-supplier',
    sourceContextId: 'payment',
    targetContextId: 'fulfillment',
    description: 'Payment publishes PaymentProcessed events that trigger shipment creation',
    eventsPublished: ['PaymentProcessed'],
    eventsConsumed: ['ShipmentCreated'],
  },
  {
    id: 'order-to-fulfillment',
    type: 'customer-supplier',
    sourceContextId: 'order-management',
    targetContextId: 'fulfillment',
    description: 'Fulfillment needs order details to create shipments',
    eventsPublished: ['OrderPlaced'],
    eventsConsumed: ['ShipmentCreated', 'ShipmentDelivered'],
  },
];

// Add integrations to contexts
orderManagementContext.integrations = integrations.filter(
  i => i.sourceContextId === 'order-management' || i.targetContextId === 'order-management'
);
inventoryContext.integrations = integrations.filter(
  i => i.sourceContextId === 'inventory' || i.targetContextId === 'inventory'
);
paymentContext.integrations = integrations.filter(
  i => i.sourceContextId === 'payment' || i.targetContextId === 'payment'
);
fulfillmentContext.integrations = integrations.filter(
  i => i.sourceContextId === 'fulfillment' || i.targetContextId === 'fulfillment'
);

export const mockBoundedContexts: BoundedContext[] = [
  orderManagementContext,
  inventoryContext,
  paymentContext,
  fulfillmentContext,
];

export const mockIntegrations: ContextIntegration[] = integrations;