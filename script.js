const items = [
    {
        id: 1,
        name: "Test Item",
        price: 1,  // Just $1 for testing
        description: "Test item for verifying PayPal integration",
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
        name: "Item Two",
        price: 199,
        description: "Description for item two",
        image: "images/items/item2/main.jpg",
        sold: false,
        additionalImages: [
            "images/items/item2/main.jpg",
            "images/items/item2/detail1.jpg",
            "images/items/item2/detail2.jpg"
        ]
    },
    {
        id: 3,
        name: "Item Three",
        price: 399,
        description: "Description for item three",
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
        name: "Item Four",
        price: 299,
        description: "Description for item four",
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
        name: "Item Five",
        price: 299,
        description: "Description for item five",
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
        name: "Item Six",
        price: 299,
        description: "Description for item six",
        image: "images/items/item6/main.jpg",
        sold: false,
        additionalImages: [
            "images/items/item6/main.jpg",
            "images/items/item6/detail1.jpg",
            "images/items/item6/detail2.jpg"
        ]
    }
];

// Add this function to find the first unsold item
function findFirstUnsoldItemIndex() {
    return items.findIndex(item => !item.sold);
}

// Initialize currentItemIndex to the first unsold item
let currentItemIndex = 0;  // This will make item1 (index 0) the current item for sale

function renderItems() {
    const container = document.querySelector('.grid-container');
    if (!container) {
        console.error('Grid container not found');
        return;
    }
    
    container.innerHTML = '';

    // Filter items that have images
    const itemsWithImages = items.filter(item => {
        try {
            // Only include items 1 through 6
            return item.id <= 6 && item.image && item.additionalImages && item.additionalImages.length > 0;
        } catch (e) {
            console.error('Error checking images for item:', item.id);
            return false;
        }
    });

    // Sort the filtered items
    const sortedItems = [...itemsWithImages].sort((a, b) => {
        const aIsCurrent = items.indexOf(a) === 0;  // Check if it's item1
        const bIsCurrent = items.indexOf(b) === 0;  // Check if it's item1
        
        // Handle current item - put it first
        if (aIsCurrent) return -1;  // Item1 goes to start
        if (bIsCurrent) return 1;   // Item1 goes to start
        
        // Handle sold/unsold items
        if (a.sold && !b.sold) return 1;   // Sold items at end
        if (!a.sold && b.sold) return -1;  // Unsold items after current
        
        return 0;
    });

    console.log('Rendering items:', sortedItems.length, 'items found');
    
    sortedItems.forEach((item) => {
        const itemElement = document.createElement('div');
        const isCurrentItem = item.id === 1;  // Check if this is item #1
        
        itemElement.className = `item ${!item.sold && !isCurrentItem ? 'blurred' : ''} ${item.sold ? 'sold' : ''}`;
        
        if (isCurrentItem || item.sold) {
            itemElement.style.cursor = 'pointer';
            itemElement.addEventListener('click', () => {
                console.log('Clicked item:', item.name);
                openModal(item);
            });
        }

        itemElement.innerHTML = `
            <div class="item-number">#${item.id}</div>
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            <div class="item-info">
                <h2>${item.name}</h2>
                <p>${item.description}</p>
                <p class="price">$${item.price}</p>
            </div>
        `;

        container.appendChild(itemElement);
    });

    // Only show PayPal button if current item is not sold
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) {
        paypalContainer.style.display = items[currentItemIndex].sold ? 'none' : 'block';
    }
}

// Add error handling for initial render
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking modal...');
    const modal = document.getElementById('modal');
    if (!modal) {
        console.error('Modal not found in DOM!');
    } else {
        console.log('Modal found in DOM');
    }
    console.log('Rendering items...');
    renderItems();
});

function openModal(item) {
    console.log('Opening modal for:', item.name);
    const modal = document.getElementById('modal');
    if (!modal) {
        console.error('Modal element not found!');
        return;
    }
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');
    const modalMainImage = document.getElementById('modal-main-image');
    const modalThumbnails = document.querySelector('.modal-thumbnails');
    const buyButton = document.getElementById('modal-buy-button');
    const paypalContainer = document.getElementById('modal-paypal-container');

    modalTitle.textContent = item.name;
    modalDescription.textContent = item.description;
    modalPrice.textContent = `$${item.price} + $15 Shipping`;
    modalMainImage.src = item.image;

    // Clear and populate thumbnails
    modalThumbnails.innerHTML = '';
    item.additionalImages.forEach(imgSrc => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.className = 'modal-thumbnail';
        thumb.onclick = () => modalMainImage.src = imgSrc;
        modalThumbnails.appendChild(thumb);
    });

    // Show/hide buy button based on item status
    if (item.sold) {
        buyButton.style.display = 'none';
        paypalContainer.classList.add('hidden');
    } else if (item.id === 1) {
        buyButton.style.display = 'block';
        paypalContainer.classList.add('hidden');
        
        // Add click handler for buy button
        buyButton.onclick = function() {
            console.log('Buy button clicked');
            
            // Check if PayPal is loaded
            if (!window.paypal) {
                console.error('PayPal SDK not loaded');
                alert('PayPal is not loaded properly. Please refresh the page.');
                return;
            }

            buyButton.style.display = 'none';
            paypalContainer.classList.remove('hidden');
            paypalContainer.innerHTML = '';
            
            try {
                // Create and render new PayPal buttons
                const buttons = paypal.Buttons({
                    style: {
                        layout: 'vertical',
                        color: 'gold',  // Use standard PayPal button style
                        shape: 'rect',
                        label: 'paypal'
                    },
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                description: item.name,
                                amount: {
                                    value: (item.price + 15).toString()
                                }
                            }]
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((details) => {
                            item.sold = true;
                            const nextItem = items.find(i => !i.sold && i.id > 1);
                            if (nextItem) {
                                currentItemIndex = items.indexOf(nextItem);
                            }
                            renderItems();
                            modal.style.display = 'none';
                            alert('Transaction completed by ' + details.payer.name.given_name);
                        });
                    }
                });

                console.log('Rendering PayPal buttons');
                buttons.render('#modal-paypal-container');
            } catch (error) {
                console.error('Error setting up PayPal:', error);
                buyButton.style.display = 'block';
                paypalContainer.classList.add('hidden');
            }
        };
    } else {
        buyButton.style.display = 'none';
        paypalContainer.classList.add('hidden');
    }

    modal.style.display = 'block';
}

// Add modal close functionality
document.querySelector('.close-button').onclick = function() {
    document.getElementById('modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Set the current item for sale (let's make the third item available)
currentItemIndex = 2;  // This will make "Industrial Light Matrix" the current item for sale
renderItems(); 