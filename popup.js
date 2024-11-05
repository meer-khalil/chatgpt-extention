// // Request the prompt data from the content script
// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     if (tabs[0]) {
//         chrome.tabs.sendMessage(tabs[0].id, { action: "getPrompts" }, function (response) {
//             if (chrome.runtime.lastError) {
//                 console.error("Error:", chrome.runtime.lastError.message);
//                 return;
//             }

//             if (response && response.prompts) {
//                 populatePromptList(response.prompts);
//             } else {
//                 console.error("No prompts found or invalid response");
//             }
//         });
//     } else {
//         console.error("No active tab found.");
//     }
// });

// // Populate the prompt list in the popup
// function populatePromptList(prompts) {
//     const promptList = document.getElementById("prompt-list");
//     prompts.forEach((prompt, index) => {
//         const promptItem = document.createElement("div");
//         promptItem.className = "prompt-item";
//         promptItem.textContent = `Prompt ${index + 1}: ${prompt}`;
//         promptList.appendChild(promptItem);
//     });
// }
