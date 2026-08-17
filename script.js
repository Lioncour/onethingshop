const PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">' +
    '<rect width="400" height="400" fill="#E0DAD1"/>' +
    '<text x="200" y="220" text-anchor="middle" font-size="120" fill="#8A8378" font-family="monospace">?</text>' +
    '</svg>'
);

const items = [
    {
        id: 1,
        number: 18,
        name: "Hip flask",
        originalPrice: 89,
        price: 44.5,
        discount: 50,
        description: "Pocket lark / Hip flask in excellent condition. Made this for my brother, but he dont drink. So now its up for sale A nice video of how i made it here: https://youtu.be/geAr7Pv-jG8?si=FUJxhsvOVat-fGbg Original leather case included. Holds just enough liquor.",
        image: "images/items/item1/main.jpg",
        sold: false,
        additionalImages: [
            "images/items/item1/main.jpg",
            "images/items/item1/detail1.jpg",
            "images/items/item1/detail2.jpg",
            "images/items/item1/detail3.jpg"
        ]
    },
    {
        id: 2,
        number: 19,
        name: "???",
        price: "???",
        description: "This item will be revealed when the first item is sold",
        image: "images/items/item2/main.jpg",
        sold: false,
        hidden: true,
        additionalImages: []
    },
    {
        id: 3,
        number: 20,
        name: "Good luck on trip charm",
        price: 37,
        description: "I made this when i went on my first winter 'survival tour' It brings good luck and especially help you not forget stuff, no use to me anymore. Front side is covered in epoxy, has a lanyard and is really cool.",
        image: "images/items/item3/main.jpg",
        sold: false,
        additionalImages: [
            "images/items/item3/main.jpg",
            "images/items/item3/detail1.jpg",
            "images/items/item3/detail2.jpg"
        ]
    },
    {
        id: 4,
        number: 21,
        name: "Sheath",
        price: 41,
        description: "I made this sheath for my scissor or shears, but i dont use it anymore.Made in heavy cotton, a 3d printed loop with waxed thread. The front and back is in lazer cut wood panels.",
        image: "images/items/item4/main.jpg",
        sold: false,
        additionalImages: [
            "images/items/item4/main.jpg",
            "images/items/item4/detail1.jpg",
            "images/items/item4/detail2.jpg",
            "images/items/item4/detail3.jpg",
            "images/items/item4/detail4.jpg"
        ]
    },
    {
        id: 5,
        number: 22,
        name: "My initials in brass",
        price: 129,
        description: "Handmade by me after i watched an awesome youtube video from Jimmy Diresta. a lot of solder, sweat, love and brass went into this item. Could use a good polish. Great for a person that has the initials J.A.E",
        image: "images/items/item5/main.jpg",
        sold: false,
        additionalImages: [
            "images/items/item5/main.jpg",
            "images/items/item5/detail1.jpg",
            "images/items/item5/detail2.jpg"
        ]
    },
    {
        id: 6,
        number: 23,
        name: "Box",
        price: 99,
        description: "A very nice box, that opens on the short side with piano hinges.Holes for mounting on the inside Was used to store various gameboys and games. Made by violet valchromat, plywood and some brass. A bit heavy, but very sturdy. A few blemishes and have a small wooden piece on the bottom side to ensure that the main door do not sag.",
        image: "images/items/item6/main.jpg",
        sold: false,
        additionalImages: [
            "images/items/item6/main.jpg",
            "images/items/item6/detail1.jpg",
            "images/items/item6/detail2.jpg"
        ]
    },
    {
        id: 7,
        number: 24,
        name: "???",
        price: "???",
        description: "This item will be revealed when previous items are sold",
        image: "images/items/item7/main.jpg",
        sold: false,
        hidden: true,
        additionalImages: []
    },
    {
        id: 8,
        number: 25,
        name: "???",
        price: "???",
        description: "This item will be revealed when previous items are sold",
        image: "images/items/item8/main.jpg",
        sold: false,
        hidden: true,
        additionalImages: []
    },
    {
        id: 9,
        number: 26,
        name: "???",
        price: "???",
        description: "This item will be revealed when previous items are sold",
        image: "images/items/item9/main.jpg",
        sold: false,
        hidden: true,
        additionalImages: []
    }
];

const imageCache = new Map();
const paintedCanvases = new Set();

function getCurrentItem() {
    return items.find((item) => !item.sold) || items[items.length - 1];
}

