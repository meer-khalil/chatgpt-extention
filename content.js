// Function to gather prompts and insert them into a sidebar on the page
function addSidebarWithPrompts() {
  let previousUrl = window.location.href;

  function attachButtonClickHandler() {
    // Query the button with aria-label="Send prompt"
    const button = document.querySelector('button[aria-label="Send prompt"]');
  
    // Check if the button exists and attach the click event listener
    if (button) {
      button.addEventListener('click', function() {
        console.log('Button with aria-label "Send prompt" clicked!');
        loadPrompts();
      });
    } else {
      console.log('Button with aria-label "Send prompt" not found!');
    }
  }

  
  setInterval(() => {
    if (window.location.href !== previousUrl) {
      console.log('URL changed:', window.location.href);
      loadPrompts(); // Trigger your custom function
      attachButtonClickHandler()
      setTimeout(() => {
        loadPrompts();
        attachButtonClickHandler()
      }, 5000);
      previousUrl = window.location.href;  // Update the previous URL
    }
    loadPrompts();
  }, 1000);  // Check every second

  function addHTML() {

    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.rel = "stylesheet";
    fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css";
    document.head.appendChild(fontAwesomeLink);
    
    // Create icon container
    // const iconContainer = document.createElement("div");
    // iconContainer.id = "iconContainer";
    // iconContainer.className = "icon-container";
    // iconContainer.onclick = togglePopup;

    // // Create counter
    // const counter = document.createElement("div");
    // counter.id = "counter";
    // counter.className = "counter";
    // counter.textContent = "0"; // Initial count value

    // // Create icon
    // const icon = document.createElement("div");
    // icon.id = "icon";
    // icon.className = "icon";
    // icon.innerHTML = '<i class="fas fa-bars"></i>';


    // // Append counter and icon to the icon container
    // iconContainer.appendChild(counter);
    // iconContainer.appendChild(icon);

    // Create popup container
    const popup = document.createElement("div");
    popup.id = "popup";
    popup.className = "popup";
    popup.style.setProperty("--scrollbar-width", "4px");
    popup.style.setProperty("--scrollbar-color", "#007bff");
    popup.style.setProperty("--scrollbar-track-color", "#f0f0f0");

    // Create item list inside popup
    const itemList = document.createElement("ul");
    itemList.id = "itemList";
    itemList.className = "item-list";
    popup.appendChild(itemList);

    // Append iconContainer and popup to body
    // document.body.appendChild(iconContainer);
    document.body.appendChild(popup);
  }
  addHTML();

  const itemList = document.getElementById("itemList");
  const popup = document.getElementById("popup");
  // const icon = document.getElementById("icon");
  // const counter = document.getElementById("counter");

  // Function to toggle the popup
  function togglePopup() {
    popup.classList.toggle("show");
    // icon.innerHTML = popup.classList.contains("show") ? '<i class="fa fa-times" aria-hidden="true"></i>' : '<i class="fas fa-bars"></i>';
    loadPrompts();
  }

  // Function to update the item counter
  // function updateCounter(count) {
  //   counter.textContent = count; // Set counter text
  // }

  // Create and insert style element for sidebar styles
  const style = document.createElement("style");
 
  style.textContent = `
            .icon-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            cursor: pointer;
            z-index: 1000;
            /* Ensure it's above other elements */
            display: flex;
            /* Flexbox for alignment */
            align-items: center;
            /* Center items vertically */
        }

               .icon {
            width: 50px;
            height: 50px;
            background-color: #007bff;
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        

        .counter {
            position: absolute;
        top: -17px;
        right: -3px;
        background-color: red;
        border-radius: 50%;
        color: white;
        line-height: 18px;
        font-size: 15px;
        padding: 5px;
        }

        .popup {
            display: block;
            /* Initially hidden */
            position: absolute;
            bottom: 120px;
            /* Position above the icon */
            right: 25px;
            /* Position on the right */
            width: 275px;
            /* Set desired width */
            max-height: 80vh;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 15px;
            z-index: 1001;
            /* Ensure it's above other elements */
            opacity: 1;
            /* Start with zero opacity for animation */
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            /* Smooth transition */
            // transform: translateY(10px);
            /* Start slightly lower for animation */
            overflow-y: auto;
            /* Allow scrolling if content exceeds height */
        }

        .popup.show {
            display: block;
            /* Show when toggled */
            opacity: 1;
            /* Fade in */
            transform: translateY(0);
            /* Slide up */
        }

        .item-list {
            list-style: none;
            /* Remove default list styling */
            padding: 0;
            margin: 0;
        }

        .item-list li {
            padding: 10px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            white-space: nowrap;
            /* Prevent text from wrapping */
            overflow: hidden;
            /* Hide any overflow */
            text-overflow: ellipsis;
            /* Show ellipsis (...) for overflowed text */
            position: relative;
        }
         li[title] {
            position: relative;
        }

        li[title]:hover::after {
            content: attr(title); /* Display the title attribute as the tooltip */
            position: absolute;
            bottom: 100%; /* Place the tooltip above the item */
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: #fff;
            padding: 8px;
            border-radius: 5px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.1s ease;
            z-index: 10;
        }

        li[title]:hover::after {
            opacity: 1;
            visibility: visible;
        }

        .item-list li:hover {
            padding: 10px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            background-color: rgb(230, 226, 226);
        }

        .item-list li:last-child {
            border-bottom: none;
            /* Remove border from last item */
        } 
    `;
  document.head.appendChild(style);

  // Collect all elements with the class 'whitespace-pre-wrap'
  function loadPrompts() {
    const prompts = [];
    const promptElements = document.querySelectorAll(".whitespace-pre-wrap");
    if (promptElements.length === 0) {
      loadPrompts();
      attachButtonClickHandler()
    }

    promptElements.forEach((el) => {
      prompts.push(el.textContent.trim());
    });

  
    itemList.innerHTML = ""; // Clear existing items
    prompts.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${item}`;

      listItem.setAttribute('title', item);

      listItem.onclick = () => {
        promptElements[index].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      };

      itemList.appendChild(listItem);
    });
    updateCounter(prompts.length); // Update counter with current item count
  }

  // Load prompts initially
  loadPrompts();
  attachButtonClickHandler()
}

// Use MutationObserver to wait until .whitespace-pre-wrap elements are added to the DOM
const observer = new MutationObserver((mutationsList, observer) => {
  if (document.querySelectorAll(".whitespace-pre-wrap").length > 0) {
    observer.disconnect(); // Stop observing once elements are found
    addSidebarWithPrompts(); // Run the function to add the sidebar
  }
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });