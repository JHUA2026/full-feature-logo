document.addEventListener("DOMContentLoaded", () => {
  const { jsPDF } = window.jspdf;
  let logoBase64 = "";

  document.getElementById("logoFile").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      logoBase64 = reader.result;
      document.getElementById("logoPreview").src = logoBase64;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("generateBtn").addEventListener("click", generatePDF);

  function generatePDF() {
    const productName = productNameVal();
    const canvaLink = canvaLinkVal();
    if (!productName || !canvaLink) {
      alert("Product name and Canva link are required.");
      return;
    }

    const format = paperSizeVal();
    const brandColor = brandColorVal();

    const doc = new jsPDF({ unit: "mm", format });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 20;
    let y = 30;
    let page = 1;

    function header() {
      if (logoBase64) {
        doc.addImage(logoBase64, "PNG", pageWidth - 45, 10, 30, 15);
      }
    }

    function footer() {
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Page ${page}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    }

    function newPage() {
      footer();
      doc.addPage();
      page++;
      y = 30;
      header();
    }

    function section(title, content) {
      if (!content) return;

      doc.setFontSize(14);
      doc.setTextColor(brandColor);
      doc.text(title, margin, y);
      y += 8;

      doc.setFontSize(11);
      doc.setTextColor(60);
      const lines = doc.splitTextToSize(content, pageWidth - margin * 2);

      lines.forEach(line => {
        if (y > pageHeight - 30) newPage();
        doc.text(line, margin, y);
        y += 6;
      });

      y += 6;
    }

    header();

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(productName, margin, y);
    y += 10;

    doc.setTextColor(0, 102, 204);
    doc.textWithLink("Open your Canva template", margin, y, { url: canvaLink });
    y += 15;

    if (toggle1Val()) section("Step 1 – Getting Started", step1Val());
    if (toggle2Val()) section("Step 2 – Editing the Template", step2Val());
    if (toggle3Val()) section("Step 3 – Downloading & Using", step3Val());

    if (toggleThanksVal()) {
      newPage();
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text("Thank You!", margin, y);
      y += 10;

      doc.setFontSize(11);
      doc.setTextColor(70);
      doc.text(
        "Thank you for your purchase.\n\nIf you need help, please contact us via Etsy messages.\n\nDigital product – no physical item shipped.",
        margin,
        y
      );
    }

    footer();
    doc.save("canva-instructions.pdf");
  }

  // helpers
  const productNameVal = () => document.getElementById("productName").value.trim();
  const canvaLinkVal = () => document.getElementById("canvaLink").value.trim();
  const step1Val = () => document.getElementById("step1").value.trim();
  const step2Val = () => document.getElementById("step2").value.trim();
  const step3Val = () => document.getElementById("step3").value.trim();
  const paperSizeVal = () => document.getElementById("paperSize").value;
  const brandColorVal = () => document.getElementById("brandColor").value;
  const toggle1Val = () => document.getElementById("toggle1").checked;
  const toggle2Val = () => document.getElementById("toggle2").checked;
  const toggle3Val = () => document.getElementById("toggle3").checked;
  const toggleThanksVal = () => document.getElementById("toggleThanks").checked;
});
