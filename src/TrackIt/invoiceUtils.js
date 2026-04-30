// invoiceUtils.js
import jsPDF from "jspdf";

export const downloadInvoicePDF = async (invoiceData) => {
  if (!invoiceData) {
    throw new Error("Invoice data is required");
  }

  const safeNumber = (value) => {
    return Number(String(value || 0).replace(/[^\d.]/g, "")) || 0;
  };

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 0;

    /* ================= BRANDED HEADER ================= */
    // Top Background
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 45, "F");

    // Accent Line
    doc.setFillColor(250, 204, 21); // Yellow-400
    doc.rect(0, 43, pageWidth, 2, "F");

    yPos = 25;
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("TRACKIT", 20, yPos);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text(`GSTIN: ${invoiceData.company?.gstin || ""}`, 20, yPos + 8);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(250, 204, 21); // Yellow-400
    doc.text("INVOICE", pageWidth - 20, yPos, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text(
      `#${invoiceData.invoiceNumber || "N/A"}`,
      pageWidth - 20,
      yPos + 8,
      { align: "right" }
    );

    /* ================= ORIGINAL LOGIC CONTINUES ================= */
    yPos = 60;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`Date: ${invoiceData.date || "N/A"}`, 20, yPos);

    yPos += 15;

    /* ================= FROM & BILL TO ================= */
    doc.setFont("helvetica", "bold");
    doc.text("From", 20, yPos);

    doc.setFont("helvetica", "normal");
    doc.text(invoiceData.company?.name || "TrackIt Logistics", 20, yPos + 8);
    doc.text(invoiceData.company?.email || "", 20, yPos + 14);
    doc.text(invoiceData.company?.phone || "", 20, yPos + 20);
    doc.text(invoiceData.company?.city || "", 20, yPos + 26);

    doc.setFont("helvetica", "bold");
    doc.text("Bill To", 120, yPos);

    doc.setFont("helvetica", "normal");
    doc.text(invoiceData.customerName || "Customer", 120, yPos + 8);
    doc.text(invoiceData.customerEmail || "", 120, yPos + 14);
    doc.text(invoiceData.customerPhone || "", 120, yPos + 20);

    yPos += 45;

    /* ================= PAYMENT DETAILS ================= */
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, yPos, pageWidth - 40, 35, 3, 3, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Details", 25, yPos + 10);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Payment ID: ${invoiceData.razorpayPaymentId || "N/A"}`, 25, yPos + 18);
    doc.text(`Method: ${invoiceData.paymentMethod || "RAZORPAY"}`, 25, yPos + 24);
    doc.text(`Order ID: ${invoiceData.orderId || ""}`, 110, yPos + 18);
    doc.text(`Status: ${invoiceData.paymentStatus || "PENDING"}`, 110, yPos + 24);

    yPos += 45;

    /* ================= TABLE HEADER ================= */
    doc.setFillColor(30, 41, 59);
    doc.rect(20, yPos, pageWidth - 40, 10, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text("Description", 25, yPos + 7);
    doc.text("Qty", 110, yPos + 7);
    doc.text("Rate", 130, yPos + 7);
    doc.text("Amount", pageWidth - 25, yPos + 7, { align: "right" });

    yPos += 15;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    /* ================= ITEMS ================= */
    const items = invoiceData.items || [];
    items.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(20, yPos - 4, pageWidth - 40, 10, "F");
      }

      doc.text(item.description || item.name || "", 25, yPos + 2);
      doc.text(String(item.qty || 1), 110, yPos + 2);

      doc.text(
        `Rs. ${safeNumber(item.rate - invoiceData.tax).toFixed(2)}`,
        130,
        yPos + 2
      );

      doc.text(
        `Rs. ${safeNumber(item.amount - invoiceData.tax || item.total).toFixed(2)}`,
        pageWidth - 25,
        yPos + 2,
        { align: "right" }
      );

      yPos += 10;
    });

    /* ================= TOTALS ================= */
    yPos += 10;
    const subtotal = safeNumber(invoiceData.subtotal - invoiceData.tax);
    const tax = safeNumber(invoiceData.tax);
    const total = safeNumber(invoiceData.total);

    doc.setFontSize(9);
    doc.text("Subtotal", 130, yPos);
    doc.text(`Rs. ${subtotal.toFixed(2)}`, pageWidth - 25, yPos, { align: "right" });

    yPos += 8;
    doc.text("GST (18%)", 130, yPos);
    doc.text(`Rs. ${tax.toFixed(2)}`, pageWidth - 25, yPos, { align: "right" });

    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total", 130, yPos);
    doc.text(`Rs. ${total.toFixed(2)}`, pageWidth - 25, yPos, { align: "right" });

    yPos += 20;

    /* ================= DELIVERY ADDRESS ================= */
    if (invoiceData.address && invoiceData.address !== "N/A") {
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(20, yPos, pageWidth - 40, 30, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Delivery Address", 25, yPos + 10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(invoiceData.address, 25, yPos + 20);
      yPos += 40;
    }

    /* ================= FOOTER ================= */
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Thank you for choosing TrackIt!", pageWidth / 2, yPos, { align: "center" });

    doc.save(`Invoice-${invoiceData.invoiceNumber || "download"}.pdf`);
    return { success: true };
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
};