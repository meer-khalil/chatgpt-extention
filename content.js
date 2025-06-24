// Glassmorphism Floating Prompt Manager for AI Chat
(function() {
  // --- State ---
  let isExpanded = true;
  let isDragging = false;
  let dragOffsetX = 0, dragOffsetY = 0;
  // Panel position: restore from localStorage if available
  let savedPanelPos = JSON.parse(localStorage.getItem('gptPanelPos') || 'null');
  let panelX = savedPanelPos && typeof savedPanelPos.x === 'number' ? savedPanelPos.x : Math.max(window.innerWidth - 400 - 40, 0);
  let panelY = savedPanelPos && typeof savedPanelPos.y === 'number' ? savedPanelPos.y : 40;
  let favoritePrompts = JSON.parse(localStorage.getItem('favoritePrompts') || '[]');

  // --- Utility: Get user prompts ---
  function getUserPrompts() {
    const allPromptElements = document.querySelectorAll('.whitespace-pre-wrap');
    return Array.from(allPromptElements).filter(el => {
      let parent = el.parentElement;
      let grandparent = parent ? parent.parentElement : null;
      return (
        (parent && parent.getAttribute && parent.getAttribute('data-testid') === 'conversation-turn-user-message') ||
        (grandparent && grandparent.getAttribute && grandparent.getAttribute('data-testid') === 'conversation-turn-user-message') ||
        (parent && parent.className && parent.className.toLowerCase().includes('user')) ||
        (grandparent && grandparent.className && grandparent.className.toLowerCase().includes('user'))
      );
    });
  }

  // --- Utility: Save favorites ---
  function saveFavorites() {
    localStorage.setItem('favoritePrompts', JSON.stringify(favoritePrompts));
  }

  // --- UI: Create floating panel ---
  function createPanel() {
    // Remove old panel if exists
    const old = document.getElementById('gpt-prompt-panel');
    if (old) old.remove();

    // Panel container
    const panel = document.createElement('div');
    panel.id = 'gpt-prompt-panel';
    panel.className = 'gpt-glass-panel expanded';
    panel.style.left = panelX + 'px';
    panel.style.top = panelY + 'px';
    panel.tabIndex = 0;
    panel.innerHTML = `
      <div class="gpt-panel-header" id="gpt-panel-header">
        <span class="gpt-panel-title">Prompts</span>
        <div class="gpt-panel-actions">
          <button class="gpt-panel-btn" id="gpt-panel-expand-btn" title="Expand/Collapse"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="#222" stroke-width="2" fill="none"/></svg></button>
          <button class="gpt-panel-btn" id="gpt-panel-close-btn" title="Close"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M6 6l8 8M14 6l-8 8" stroke="#222" stroke-width="2" fill="none"/></svg></button>
        </div>
      </div>
      <div class="gpt-panel-list" id="gpt-panel-list"></div>
    `;
    document.body.appendChild(panel);
    addPanelListeners(panel);
    renderPromptList();
  }

  // --- UI: Render prompt list ---
  function renderPromptList() {
    const list = document.getElementById('gpt-panel-list');
    if (!list) return;
    const userPromptElements = getUserPrompts();
    list.innerHTML = '';
    if (userPromptElements.length === 0) {
      // Show a message if no prompts found
      list.innerHTML = '<div class="gpt-empty">No prompts found in this session.</div>';
      return;
    }
    userPromptElements.forEach((el, idx) => {
      const prompt = el.textContent.trim();
      const isFav = favoritePrompts.includes(prompt);
      const item = document.createElement('div');
      item.className = 'gpt-prompt-item';
      item.innerHTML = `
        <span class="gpt-prompt-text" title="${prompt}">${prompt}</span>
        <div class="gpt-prompt-actions">
          <button class="gpt-prompt-btn" title="Copy"><svg width="18" height="18" viewBox="0 0 20 20"><rect x="6" y="6" width="9" height="9" rx="2" fill="none" stroke="#222" stroke-width="2"/><rect x="3" y="3" width="9" height="9" rx="2" fill="none" stroke="#222" stroke-width="2"/></svg></button>
          <button class="gpt-prompt-btn" title="Edit"><svg width="18" height="18" viewBox="0 0 20 20"><path d="M4 13.5V16h2.5l7.1-7.1-2.5-2.5L4 13.5z" fill="none" stroke="#222" stroke-width="2"/><path d="M14.7 6.3a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-1.1 1.1 2.5 2.5 1.1-1.1z" fill="none" stroke="#222" stroke-width="2"/></svg></button>
          <button class="gpt-prompt-btn gpt-fav-btn" title="Favorite"><svg width="18" height="18" viewBox="0 0 20 20"><polygon points="10,2 12.6,7.5 18.6,8 14,12.2 15.2,18 10,15 4.8,18 6,12.2 1.4,8 7.4,7.5" fill="${isFav ? '#ffd700' : 'none'}" stroke="#222" stroke-width="2"/></svg></button>
        </div>
      `;
      // Scroll to prompt on click
      item.querySelector('.gpt-prompt-text').onclick = () => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      // Copy
      item.querySelectorAll('.gpt-prompt-btn')[0].onclick = () => {
        navigator.clipboard.writeText(prompt);
        showToast('Prompt copied!');
      };
      // Edit (non-destructive: just show modal, do not change chat)
      item.querySelectorAll('.gpt-prompt-btn')[1].onclick = () => {
        editPrompt(prompt);
      };
      // Favorite
      item.querySelectorAll('.gpt-prompt-btn')[2].onclick = () => {
        if (favoritePrompts.includes(prompt)) {
          favoritePrompts = favoritePrompts.filter(p => p !== prompt);
        } else {
          favoritePrompts.push(prompt);
        }
        saveFavorites();
        renderPromptList();
      };
      list.appendChild(item);
    });
  }

  // --- UI: Edit prompt modal (non-destructive) ---
  function editPrompt(prompt) {
    const modal = document.createElement('div');
    modal.className = 'gpt-edit-modal';
    modal.innerHTML = `
      <div class="gpt-edit-modal-content">
        <textarea class="gpt-edit-textarea">${prompt}</textarea>
        <div class="gpt-edit-actions">
          <button class="gpt-edit-save">Save</button>
          <button class="gpt-edit-cancel">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.gpt-edit-cancel').onclick = () => modal.remove();
    modal.querySelector('.gpt-edit-save').onclick = () => {
      // For now, just close modal. (Optionally, you could copy the edited prompt to clipboard or re-inject it into the chat input.)
      modal.remove();
    };
  }

  // --- Panel listeners: Drag, expand/collapse, close ---
  function addPanelListeners(panel) {
    const header = panel.querySelector('#gpt-panel-header');
    const expandBtn = panel.querySelector('#gpt-panel-expand-btn');
    const closeBtn = panel.querySelector('#gpt-panel-close-btn');
    // Drag logic (scoped event listeners)
    header.onmousedown = (e) => {
      isDragging = true;
      dragOffsetX = e.clientX - panel.offsetLeft;
      dragOffsetY = e.clientY - panel.offsetTop;
      document.body.style.userSelect = 'none';
      // Add listeners only during drag
      function onMouseMove(e) {
        if (isDragging) {
          panelX = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, e.clientX - dragOffsetX));
          panelY = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, e.clientY - dragOffsetY));
          // Prevent panel from going off the right/top edge
          panelX = Math.min(panelX, window.innerWidth - panel.offsetWidth);
          panelY = Math.max(0, panelY);
          panel.style.left = panelX + 'px';
          panel.style.top = panelY + 'px';
        }
      }
      function onMouseUp() {
        isDragging = false;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        // Save panel position to localStorage
        localStorage.setItem('gptPanelPos', JSON.stringify({ x: panelX, y: panelY }));
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
    // Expand/collapse
    expandBtn.onclick = () => {
      isExpanded = !isExpanded;
      panel.classList.toggle('expanded', isExpanded);
      panel.classList.toggle('collapsed', !isExpanded);
      renderPromptList();
    };
    // Close
    closeBtn.onclick = () => {
      panel.remove();
    };
  }

  // --- Styles: Glassmorphism ---
  function addGlassStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .gpt-glass-panel {
        position: fixed;
        min-width: 260px;
        max-width: 400px;
        min-height: 48px;
        max-height: 80vh;
        z-index: 99999;
        border-radius: 18px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        background: rgba(255,255,255,0.18);
        backdrop-filter: blur(16px) saturate(180%);
        border: 1px solid rgba(255,255,255,0.24);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: box-shadow 0.2s, background 0.2s;
      }
      .gpt-glass-panel.collapsed {
        height: 48px !important;
        min-height: 48px !important;
        max-height: 48px !important;
      }
      .gpt-glass-panel.expanded {
        height: auto;
        max-height: 80vh;
      }
      .gpt-panel-header {
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: rgba(255,255,255,0.22);
        border-bottom: 1px solid rgba(255,255,255,0.18);
        user-select: none;
      }
      .gpt-panel-title {
        font-weight: 600;
        color: #222;
        font-size: 1.1rem;
        letter-spacing: 0.01em;
      }
      .gpt-panel-actions {
        display: flex;
        gap: 6px;
      }
      .gpt-panel-btn {
        background: none;
        border: none;
        padding: 4px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        align-items: center;
      }
      .gpt-panel-btn:hover, .gpt-panel-btn:focus {
        background: rgba(0,0,0,0.07);
        outline: none;
      }
      .gpt-panel-list {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 8px 0 8px 0;
        background: transparent;
      }
      .gpt-empty {
        color: #888;
        text-align: center;
        padding: 24px 0;
        font-size: 1rem;
      }
      .gpt-prompt-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 16px;
        margin: 0 0 4px 0;
        border-radius: 12px;
        background: rgba(255,255,255,0.22);
        box-shadow: 0 1px 4px 0 rgba(31,38,135,0.04);
        transition: background 0.15s;
        font-size: 0.98rem;
        gap: 8px;
      }
      .gpt-prompt-item:hover {
        background: rgba(255,255,255,0.32);
      }
      .gpt-prompt-text {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        color: #222;
        font-size: 1rem;
      }
      .gpt-prompt-actions {
        display: flex;
        gap: 4px;
      }
      .gpt-prompt-btn {
        background: none;
        border: none;
        padding: 3px;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: background 0.2s;
      }
      .gpt-prompt-btn:hover, .gpt-prompt-btn:focus {
        background: rgba(0,0,0,0.09);
        outline: none;
      }
      .gpt-fav-btn svg polygon {
        transition: fill 0.2s;
      }
      .gpt-edit-modal {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.18);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gpt-edit-modal-content {
        background: rgba(255,255,255,0.95);
        border-radius: 14px;
        padding: 24px 18px 16px 18px;
        min-width: 260px;
        max-width: 90vw;
        box-shadow: 0 4px 32px 0 rgba(31,38,135,0.18);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .gpt-edit-textarea {
        width: 100%;
        min-height: 60px;
        border-radius: 8px;
        border: 1px solid #ccc;
        padding: 8px;
        font-size: 1rem;
        resize: vertical;
      }
      .gpt-edit-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      .gpt-edit-save, .gpt-edit-cancel {
        padding: 6px 16px;
        border-radius: 6px;
        border: none;
        font-size: 1rem;
        cursor: pointer;
        background: #007bff;
        color: #fff;
        transition: background 0.15s;
      }
      .gpt-edit-cancel {
        background: #aaa;
      }
      .gpt-toast {
        position: fixed;
        left: 50%;
        bottom: 48px;
        transform: translateX(-50%);
        background: rgba(40,40,40,0.95);
        color: #fff;
        padding: 12px 28px;
        border-radius: 12px;
        font-size: 1.05rem;
        box-shadow: 0 2px 16px 0 rgba(31,38,135,0.12);
        z-index: 100001;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
      }
      .gpt-toast.show {
        opacity: 1;
      }
      @media (max-width: 600px) {
        .gpt-glass-panel {
          min-width: 90vw;
          max-width: 98vw;
        }
        .gpt-edit-modal-content {
          min-width: 80vw;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // --- React to DOM changes ---
  function observePrompts() {
    let debounceTimeout = null;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        renderPromptList();
      }, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // --- Wait for prompts to exist before initializing panel ---
  function waitForPromptsAndInit() {
    if (getUserPrompts().length > 0) {
      addGlassStyles();
      createPanel();
      observePrompts();
    } else {
      setTimeout(waitForPromptsAndInit, 500);
    }
  }

  waitForPromptsAndInit();

  // --- Toast notification ---
  function showToast(msg) {
    let toast = document.getElementById('gpt-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gpt-toast';
      toast.className = 'gpt-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 1500);
  }
})();