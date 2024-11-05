// Function to gather prompts and insert them into a sidebar on the page
function addSidebarWithPrompts() {
    // Create and insert style element for sidebar styles
    const style = document.createElement("style");
    style.textContent = `
         /* Sidebar styles */
         .prompt-sidebar {
             position: fixed;
             top: 0;
             right: 0;
             width: 300px;
             height: 100%;
             background-color: #f9f9f9;
             border-left: 1px solid #ddd;
             padding: 10px;
             overflow-y: auto;
             z-index: 1000;
             box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
             font-family: Arial, sans-serif;
         }
  
         .prompt-sidebar h3 {
             margin-top: 2rem;
             font-size: 1.2em;
             text-align: center;
             color: #333;
         }
  
         .prompt-list {
             padding: 5px 0;
         }
  
         .prompt-item {
             padding: 8px;
             border-bottom: 1px solid #ccc;
             cursor: pointer;
             font-size: 0.9em;
         }
  
         .prompt-item:hover {
             background-color: #e0e0e0;
         }

         .prompt-item.active {
             background-color: #007bff;
             color: white;
         }
  
         .reload-button {
             display: block;
             margin: 10px auto;
             padding: 5px 10px;
             font-size: 0.9em;
             cursor: pointer;
             background-color: #007bff;
             color: #fff;
             border: none;
             border-radius: 3px;
             position: fixed;
             top: 10px;
         }
  
         .reload-button:hover {
             background-color: #0056b3;
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
  
        const existingList = document.querySelector(".prompt-list");
        if (existingList) {
            existingList.remove();
        }
  
        // Populate sidebar with prompt items
        const promptList = document.createElement("div");
        promptList.className = "prompt-list";
        prompts.forEach((prompt, index) => {
            const promptItem = document.createElement("div");
            promptItem.className = "prompt-item";
            promptItem.textContent = `${index + 1}: ${prompt.length > 50 ? prompt.slice(0, 50) + "..." : prompt}`;
            // Scroll to the prompt in the page when clicked
            promptItem.onclick = () => {
                promptElements[index].scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            };
            promptList.appendChild(promptItem);
        });
        sidebar.appendChild(promptList);
        
        // Start observing the prompt elements
        observePrompts(promptElements);
    }

    function observePrompts(promptElements) {
        const options = {
            root: null, // Use the viewport as the root
            threshold: 0.5 // Trigger when 50% of the element is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const index = Array.from(promptElements).indexOf(entry.target);
                const promptItems = document.querySelectorAll('.prompt-item');

                if (entry.isIntersecting) {
                    promptItems.forEach(item => item.classList.remove('active')); // Remove active class from all items
                    promptItems[index].classList.add('active'); // Highlight the currently active item
                }
            });
        }, options);

        promptElements.forEach((element) => {
            observer.observe(element); // Observe each prompt element
        });
    }
  
    let sidebar = document.getElementById("prompt-sidebar");
    if (!sidebar) {
        // Create the sidebar container
        sidebar = document.createElement("div");
        sidebar.id = "prompt-sidebar";
        sidebar.classList.add("prompt-sidebar");
  
        // Create the header for the sidebar
        const header = document.createElement("h3");
        header.textContent = "Extracted Prompts";
        sidebar.appendChild(header);
  
        // Create and add the reload button
        const reloadButton = document.createElement("button");
        reloadButton.className = "reload-button";
        reloadButton.textContent = "Reload";
        reloadButton.onclick = loadPrompts;
        sidebar.appendChild(reloadButton);
  
        document.body.appendChild(sidebar);
    }
  
    // Load prompts initially
    loadPrompts();
}

// Use MutationObserver to wait until .whitespace-pre-wrap elements are added to the DOM
const observer = new MutationObserver((mutationsList, observer) => {
    if (document.querySelectorAll('.whitespace-pre-wrap').length > 0) {
        observer.disconnect(); // Stop observing once elements are found
        addSidebarWithPrompts(); // Run the function to add the sidebar
    }
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });
