// Function to gather prompts and insert them into a sidebar on the page
function addSidebarWithPrompts() {
  function addHTML() {
    // Create icon container
    const iconContainer = document.createElement("div");
    iconContainer.id = "iconContainer";
    iconContainer.className = "icon-container";
    iconContainer.onclick = togglePopup;

    // Create counter
    const counter = document.createElement("div");
    counter.id = "counter";
    counter.className = "counter";
    counter.textContent = "0"; // Initial count value

    // Create icon
    const icon = document.createElement("div");
    icon.id = "icon";
    icon.className = "icon";
    icon.textContent = "+";

    // Append counter and icon to the icon container
    iconContainer.appendChild(counter);
    iconContainer.appendChild(icon);

    // Create popup container
    const popup = document.createElement("div");
    popup.id = "popup";
    popup.className = "popup";

    // Create item list inside popup
    const itemList = document.createElement("ul");
    itemList.id = "itemList";
    itemList.className = "item-list";
    popup.appendChild(itemList);

    // Append iconContainer and popup to body
    document.body.appendChild(iconContainer);
    document.body.appendChild(popup);
  }
  addHTML();

  const itemList = document.getElementById("itemList");
  const popup = document.getElementById("popup");
  const icon = document.getElementById("icon");
  const counter = document.getElementById("counter");

  // Function to toggle the popup
  function togglePopup() {
    loadPrompts();
    popup.classList.toggle("show");
    icon.textContent = popup.classList.contains("show") ? "✖" : "+";
  }
  // Function to add items to the list
//   function addItemsToList(items) {
//     itemList.innerHTML = ""; // Clear existing items
//     items.forEach((item, index) => {
//       const listItem = document.createElement("li");
//       listItem.textContent = `${index + 1}. ${item}`;

//       promptItem.onclick = () => {
//             promptElements[index].scrollIntoView({
//               behavior: "smooth",
//               block: "center",
//             });
//           };

//       itemList.appendChild(listItem);
//     });
//     updateCounter(items.length); // Update counter with current item count
//   }

  // Function to update the item counter
  function updateCounter(count) {
    counter.textContent = count; // Set counter text
  }

  // Create and insert style element for sidebar styles
  const style = document.createElement("style");
//   style.textContent = `
//          /* Sidebar styles */
//          .prompt-sidebar {
//              position: fixed;
//              top: 0;
//              right: 0;
//              width: 300px;
//              height: 100%;
//              background-color: #f9f9f9;
//              border-left: 1px solid #ddd;
//              padding: 10px;
//              overflow-y: auto;
//              z-index: 1000;
//              box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
//              font-family: Arial, sans-serif;
//          }
  
//          .prompt-sidebar h3 {
//              margin-top: 2rem;
//              font-size: 1.2em;
//              text-align: center;
//              color: #333;
//          }
  
//          .prompt-list {
//              padding: 5px 0;
//          }
  
//          .prompt-item {
//              padding: 8px;
//              border-bottom: 1px solid #ccc;
//              cursor: pointer;
//              font-size: 0.9em;
//          }
  
//          .prompt-item:hover {
//              background-color: #e0e0e0;
//          }

//          .prompt-item.active {
//              background-color: #007bff;
//              color: white;
//          }
  
//          .reload-button {
//              display: block;
//              margin: 10px auto;
//              padding: 5px 10px;
//              font-size: 0.9em;
//              cursor: pointer;
//              background-color: #007bff;
//              color: #fff;
//              border: none;
//              border-radius: 3px;
//              position: fixed;
//              top: 10px;
//          }
  
//          .reload-button:hover {
//              background-color: #0056b3;
//          }
//      `;


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
            font-size: 24px;
            transition: transform 0.3s;
            /* Smooth transition for scaling */
        }

        .counter {
            position: absolute;
            top: -10px;
            right: -10px;
            background-color: red;
            border-radius: 50%;
            color: white;
            border: #007bff;
            margin-right: 6px;
            /* Space between counter and icon */
            font-size: 15px;
            padding: 5px;
        }

        .popup {
            display: none;
            /* Initially hidden */
            position: absolute;
            bottom: 120px;
            /* Position above the icon */
            right: 50px;
            /* Position on the right */
            width: 250px;
            /* Set desired width */
            max-height: 80vh;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 15px;
            z-index: 1001;
            /* Ensure it's above other elements */
            opacity: 0;
            /* Start with zero opacity for animation */
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            /* Smooth transition */
            transform: translateY(10px);
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

        /* Scrollbar Styles */
        .popup::-webkit-scrollbar {
    display: none !important; /* For Chrome, Safari, and Edge */
}

        
    `;
    document.head.appendChild(style);

  // Collect all elements with the class 'whitespace-pre-wrap'
  function loadPrompts() {
    const prompts = [];
    const promptElements = document.querySelectorAll(".whitespace-pre-wrap");
    promptElements.forEach((el) => {
      prompts.push(el.textContent.trim());
    });

    // const existingList = document.querySelector(".prompt-list");
    // if (existingList) {
    //   existingList.remove();
    // }

    // addItemsToList(prompts)
    itemList.innerHTML = ""; // Clear existing items
    prompts.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${item}`;

      listItem.onclick = () => {
            promptElements[index].scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          };
          
      itemList.appendChild(listItem);
    });
    updateCounter(prompts.length); // Update counter with current item count
    // Populate sidebar with prompt items
    // const promptList = document.createElement("div");
    // promptList.className = "prompt-list";
    // prompts.forEach((prompt, index) => {
    //   const promptItem = document.createElement("div");
    //   promptItem.className = "prompt-item";
    //   promptItem.textContent = `${index + 1}: ${
    //     prompt.length > 50 ? prompt.slice(0, 50) + "..." : prompt
    //   }`;
    //   // Scroll to the prompt in the page when clicked
    //   promptItem.onclick = () => {
    //     promptElements[index].scrollIntoView({
    //       behavior: "smooth",
    //       block: "center",
    //     });
    //   };
    //   promptList.appendChild(promptItem);
    // });
    // sidebar.appendChild(promptList);

    // // Start observing the prompt elements
    // observePrompts(promptElements);
  }

  function observePrompts(promptElements) {
    const options = {
      root: null, // Use the viewport as the root
      threshold: 0.5, // Trigger when 50% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Array.from(promptElements).indexOf(entry.target);
        const promptItems = document.querySelectorAll(".prompt-item");

        if (entry.isIntersecting) {
          promptItems.forEach((item) => item.classList.remove("active")); // Remove active class from all items
          promptItems[index].classList.add("active"); // Highlight the currently active item
        }
      });
    }, options);

    promptElements.forEach((element) => {
      observer.observe(element); // Observe each prompt element
    });
  }

//   let sidebar = document.getElementById("prompt-sidebar");
//   if (!sidebar) {
//     // Create the sidebar container
//     sidebar = document.createElement("div");
//     sidebar.id = "prompt-sidebar";
//     sidebar.classList.add("prompt-sidebar");

//     // Create the header for the sidebar
//     const header = document.createElement("h3");
//     header.textContent = "Extracted Prompts";
//     sidebar.appendChild(header);

//     // Create and add the reload button
//     const reloadButton = document.createElement("button");
//     reloadButton.className = "reload-button";
//     reloadButton.textContent = "Reload";
//     reloadButton.onclick = loadPrompts;
//     sidebar.appendChild(reloadButton);

//     document.body.appendChild(sidebar);
//   }

  // Load prompts initially
  loadPrompts();
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