function isItemLocked(item) {
    const current = getCurrentItem();
    return !item.sold && item.id !== current.id;
}

function isPlaceholderSrc(src) {
    return !src || src === PLACEHOLDER || src.startsWith("data:");
}

function loadImage(src) {
    if (imageCache.has(src)) {
        return imageCache.get(src);
    }
    const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
    imageCache.set(src, promise);
    return promise;
}

function paintCover(canvas, img, blurred) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) {
        return;
    }
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pad = blurred ? 48 : 0;
    const scale = Math.max(
        (rect.width + pad * 2) / img.naturalWidth,
        (rect.height + pad * 2) / img.naturalHeight
    );
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;

    if (blurred) {
        ctx.filter = "blur(24px)";
    }
    ctx.drawImage(img, (rect.width - dw) / 2, (rect.height - dh) / 2, dw, dh);
    ctx.filter = "none";

    if (blurred) {
        ctx.fillStyle = "rgba(224, 218, 209, 0.28)";
        ctx.fillRect(0, 0, rect.width, rect.height);
    }
}

function mountProtectedImage(container, src, blurred) {
    container.style.backgroundImage = "";
    container.replaceChildren();

    if (isPlaceholderSrc(src)) {
        container.style.backgroundImage = "url('" + PLACEHOLDER + "')";
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    loadImage(src).then((img) => {
        const paint = () => paintCover(canvas, img, blurred);
        paint();
        if (paintedCanvases.has(canvas)) {
            return;
        }
        paintedCanvases.add(canvas);
        const observer = new ResizeObserver(paint);
        observer.observe(container);
    }).catch(() => {
        container.style.backgroundImage = "url('" + PLACEHOLDER + "')";
    });
}

function formatMoney(value) {
    if (typeof value !== "number") {
        return "???";
    }
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
}

function saleStickerHTML() {
    return '<div class="sale-sticker" aria-label="50 percent off">' +
        '<span class="sale-sticker__off">−50%</span>' +
        '<span class="sale-sticker__label">Sale</span>' +
        "</div>";
}

function priceHTML(item, locked) {
    if (locked) {
        return '<p class="price">$???</p>';
    }
    if (item.originalPrice && item.originalPrice > item.price) {
        return '<p class="price">' +
            '<span class="price-was">$' + formatMoney(item.originalPrice) + "</span>" +
            '<span class="price-now">$' + formatMoney(item.price) + "</span>" +
            "</p>";
    }
    return '<p class="price">$' + formatMoney(item.price) + "</p>";
}

function itemStatus(item) {
    if (item.sold) {
        return { label: "Sold", tagClass: "fp-tag--done" };
    }
    if (isItemLocked(item)) {
        return { label: "Locked", tagClass: "fp-tag--idea" };
    }
    return { label: "For sale", tagClass: "fp-tag--live" };
}

function renderItems() {
    const container = document.querySelector(".grid-container");
    if (!container) {
        return;
    }

    container.innerHTML = "";

    items.forEach((item) => {
        const locked = isItemLocked(item);
        const status = itemStatus(item);
        const itemElement = document.createElement("article");
        itemElement.className = "item" + (item.sold ? " sold" : "") + (locked ? " locked" : "") + (item.discount ? " item--sale" : "");

        const displayName = locked ? "???" : item.name;

        itemElement.innerHTML =
            '<div class="img-shield">' +
                '<div class="img-cover"></div>' +
                (item.discount && !locked && !item.sold ? saleStickerHTML() : "") +
            "</div>" +
            '<div class="item-info">' +
                '<div class="item-meta">' +
                    '<span class="fp-tag ' + status.tagClass + '">' + status.label + "</span>" +
                "</div>" +
                "<h2>" + displayName + "</h2>" +
                priceHTML(item, locked) +
            "</div>";

        const cover = itemElement.querySelector(".img-cover");
        const preview = isPlaceholderSrc(item.image) ? PLACEHOLDER : item.image;
        mountProtectedImage(cover, preview, locked);

        if (!locked) {
            itemElement.addEventListener("click", () => openModal(item));
        }

        container.appendChild(itemElement);
    });
}

function openModal(item) {
    if (isItemLocked(item)) {
        return;
    }

    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalSpec = document.getElementById("modal-spec");
    const modalMainImage = document.getElementById("modal-main-image");
    const modalThumbnails = document.querySelector(".modal-thumbnails");
    const buyButton = document.getElementById("modal-buy-button");
    const paypalContainer = document.getElementById("modal-paypal-container");
    const paypalError = document.getElementById("paypal-error");
    const current = getCurrentItem();

    modalTitle.textContent = item.name;

    const description = item.description.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    modalDescription.innerHTML = description;

    const shipping = 15;
    const total = typeof item.price === "number" ? item.price + shipping : null;
    const priceCell = item.originalPrice
        ? '<span class="price-was">$' + formatMoney(item.originalPrice) + '</span> $' + formatMoney(item.price)
        : "$" + formatMoney(item.price);
    modalSpec.innerHTML =
        '<div class="fp-spec__row"><span>Price</span><span>' + priceCell + "</span></div>" +
        (item.discount ? '<div class="fp-spec__row"><span>Discount</span><span>−' + item.discount + "%</span></div>" : "") +
        '<div class="fp-spec__row"><span>Shipping</span><span>$' + shipping + " USD</span></div>" +
        '<div class="fp-spec__row"><span>Total</span><span>$' + (total === null ? "???" : formatMoney(total)) + "</span></div>";

    const modalSticker = document.getElementById("modal-sticker");
    if (item.discount && !item.sold) {
        modalSticker.classList.remove("hidden");
    } else {
        modalSticker.classList.add("hidden");
    }

    paypalError.classList.add("hidden");
    paypalError.textContent = "";
    mountProtectedImage(modalMainImage, item.image);

    modalThumbnails.innerHTML = "";
    if (item.additionalImages && item.additionalImages.length > 0) {
        item.additionalImages.forEach((imgSrc) => {
            const thumb = document.createElement("div");
            thumb.className = "modal-thumbnail";
            mountProtectedImage(thumb, imgSrc);
            thumb.onclick = () => mountProtectedImage(modalMainImage, imgSrc);
            modalThumbnails.appendChild(thumb);
        });
    }

    paypalContainer.classList.add("hidden");
    paypalContainer.innerHTML = "";

    if (item.sold || item.id !== current.id || typeof item.price !== "number") {
        buyButton.style.display = "none";
    } else {
        buyButton.style.display = "block";
        buyButton.onclick = function () {
            if (!window.paypal || typeof paypal.Buttons !== "function") {
                paypalError.textContent = "PayPal did not load. Check the network tab and refresh.";
                paypalError.classList.remove("hidden");
                return;
            }

            buyButton.style.display = "none";
            paypalContainer.classList.remove("hidden");
            paypalContainer.innerHTML = "";
            paypalError.classList.add("hidden");

            try {
                paypal.Buttons({
                    style: {
                        layout: "vertical",
                        color: "black",
                        shape: "rect",
                        label: "paypal"
                    },
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                description: item.discount ? item.name + " (−" + item.discount + "%)" : item.name,
                                amount: {
                                    currency_code: "USD",
                                    value: (item.price + 15).toFixed(2)
                                }
                            }]
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((details) => {
                            item.sold = true;
                            renderItems();
                            modal.style.display = "none";
                            alert("Transaction completed by " + details.payer.name.given_name);
                        });
                    },
                    onError: (error) => {
                        paypalError.textContent = "PayPal could not start the payment. " + (error && error.message ? error.message : "Try again, or check the PayPal app settings.");
                        paypalError.classList.remove("hidden");
                        buyButton.style.display = "block";
                    },
                    onCancel: () => {
                        buyButton.style.display = "block";
                    }
                }).render("#modal-paypal-container").catch((error) => {
                    paypalError.textContent = "PayPal buttons failed to render. " + (error && error.message ? error.message : "");
                    paypalError.classList.remove("hidden");
                    buyButton.style.display = "block";
                    paypalContainer.classList.add("hidden");
                });
            } catch (error) {
                paypalError.textContent = "PayPal setup failed. " + (error && error.message ? error.message : "");
                paypalError.classList.remove("hidden");
                buyButton.style.display = "block";
                paypalContainer.classList.add("hidden");
            }
        };
    }

    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    renderItems();

    document.querySelector(".close-button").onclick = closeModal;

    window.addEventListener("click", (event) => {
        if (event.target.id === "modal") {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    document.addEventListener("contextmenu", (event) => {
        if (event.target.closest(".img-shield, .modal-main-shield, .modal-thumbnail, canvas")) {
            event.preventDefault();
        }
    });

    document.addEventListener("dragstart", (event) => {
        if (event.target.tagName === "IMG" || event.target.closest(".img-shield, .modal-images")) {
            event.preventDefault();
        }
    });
});
