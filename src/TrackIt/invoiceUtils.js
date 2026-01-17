// invoiceUtils.js
export const generateSampleInvoice = (orderId) => ({
  invoiceNumber: `INV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  orderId,
  invoiceDate: new Date().toLocaleDateString(),
  customerName: "John Smith",
  productName: "Electronics Package",
  quantity: 1,
  productPrice: 2499,
  shippingCost: 90,
  tax: 466.02,
  paymentStatus: "Paid",
});
