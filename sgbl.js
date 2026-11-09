(() => {
  const catalog = [
    {
      id: "sku-2210",
      name: "Product 1",
      sku: "SKU-2210",
      code: "2210",
      price: 12.5,
      currency: "EGP"
    },
    {
      id: "sku-3087",
      name: "Product 2",
      sku: "SKU-3087",
      code: "3087",
      price: 24,
      currency: "EGP"
    },
    {
      id: "sku-1042",
      name: "Product 3",
      sku: "SKU-1042",
      code: "1042",
      price: 38.75,
      currency: "EGP"
    },
    {
      id: "sku-2301",
      name: "Product 4",
      sku: "SKU-2301",
      code: "2301",
      price: 9.9,
      currency: "EGP"
    }
  ];
  const referenceBarcodeModules = [
    [107, 1],
    [97, 1],
    [94, 1],
    [91, 2],
    [88, 1],
    [85, 1],
    [82, 1],
    [79, 1],
    [76, 2],
    [68, 1],
    [65, 1],
    [61, 1],
    [59, 1],
    [46, 2],
    [43, 1],
    [28, 1],
    [24, 1],
    [17, 1],
    [15, 2],
    [12, 1],
    [2, 1],
    [0, 1]
  ];
  const state = {
    items: [
      { ...catalog[0], quantity: 10, selected: false },
      { ...catalog[1], quantity: 2, selected: false }
    ],
    showStoreName: true,
    showSku: true,
    showName: true,
    showPrice: true,
    size: "standard",
    language: "en",
    hasGenerated: false
  };
  const selectedLabelKeys = new Set();
  const $ = (selector) => document.querySelector(selector);
  const productSelect = $("#productSelect");
  const productSelectButton = $("#productSelectButton");
  const productOptionsList = $("#productOptionsList");
  const labelSizeSelect = $("#labelSize");
  const labelSizeButton = $("#labelSizeButton");
  const labelSizeOptions = $("#labelSizeOptions");
  const quantityInput = $("#quantityInput");
  const rows = $("#productRows");
  const labelGrid = $("#labelGrid");
  const previewCount = $("#previewCount");
  const previewEmptyState = $("#previewEmptyState");
  const previewEmptyTitle = $("#previewEmptyTitle");
  const previewEmptyMessage = $("#previewEmptyMessage");
  const emptyState = $("#emptyState");
  const toast = $("#toast");
  let toastTimer;

  const messages = {
    en: {
      back: "Products",
      title: "Generate barcode labels",
      subtitle: "Choose products and how many labels to print",
      choose: "1. Choose products",
      customize: "Customize labels",
      selectProduct: "Select product",
      selectPlaceholder: "Select a product",
      numberLabels: "Number of labels",
      addProduct: "Add product",
      productName: "PRODUCT NAME",
      numberLabelsUpper: "NUMBER OF LABELS",
      generate: "Generate",
      preview: "2. Label preview",
      labels: "labels",
      previewEmptyTitle: "No labels yet",
      previewEmptyMessage: count => `Press Generate to see a preview of your ${count} labels`,
      previewNoProducts: "Add products above to see them here.",
      print: "Print",
      download: "Download",
      copyright: "2027 Smart Warehouse. All rights reserved.",
      total: "Total labels",
      empty: "Select a product above to get started.",
      remove: "Remove",
      added: "Product added to your label list.",
      duplicate: "Quantity updated for this product.",
      generated: "Label preview updated.",
      downloaded: "Printable label file downloaded.",
      noLabels: "Add at least one product before generating labels.",
      selectToPrint: "Select at least one product to print.",
      invalid: "Enter a quantity from 1 to 500.",
      search: "Search products, SKUs…",
      searchAria: "Search products and SKUs",
      quantityPlaceholder: "e.g. 10",
      notifications: "Notifications",
      actions: "Actions",
      settingsKicker: "LABEL SETTINGS",
      settingsDescription: "Choose which details appear on each printed label.",
      storeName: "Store name",
      skuNumber: "SKU number",
      showName: "Product name",
      showNameHint: "Display the product name beneath the barcode.",
      showPrice: "Price",
      showPriceHint: "Display the current product price.",
      on: "ON",
      off: "OFF",
      labelSize: "Label size",
      smallSize: "Small · 50×30 mm",
      mediumSize: "Medium · 60×40 mm",
      largeSize: "Large · 100×50 mm",
      cancel: "Cancel",
      saveSettings: "Save",
      close: "Close",
      pricePrefix: "Price:",
      overflow: count => `Previewing first 120 labels. ${count} more will be included when printed.`,
      popupBlocked: "Allow pop-ups to open the print layout.",
      signOutUnavailable: "Sign out is not connected in this preview.",
      caughtUp: "You are all caught up.",
      operations: "Operations",
      planning: "Planning",
      dashboard: "Dashboard",
      alerts: "Alerts · 5 notifications",
      alertsShort: "Alerts",
      inventory: "Inventory",
      productsNav: "Products · current page",
      productsLabel: "Products",
      forecast: "AI forecast",
      orders: "Purchase orders · 6 updates",
      ordersShort: "Purchase orders",
      suppliers: "Suppliers",
      reports: "Reports",
      userName: "User Name",
      staffRole: "Warehouse staff",
      signOut: "Sign out"
    },
    ar: {
      back: "المنتجات",
      title: "إنشاء ملصقات الباركود",
      subtitle: "اختر المنتجات وعدد الملصقات المطلوب طباعتها",
      choose: "١. اختر المنتجات",
      customize: "تخصيص الملصقات",
      selectProduct: "اختر المنتج",
      selectPlaceholder: "اختر منتجًا",
      numberLabels: "عدد الملصقات",
      addProduct: "إضافة منتج",
      productName: "اسم المنتج",
      numberLabelsUpper: "عدد الملصقات",
      generate: "إنشاء",
      preview: "٢. معاينة الملصقات",
      labels: "ملصق",
      previewEmptyTitle: "لا توجد ملصقات بعد",
      previewEmptyMessage: count => `اضغط على إنشاء لمعاينة ${count} ملصقًا`,
      previewNoProducts: "أضف منتجات من الأعلى لعرضها هنا.",
      print: "طباعة",
      download: "تنزيل",
      copyright: "٢٠٢٧ سمارت ويرهاوس. جميع الحقوق محفوظة.",
      total: "إجمالي الملصقات",
      empty: "اختر منتجًا من الأعلى للبدء.",
      remove: "حذف",
      added: "تمت إضافة المنتج إلى قائمة الملصقات.",
      duplicate: "تم تحديث كمية هذا المنتج.",
      generated: "تم تحديث معاينة الملصقات.",
      downloaded: "تم تنزيل ملف الملصقات القابل للطباعة.",
      noLabels: "أضف منتجًا واحدًا على الأقل لإنشاء الملصقات.",
      selectToPrint: "حدد ملصقًا واحدًا على الأقل للطباعة.",
      invalid: "أدخل كمية بين ١ و٥٠٠.",
      search: "ابحث عن المنتجات أو الأكواد…",
      searchAria: "البحث عن المنتجات والأكواد",
      quantityPlaceholder: "مثال: ١٠",
      notifications: "الإشعارات",
      actions: "الإجراءات",
      settingsKicker: "إعدادات الملصق",
      settingsDescription: "اختر التفاصيل التي تظهر على كل ملصق مطبوع.",
      storeName: "اسم المتجر",
      skuNumber: "رقم SKU",
      showName: "إظهار اسم المنتج",
      showNameHint: "عرض اسم المنتج أسفل الباركود.",
      showPrice: "إظهار السعر",
      showPriceHint: "عرض السعر الحالي للمنتج.",
      labelSize: "حجم الملصق",
      smallSize: "صغير · ٥٠×٣٠ مم",
      mediumSize: "متوسط · ٦٠×٤٠ مم",
      largeSize: "كبير · ١٠٠×٥٠ مم",
      cancel: "إلغاء",
      saveSettings: "حفظ",
      close: "إغلاق",
      pricePrefix: "السعر:",
      overflow: count => `تتم معاينة أول ١٢٠ ملصقًا. ستتم إضافة ${count} ملصقًا آخر عند الطباعة.`,
      popupBlocked: "اسمح بالنوافذ المنبثقة لفتح معاينة الطباعة.",
      signOutUnavailable: "تسجيل الخروج غير متاح في هذه المعاينة.",
      caughtUp: "لا توجد إشعارات جديدة.",
      operations: "العمليات",
      planning: "التخطيط",
      dashboard: "لوحة التحكم",
      alerts: "التنبيهات · ٥ إشعارات",
      alertsShort: "التنبيهات",
      inventory: "المخزون",
      productsNav: "المنتجات · الصفحة الحالية",
      productsLabel: "المنتجات",
      forecast: "توقعات الذكاء الاصطناعي",
      orders: "أوامر الشراء · ٦ تحديثات",
      ordersShort: "أوامر الشراء",
      suppliers: "الموردون",
      reports: "التقارير",
      userName: "اسم المستخدم",
      staffRole: "موظف المخزن",
      signOut: "تسجيل الخروج"
    }
  };;

  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  function localizeDigits(value) {
    const text = String(value);
    return state.language === "ar" ? text.replace(/\d/g, digit => arabicDigits[Number(digit)]) : text;
  }

  function localizeProductName(name) {
    const match = String(name).match(/^Product\s+(\d+)$/i);
    if (state.language === "ar" && match) return `منتج ${localizeDigits(match[1])}`;
    return localizeDigits(name);
  }

  function westernizeDigits(value) {
    return String(value).replace(/[٠-٩]/g, digit => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
      .replace(/[۰-۹]/g, digit => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function productOptions(filter = "") {
    const term = westernizeDigits(filter.trim().toLowerCase());
    const matching = catalog.filter(product => `${product.name} ${product.sku}`.toLowerCase().includes(term));
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.textContent = messages[state.language].selectPlaceholder;
    placeholder.selected = true;
    productSelect.replaceChildren(placeholder);
    productOptionsList.replaceChildren();
    matching.forEach(product => {
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = `${localizeProductName(product.name)} · ${localizeDigits(product.sku)}`;
      productSelect.append(option);

      const menuOption = document.createElement("button");
      menuOption.type = "button";
      menuOption.className = "product-option";
      menuOption.setAttribute("role", "option");
      menuOption.dataset.value = product.id;
      menuOption.textContent = option.textContent;
      productOptionsList.append(menuOption);
    });
    productSelectButton.textContent = messages[state.language].selectPlaceholder;
    productSelectButton.classList.remove("has-value");
    productSelectButton.dataset.i18n = "selectPlaceholder";
  }

  function closeProductOptions() {
    productOptionsList.hidden = true;
    productSelectButton.setAttribute("aria-expanded", "false");
    productSelectButton.closest(".product-select-wrap").classList.remove("is-open");
  }

  function renderLabelSizeOptions() {
    const sizes = [
      ["small", "smallSize"],
      ["medium", "mediumSize"],
      ["large", "largeSize"]
    ];
    labelSizeOptions.replaceChildren();
    sizes.forEach(([value, key]) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "label-size-option";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(value === labelSizeSelect.value));
      option.dataset.value = value;
      option.dataset.labelKey = key;
      option.textContent = messages[state.language][key];
      option.classList.toggle("selected", value === labelSizeSelect.value);
      labelSizeOptions.append(option);
    });
    labelSizeButton.textContent = messages[state.language][sizes.find(([value]) => value === labelSizeSelect.value)?.[1] || "smallSize"];
  }

  function closeLabelSizeOptions() {
    labelSizeOptions.hidden = true;
    labelSizeButton.setAttribute("aria-expanded", "false");
    labelSizeButton.closest(".label-size-wrap").classList.remove("is-open");
  }

  function totalQuantity() {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }

  function labelKey(item, index) {
    return `${item.id}:${index}`;
  }

  function isLabelSelected(item, index) {
    return selectedLabelKeys.has(labelKey(item, index));
  }

  function selectedLabels() {
    return state.items.flatMap(item => Array.from({ length: item.quantity }, (_, index) => ({ item, index })))
      .filter(({ item, index }) => isLabelSelected(item, index));
  }

  function selectedQuantity() {
    return selectedLabels().length;
  }

  function renderRows() {
    const lang = messages[state.language];
    rows.replaceChildren();
    state.items.forEach((item, index) => {
      const row = document.createElement("tr");
      const numberCell = document.createElement("td");
      numberCell.textContent = localizeDigits(index + 1);
      const productCell = document.createElement("td");
      const quantityCell = document.createElement("td");
      const quantity = document.createElement("span");
      quantity.className = "quantity-value";
      quantity.textContent = localizeDigits(item.quantity);
      quantityCell.append(quantity);
      const actionCell = document.createElement("td");
      const removeButton = document.createElement("button");
      removeButton.className = "remove-button";
      removeButton.type = "button";
      removeButton.dataset.remove = item.id;
      removeButton.textContent = lang.remove;
      actionCell.append(removeButton);
      const selectForPrint = document.createElement("button");
      selectForPrint.type = "button";
      selectForPrint.className = "print-selection-toggle";
      selectForPrint.dataset.select = item.id;
      selectForPrint.setAttribute("aria-pressed", String(item.selected === true));
      selectForPrint.setAttribute(
        "aria-label",
        `${item.selected === true ? lang.remove : lang.addProduct} ${localizeProductName(item.name)} ${localizeDigits(item.sku)} ${lang.print}`
      );
      selectForPrint.textContent = `${localizeProductName(item.name)} · ${localizeDigits(item.sku)}`;
      productCell.append(selectForPrint);
      row.append(numberCell, productCell, quantityCell, actionCell);
      rows.append(row);
    });
    const footerRow = document.createElement("tr");
    const footerCells = Array.from({ length: 4 }, () => document.createElement("td"));
    footerRow.append(...footerCells);
    const totalLabel = document.createElement("span");
    totalLabel.className = "total-label";
    totalLabel.textContent = lang.total;
    footerCells[1].append(totalLabel);
    const totalCount = document.createElement("span");
    totalCount.className = "total-count";
    totalCount.textContent = localizeDigits(totalQuantity());
    footerCells[2].append(totalCount);
    $("#tableFoot").replaceChildren(footerRow);
    emptyState.hidden = state.items.length > 0;
    previewCount.textContent = localizeDigits(totalQuantity());
    $("#previewHeading").setAttribute("aria-label", `${lang.preview}, ${localizeDigits(totalQuantity())} ${lang.labels}`);
  }

  function barcodeElement(code) {
    const barcode = document.createElement("div");
    barcode.className = "barcode";
    barcode.setAttribute("role", "img");
    barcode.setAttribute("aria-label", `${state.language === "ar" ? "باركود" : "Barcode"} ${localizeDigits(code)}`);
    barcode.style.display = "flex";
    barcode.style.justifyContent = "center";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 108 34");
    svg.setAttribute("width", "108");
    svg.setAttribute("height", "34");
    svg.setAttribute("aria-hidden", "true");
    svg.style.position = "relative";
    svg.style.top = state.size === "small" ? "2px" : "1px";
    referenceBarcodeModules.forEach(([x, width]) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("width", String(width));
      rect.setAttribute("height", "34");
      rect.setAttribute("fill", "black");
      svg.append(rect);
    });
    barcode.append(svg);
    return barcode;
  }

  function renderLabels() {
    const lang = messages[state.language];
    const labelCount = totalQuantity();
    const previewVisible = state.hasGenerated && labelCount > 0;
    previewCount.textContent = localizeDigits(labelCount);
    $("#previewHeading").setAttribute("aria-label", `${lang.preview}, ${localizeDigits(labelCount)} ${lang.labels}`);
    previewEmptyTitle.textContent = lang.previewEmptyTitle;
    previewEmptyMessage.textContent = labelCount
      ? lang.previewEmptyMessage(localizeDigits(labelCount))
      : lang.previewNoProducts;
    previewEmptyState.hidden = previewVisible;
    labelGrid.hidden = !previewVisible;
    $("#previewReserve").hidden = previewVisible;
    $("#printButton").disabled = !previewVisible;
    $("#downloadButton").disabled = !previewVisible;

    if (!previewVisible) {
      labelGrid.replaceChildren();
      return;
    }

    const fragments = document.createDocumentFragment();
    const maxRender = 120;
    let remaining = maxRender;
    state.items.forEach(item => {
      const amount = Math.min(item.quantity, remaining);
      for (let i = 0; i < amount; i++) {
        const card = document.createElement("article");
        card.className = `label-card size-${state.size}`;
        const selected = isLabelSelected(item, i);
        card.dataset.labelKey = labelKey(item, i);
        card.setAttribute("role", "checkbox");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-checked", String(selected));
          card.setAttribute("aria-label", `${selected ? (state.language === "ar" ? "ملصق محدد" : "Selected label") : (state.language === "ar" ? "ملصق غير محدد" : "Not selected label")} ${localizeProductName(item.name)}, ${state.language === "ar" ? "باركود" : "barcode"} ${localizeDigits(item.code)}`);
        const brand = document.createElement("span");
        brand.className = "label-brand";
        brand.textContent = "Smart Warehouse";
        card.append(brand, barcodeElement(item.code));
        const number = document.createElement("span");
        number.className = "barcode-number";
        number.textContent = localizeDigits(item.code);
        card.append(number);
        if (state.showName) {
          const name = document.createElement("strong");
          name.className = "label-name";
          name.textContent = localizeProductName("Product 1");
          card.append(name);
        }
        if (state.showPrice) {
          const price = document.createElement("span");
          price.className = "label-price";
          price.textContent = `${lang.pricePrefix} ${localizeDigits("12.50")} EGP`;
          card.append(price);
        }
        fragments.append(card);
      }
      remaining -= amount;
    });
    labelGrid.replaceChildren(fragments);
    const overflow = Math.max(0, totalQuantity() - maxRender);
    if (overflow) {
      const note = document.createElement("p");
      note.className = "preview-overflow";
      note.textContent = lang.overflow(localizeDigits(overflow));
      labelGrid.append(note);
    }
  }

  function setLanguage(language) {
    state.language = language;
    const isArabic = language === "ar";
    quantityInput.value = localizeDigits(westernizeDigits(quantityInput.value));
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.title = isArabic ? "إنشاء ملصقات الباركود · المستودع الذكي" : "Generate barcode labels · Smart Warehouse";
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      if (messages[language][key]) element.textContent = messages[language][key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      element.placeholder = messages[language][element.dataset.i18nPlaceholder];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(element => {
      element.setAttribute("aria-label", messages[language][element.dataset.i18nAria]);
    });
    document.querySelectorAll("[data-nav-key]").forEach(link => {
      const key = link.dataset.navKey;
      const shortLabel = key === "productsNav" ? messages[language].productsLabel : messages[language][`${key}Short`];
      const label = shortLabel || messages[language][key];
      link.dataset.label = label;
      link.setAttribute("aria-label", messages[language][key]);
    });
    document.querySelectorAll(".language-switch button").forEach(button => button.classList.toggle("selected", button.dataset.lang === language));
    productOptions();
    renderLabelSizeOptions();
    renderRows();
    renderLabels();
  }

  function printableDocument() {
    const cards = selectedLabels().map(({ item }) => {
      const stripeMarkup = referenceBarcodeModules.map(([x, width]) => {
        return `<rect x="${x}" y="0" width="${width}" height="34" fill="black"/>`;
      }).join("");
      return `<article class="label"><div class="brand">Smart Warehouse</div><svg class="barcode-image" viewBox="0 0 108 34" aria-label="${escapeHtml(state.language === "ar" ? "باركود" : "Barcode")} ${escapeHtml(localizeDigits(item.code))}">${stripeMarkup}</svg><div class="code">${escapeHtml(localizeDigits(item.code))}</div>${state.showName ? `<strong>${escapeHtml(localizeProductName("Product 1"))}</strong>` : ""}${state.showPrice ? `<div class="price">${escapeHtml(messages[state.language].pricePrefix)} ${escapeHtml(localizeDigits("12.50"))} EGP</div>` : ""}</article>`;
    }).join("");
    const labelDimensions = { small: ["50mm", "30mm"], medium: ["60mm", "40mm"], large: ["100mm", "50mm"] }[state.size] || ["50mm", "30mm"];
    return `<!doctype html><html lang="${state.language}" dir="${state.language === "ar" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${state.language === "ar" ? "ملصقات الباركود" : "Barcode labels"}</title><style>@page{size:A4;margin:10mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0}.grid{display:flex;flex-wrap:wrap;align-content:flex-start;gap:6mm}.label{width:${labelDimensions[0]};height:${labelDimensions[1]};border:1px dashed #c5d4ec;border-radius:3mm;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:2mm;overflow:hidden;break-inside:avoid}.brand{font-size:9pt;color:#25375e}.barcode-image{width:108px;height:34px;margin:1mm auto .5mm}
    .code{font-size:8pt}.label strong{font-size:10pt}.price{font-size:8pt;color:#394d7b}</style></head><body><main class="grid">${cards}</main></body></html>`;
  }

  $("#productForm").addEventListener("submit", event => {
    event.preventDefault();
    const product = catalog.find(entry => entry.id === productSelect.value);
    const quantity = Number(westernizeDigits(quantityInput.value));
    $("#formMessage").textContent = "";
    if (!product) {
      $("#formMessage").textContent = messages[state.language].selectPlaceholder;
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 500) {
      $("#formMessage").textContent = messages[state.language].invalid;
      return;
    }
    const existing = state.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity = Math.min(500, existing.quantity + quantity);
      existing.selected = true;
      for (let index = 0; index < existing.quantity; index++) selectedLabelKeys.add(labelKey(existing, index));
      showToast(messages[state.language].duplicate);
    } else {
      state.items.push({ ...product, quantity, selected: false });
      showToast(messages[state.language].added);
    }
    renderRows();
    renderLabels();
    productSelect.value = "";
    productSelectButton.textContent = messages[state.language].selectPlaceholder;
    productSelectButton.classList.remove("has-value");
    productSelectButton.dataset.i18n = "selectPlaceholder";
    closeProductOptions();
  });

  rows.addEventListener("click", event => {
    const button = event.target.closest("[data-remove]");
    if (button) {
      const removedId = button.dataset.remove;
      state.items = state.items.filter(item => item.id !== removedId);
      for (const key of selectedLabelKeys) {
        if (key.startsWith(`${removedId}:`)) selectedLabelKeys.delete(key);
      }
      renderRows();
      renderLabels();
      return;
    }
    const selection = event.target.closest(".print-selection-toggle");
    if (!selection) return;
    const item = state.items.find(entry => entry.id === selection.dataset.select);
    if (!item) return;
    item.selected = item.selected !== true;
    for (let index = 0; index < item.quantity; index++) {
      const key = labelKey(item, index);
      if (item.selected) selectedLabelKeys.add(key);
      else selectedLabelKeys.delete(key);
    }
    renderRows();
    renderLabels();
  });

  function toggleLabelSelection(card) {
    const [productId, indexText] = card.dataset.labelKey.split(":");
    const item = state.items.find(entry => entry.id === productId);
    if (!item) return;
    const index = Number(indexText);
    const key = labelKey(item, index);
    if (isLabelSelected(item, index)) selectedLabelKeys.delete(key);
    else selectedLabelKeys.add(key);
    item.selected = Array.from({ length: item.quantity }, (_, labelIndex) => selectedLabelKeys.has(labelKey(item, labelIndex))).some(Boolean);
    renderRows();
    renderLabels();
  }

  labelGrid.addEventListener("click", event => {
    const card = event.target.closest(".label-card[data-label-key]");
    if (card) toggleLabelSelection(card);
  });

  labelGrid.addEventListener("keydown", event => {
    const card = event.target.closest(".label-card[data-label-key]");
    if (!card || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    toggleLabelSelection(card);
  });

  $("#generateButton").addEventListener("click", () => {
    if (!totalQuantity()) {
      showToast(messages[state.language].noLabels);
      return;
    }
    state.hasGenerated = true;
    renderLabels();
    showToast(messages[state.language].generated);
    $("#previewHeading").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  $("#printButton").addEventListener("click", () => {
    if (!selectedQuantity()) return showToast(messages[state.language].selectToPrint);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return showToast(messages[state.language].popupBlocked);
    printWindow.opener = null;
    printWindow.document.open();
    printWindow.document.write(printableDocument());
    printWindow.document.close();
    setTimeout(() => { try { printWindow.print(); } catch (_) { /* Browser may block printing until interaction. */ } }, 300);
  });

  $("#downloadButton").addEventListener("click", () => {
    if (!selectedQuantity()) return showToast(messages[state.language].selectToPrint);
    const blob = new Blob([printableDocument()], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "smart-warehouse-barcode-labels.html";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(messages[state.language].downloaded);
  });

  productSelectButton.addEventListener("click", () => {
    const opening = productOptionsList.hidden;
    productOptionsList.hidden = !opening;
    productSelectButton.setAttribute("aria-expanded", String(opening));
    productSelectButton.closest(".product-select-wrap").classList.toggle("is-open", opening);
    if (opening) {
      const options = [...productOptionsList.querySelectorAll(".product-option")];
      const selectedIndex = options.findIndex(option => option.classList.contains("selected"));
      options.forEach((option, index) => option.classList.toggle("active", index === (selectedIndex >= 0 ? selectedIndex : 0)));
    }
  });
  productOptionsList.addEventListener("click", event => {
    const option = event.target.closest(".product-option");
    if (!option) return;
    productSelect.value = option.dataset.value;
    productSelectButton.textContent = option.textContent;
    productSelectButton.dataset.i18n = "";
    productSelectButton.classList.add("has-value");
    productOptionsList.querySelectorAll(".product-option").forEach(item => {
      const selected = item === option;
      item.classList.toggle("selected", selected);
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    closeProductOptions();
  });
  productSelectButton.addEventListener("keydown", event => {
    const options = [...productOptionsList.querySelectorAll(".product-option")];
    if (!options.length || !["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Escape") return closeProductOptions();
    if (productOptionsList.hidden) {
      productOptionsList.hidden = false;
      productSelectButton.setAttribute("aria-expanded", "true");
      productSelectButton.closest(".product-select-wrap").classList.add("is-open");
    }
    const activeIndex = options.findIndex(option => option.classList.contains("active"));
    const nextIndex = event.key === "ArrowUp"
      ? (Math.max(activeIndex, 0) - 1 + options.length) % options.length
      : event.key === "ArrowDown" ? (activeIndex + 1) % options.length : Math.max(activeIndex, 0);
    options.forEach((option, index) => option.classList.toggle("active", index === nextIndex));
    if (event.key === "Enter") options[nextIndex].click();
  });
  document.addEventListener("pointerdown", event => {
    if (!event.target.closest(".product-select-wrap")) closeProductOptions();
  });

  labelSizeButton.addEventListener("click", () => {
    const opening = labelSizeOptions.hidden;
    labelSizeOptions.hidden = !opening;
    labelSizeButton.setAttribute("aria-expanded", String(opening));
    labelSizeButton.closest(".label-size-wrap").classList.toggle("is-open", opening);
    if (opening) {
      const options = [...labelSizeOptions.querySelectorAll(".label-size-option")];
      options.forEach(option => option.classList.toggle("active", option.dataset.value === labelSizeSelect.value));
    }
  });
  labelSizeOptions.addEventListener("click", event => {
    const option = event.target.closest(".label-size-option");
    if (!option) return;
    labelSizeSelect.value = option.dataset.value;
    renderLabelSizeOptions();
    closeLabelSizeOptions();
  });
  labelSizeButton.addEventListener("keydown", event => {
    const options = [...labelSizeOptions.querySelectorAll(".label-size-option")];
    if (!options.length || !["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Escape") return closeLabelSizeOptions();
    if (labelSizeOptions.hidden) {
      labelSizeOptions.hidden = false;
      labelSizeButton.setAttribute("aria-expanded", "true");
      labelSizeButton.closest(".label-size-wrap").classList.add("is-open");
    }
    const activeIndex = options.findIndex(option => option.classList.contains("active"));
    const nextIndex = event.key === "ArrowUp"
      ? (Math.max(activeIndex, 0) - 1 + options.length) % options.length
      : event.key === "ArrowDown" ? (activeIndex + 1) % options.length : Math.max(activeIndex, 0);
    options.forEach((option, index) => option.classList.toggle("active", index === nextIndex));
    if (event.key === "Enter") options[nextIndex].click();
  });
  document.addEventListener("pointerdown", event => {
    if (!event.target.closest(".label-size-wrap")) closeLabelSizeOptions();
  });

  const dialog = $("#customizeDialog");
  dialog.addEventListener("close", () => {
    labelSizeSelect.value = state.size;
    renderLabelSizeOptions();
    closeLabelSizeOptions();
  });
  $("#customizeButton").addEventListener("click", () => dialog.showModal());
  $("#customizeForm").addEventListener("submit", event => {
    if (event.submitter?.value !== "save") return;
    state.showName = $("#showName").checked;
    state.showPrice = $("#showPrice").checked;
    state.size = $("#labelSize").value;
    renderLabels();
  });
  document.querySelectorAll(".language-switch button").forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
  $("#globalSearch").addEventListener("input", event => productOptions(event.target.value));
  document.querySelectorAll(".nav-hit").forEach(link => link.addEventListener("click", event => event.preventDefault()));
  $(".logout").addEventListener("click", () => showToast(messages[state.language].signOutUnavailable));
  $(".notification").addEventListener("click", () => showToast(messages[state.language].caughtUp));

  productOptions();
  renderLabelSizeOptions();
  renderRows();
  renderLabels();
})();

