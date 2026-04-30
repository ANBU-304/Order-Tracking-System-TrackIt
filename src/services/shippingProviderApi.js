// src/services/shippingProviderApi.js

// Mock data for shipping providers
const mockCarriers = {
  fedex: {
    id: 'fedex',
    name: 'FedEx',
    logo: '📦',
    color: '#4D148C',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    status: 'connected',
    apiHealth: 'operational',
    lastSync: new Date().toISOString(),
    metrics: {
      totalShipments: 1245,
      inTransit: 89,
      delivered: 1134,
      exceptions: 22,
      avgDeliveryTime: 2.8,
      onTimeRate: 94.5,
      costPerPackage: 12.50
    },
    services: [
      { name: 'FedEx Ground', code: 'FEDEX_GROUND', avgDays: '3-5', price: 8.99 },
      { name: 'FedEx Express', code: 'FEDEX_EXPRESS', avgDays: '1-2', price: 24.99 },
      { name: 'FedEx 2Day', code: 'FEDEX_2DAY', avgDays: '2', price: 18.99 },
      { name: 'FedEx Overnight', code: 'FEDEX_OVERNIGHT', avgDays: '1', price: 45.99 }
    ]
  },
  ups: {
    id: 'ups',
    name: 'UPS',
    logo: '🚚',
    color: '#351C15',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    status: 'connected',
    apiHealth: 'operational',
    lastSync: new Date().toISOString(),
    metrics: {
      totalShipments: 987,
      inTransit: 67,
      delivered: 905,
      exceptions: 15,
      avgDeliveryTime: 3.1,
      onTimeRate: 92.8,
      costPerPackage: 11.75
    },
    services: [
      { name: 'UPS Ground', code: 'UPS_GROUND', avgDays: '3-5', price: 7.99 },
      { name: 'UPS 3 Day Select', code: 'UPS_3DAY', avgDays: '3', price: 15.99 },
      { name: 'UPS 2nd Day Air', code: 'UPS_2DAY', avgDays: '2', price: 22.99 },
      { name: 'UPS Next Day Air', code: 'UPS_NEXTDAY', avgDays: '1', price: 42.99 }
    ]
  },
  dhl: {
    id: 'dhl',
    name: 'DHL Express',
    logo: '✈️',
    color: '#D40511',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    status: 'connected',
    apiHealth: 'degraded',
    lastSync: new Date(Date.now() - 3600000).toISOString(),
    metrics: {
      totalShipments: 456,
      inTransit: 34,
      delivered: 412,
      exceptions: 10,
      avgDeliveryTime: 4.2,
      onTimeRate: 89.5,
      costPerPackage: 28.50
    },
    services: [
      { name: 'DHL Express', code: 'DHL_EXPRESS', avgDays: '2-4', price: 35.99 },
      { name: 'DHL Express Worldwide', code: 'DHL_WORLDWIDE', avgDays: '3-7', price: 45.99 }
    ]
  },
  bluedart: {
    id: 'bluedart',
    name: 'BlueDart',
    logo: '🔵',
    color: '#003399',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    status: 'connected',
    apiHealth: 'operational',
    lastSync: new Date().toISOString(),
    metrics: {
      totalShipments: 2134,
      inTransit: 156,
      delivered: 1945,
      exceptions: 33,
      avgDeliveryTime: 2.5,
      onTimeRate: 96.2,
      costPerPackage: 85.00
    },
    services: [
      { name: 'Domestic Priority', code: 'BD_PRIORITY', avgDays: '1-2', price: 150 },
      { name: 'Surface Line', code: 'BD_SURFACE', avgDays: '5-7', price: 50 },
      { name: 'Apex (Time Definite)', code: 'BD_APEX', avgDays: '1', price: 250 }
    ]
  }
};

// Mock shipment tracking data
const generateMockTrackingEvents = (carrier, trackingNumber) => {
  const now = new Date();
  const events = [
    {
      timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PICKED_UP',
      location: 'Mumbai, MH',
      description: 'Package picked up from sender'
    },
    {
      timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'IN_TRANSIT',
      location: 'Mumbai Hub, MH',
      description: 'Package arrived at sorting facility'
    },
    {
      timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'IN_TRANSIT',
      location: 'Delhi Hub, DL',
      description: 'Package departed facility'
    },
    {
      timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'OUT_FOR_DELIVERY',
      location: 'Bangalore, KA',
      description: 'Out for delivery'
    },
    {
      timestamp: now.toISOString(),
      status: 'DELIVERED',
      location: 'Bangalore, KA',
      description: 'Delivered - Signed by: R. KUMAR'
    }
  ];

  return {
    trackingNumber,
    carrier: carrier.toUpperCase(),
    status: 'DELIVERED',
    estimatedDelivery: now.toISOString(),
    events
  };
};

