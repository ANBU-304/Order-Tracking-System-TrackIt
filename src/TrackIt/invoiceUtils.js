// invoiceUtils.js

export const generateSampleInvoice = (orderId) => {
  const subtotal = 85.71;
  const tax = 4.29;
  
  return {
    invoiceNumber: orderId ? orderId.replace("TRK", "INV-") : "INV-999999",
    date: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    customerName: "John Smith",
    address: "123 Main Street, San Francisco, CA 94102",
    orderId: orderId || "TRK123456789",
    items: [
      {
        name: "Standard Shipping Fee",
        description: "Express delivery - Zone A to Zone B",
        qty: 1,
        rate: 75.00,
        amount: 75.00
      },
      {
        name: "Fuel Surcharge",
        description: "Variable logistics surcharge",
        qty: 1,
        rate: 10.71,
        amount: 10.71
      }
    ],
    subtotal: subtotal,
    tax: tax,
    total: subtotal + tax
  };
};