// Mock recent shipments
const generateMockShipments = (carrierId) => {
  const statuses = ['IN_TRANSIT', 'DELIVERED', 'OUT_FOR_DELIVERY', 'EXCEPTION', 'PICKED_UP'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
  
  return Array.from({ length: 10 }, (_, i) => ({
    id: `${carrierId.toUpperCase()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    trackingNumber: `${carrierId === 'fedex' ? '7489' : carrierId === 'ups' ? '1Z999' : 'BD'}${Math.floor(Math.random() * 10000000000)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    origin: cities[Math.floor(Math.random() * cities.length)],
    destination: cities[Math.floor(Math.random() * cities.length)],
    weight: (Math.random() * 10 + 0.5).toFixed(2),
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
  }));
};

// API simulation functions
const shippingProviderApi = {
  // Get all carriers
  getCarriers: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return Object.values(mockCarriers);
  },

  // Get single carrier details
  getCarrierDetails: async (carrierId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCarriers[carrierId] || null;
  },

  // Get carrier shipments
  getCarrierShipments: async (carrierId) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return generateMockShipments(carrierId);
  },

  // Track shipment
  trackShipment: async (carrierId, trackingNumber) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateMockTrackingEvents(carrierId, trackingNumber);
  },

  // Create shipment (mock)
  createShipment: async (carrierId, shipmentData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const carrier = mockCarriers[carrierId];
    if (!carrier) throw new Error('Carrier not found');

    return {
      success: true,
      trackingNumber: `${carrierId === 'fedex' ? '7489' : carrierId === 'ups' ? '1Z999' : 'BD'}${Math.floor(Math.random() * 10000000000)}`,
      carrier: carrier.name,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      label: 'mock-label-url.pdf',
      cost: carrier.services[0].price
    };
  },

  // Get rate quotes
  getRateQuotes: async (origin, destination, weight) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return Object.values(mockCarriers).flatMap(carrier => 
      carrier.services.map(service => ({
        carrier: carrier.name,
        carrierId: carrier.id,
        service: service.name,
        serviceCode: service.code,
        price: (service.price * (weight / 1)).toFixed(2),
        currency: 'INR',
        estimatedDays: service.avgDays,
        logo: carrier.logo
      }))
    ).sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  },

  // Test carrier connection
  testConnection: async (carrierId) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      latency: Math.floor(Math.random() * 200 + 100),
      message: 'Connection successful'
    };
  },

  // Get carrier analytics
  getCarrierAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const carriers = Object.values(mockCarriers);
    return {
      totalShipments: carriers.reduce((sum, c) => sum + c.metrics.totalShipments, 0),
      totalInTransit: carriers.reduce((sum, c) => sum + c.metrics.inTransit, 0),
      totalDelivered: carriers.reduce((sum, c) => sum + c.metrics.delivered, 0),
      totalExceptions: carriers.reduce((sum, c) => sum + c.metrics.exceptions, 0),
      avgOnTimeRate: (carriers.reduce((sum, c) => sum + c.metrics.onTimeRate, 0) / carriers.length).toFixed(1),
      carrierBreakdown: carriers.map(c => ({
        name: c.name,
        shipments: c.metrics.totalShipments,
        onTimeRate: c.metrics.onTimeRate
      })),
      monthlyTrend: [
        { month: 'Jan', fedex: 180, ups: 150, dhl: 60, bluedart: 280 },
        { month: 'Feb', fedex: 200, ups: 165, dhl: 75, bluedart: 310 },
        { month: 'Mar', fedex: 220, ups: 180, dhl: 80, bluedart: 350 },
        { month: 'Apr', fedex: 195, ups: 170, dhl: 65, bluedart: 320 },
        { month: 'May', fedex: 240, ups: 190, dhl: 90, bluedart: 380 },
        { month: 'Jun', fedex: 210, ups: 175, dhl: 85, bluedart: 340 }
      ]
    };
  }
};

export default shippingProviderApi;