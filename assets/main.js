// Article database (shared with post.html but expanded for the index page metadata)
const articles = [];

// Projects database
const projects = [
  {
    id: 'picztream',
    name: 'PicZTream (pzt)',
    language: 'C++20 & Python',
    desc: '基于终端、全键盘的图片筛选与色彩处理工具，核心诉求是零延迟选片体验与高性能本地色彩流水线。配合 Ghostty 终端的 Kitty 协议在大图模式下能无延迟秒切。',
    install: 'brew tap wangliyangleon/pzt && brew install pzt',
    stars: null,
    version: null,
    fallbackStars: '84',
    fallbackVersion: '2026-07-17',
    url: 'https://wangliyangleon.github.io/picztream',
    github: 'https://github.com/wangliyangleon/picztream',
    featured: true
  }
];

// DOM elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const searchInput = document.getElementById('search-input');
const projectsList = document.getElementById('projects-list');
const techList = document.getElementById('tech-list');
const writingsList = document.getElementById('writings-list');
const themeBtn = document.getElementById('theme-toggle');
const keyboardHelper = document.getElementById('keyboard-helper');
const neoOs = document.getElementById('neo-os');
const neoBrowser = document.getElementById('neo-browser');
const neoUptime = document.getElementById('neo-uptime');
const neoRes = document.getElementById('neo-res');

// State
let activeTab = 'projects';
let activeTheme = 'dark';
let currentSearch = '';

// Update System Clock
function updateClock() {
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const systemTimeEl = document.getElementById('system-time');
  if (systemTimeEl) systemTimeEl.textContent = timeStr;
}
setInterval(updateClock, 1000);

// Initialize and update Neofetch widget dynamically
const startTime = Date.now();

function updateNeofetch() {
  // 1. Detect OS
  if (neoOs) {
    const ua = navigator.userAgent;
    let osName = 'Darwin (macOS)';
    if (ua.indexOf('Macintosh') !== -1 || ua.indexOf('Mac OS X') !== -1) osName = 'macOS';
    else if (ua.indexOf('Windows') !== -1) osName = 'Windows';
    else if (ua.indexOf('Linux') !== -1) osName = 'Linux';
    else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) osName = 'iOS/iPadOS';
    neoOs.textContent = osName;
  }

  // 2. Detect Browser
  if (neoBrowser) {
    const ua = navigator.userAgent;
    let browserName = 'Safari';
    if (ua.indexOf('Chrome') !== -1 && ua.indexOf('Edg') === -1) browserName = 'Chrome';
    else if (ua.indexOf('Firefox') !== -1) browserName = 'Firefox';
    else if (ua.indexOf('Edg') !== -1) browserName = 'Edge';
    else if (ua.indexOf('Ghostty') !== -1) browserName = 'Ghostty';
    else if (ua.indexOf('AppleWebKit') !== -1 && ua.indexOf('Safari') === -1) browserName = 'Webview';
    neoBrowser.textContent = browserName;
  }

  // 3. Screen Resolution
  if (neoRes) {
    neoRes.textContent = `${window.screen.width}x${window.screen.height}`;
  }

  // 4. Update Uptime loop
  updateUptime();
  setInterval(updateUptime, 1000);
}

function updateUptime() {
  if (!neoUptime) return;
  const diffMs = Date.now() - startTime;
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    neoUptime.textContent = `${diffSec}s`;
  } else {
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    neoUptime.textContent = `${mins}m ${secs}s`;
  }
}
updateClock();

// Theme manager
function setTheme(theme) {
  activeTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('blog-theme', theme);
  if (themeBtn) themeBtn.textContent = `THEME: ${theme.toUpperCase()}`;
}

const savedTheme = localStorage.getItem('blog-theme') || 
  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
setTheme(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    setTheme(activeTheme === 'dark' ? 'light' : 'dark');
  });
}

// Tab Switching
function switchTab(tabId) {
  activeTab = tabId;
  tabBtns.forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  tabPanes.forEach(pane => {
    if (pane.id === `${tabId}-pane`) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});

// Render Projects
function renderProjects() {
  if (!projectsList) return;
  projectsList.innerHTML = '';
  
  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      ${p.featured ? `<span class="project-badge-featured">FEATURED</span>` : ''}
      <div class="project-header">
        <h3 class="project-title">${p.name}</h3>
        <span class="project-lang-tag">${p.language}</span>
      </div>
      <p class="project-desc">${p.desc}</p>
      <div class="project-terminal-block">
        <pre><span class="prompt">$</span> ${p.install}</pre>
      </div>
      <div class="project-footer">
        <div class="project-stats">
          <span class="project-stat-item">★ ${p.stars !== null ? p.stars : '...'}</span>
          <span class="project-stat-item">Ver: ${p.version !== null ? p.version : 'fetching...'}</span>
        </div>
        <div class="project-links">
          <a href="${p.url}" target="_blank" class="project-link">Home -></a>
          <a href="${p.github}" target="_blank" class="project-link">GitHub</a>
        </div>
      </div>
    `;
    projectsList.appendChild(card);
  });
}

// Fetch and update project statistics dynamically from GitHub API
async function fetchAndUpdateProjectStats() {
  for (const p of projects) {
    if (!p.github) continue;
    
    const match = p.github.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) continue;
    
    const owner = match[1];
    const repo = match[2];
    
    let starsFetched = false;
    let versionFetched = false;
    
    try {
      // 1. Fetch Stars
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (repoRes.ok) {
        const repoData = await repoRes.json();
        p.stars = repoData.stargazers_count.toString();
        starsFetched = true;
      }
    } catch (err) {
      console.error(`Failed to fetch stars for ${p.id}:`, err);
    }
    
    try {
      // 2. Fetch Latest Release
      const releaseRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
      if (releaseRes.ok) {
        const releaseData = await releaseRes.json();
        const publishDate = new Date(releaseData.published_at);
        const formattedDate = publishDate.toISOString().split('T')[0];
        p.version = `${releaseData.tag_name} (${formattedDate})`;
        versionFetched = true;
      } else {
        // Fallback to tags if no formal release is available
        const tagsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/tags`);
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          if (tagsData.length > 0) {
            p.version = tagsData[0].name;
            versionFetched = true;
          }
        }
      }
    } catch (err) {
      console.error(`Failed to fetch version for ${p.id}:`, err);
    }
    
    // Apply fallback values if fetching failed (e.g. rate limit, offline)
    if (!starsFetched) {
      p.stars = p.fallbackStars;
    }
    if (!versionFetched) {
      p.version = p.fallbackVersion;
    }
    
    // Re-render project list after updates
    renderProjects();
  }
}

// Render Lists (Tech & Writings)
function renderLists() {
  if (!techList || !writingsList) return;
  
  techList.innerHTML = '';
  writingsList.innerHTML = '';
  
  let matchCount = 0;
  
  articles.forEach(article => {
    const matchesSearch = article.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                          article.summary.toLowerCase().includes(currentSearch.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(currentSearch.toLowerCase()));
                          
    if (!matchesSearch) return;
    
    matchCount++;
    const postItem = document.createElement('div');
    postItem.className = `post-item ${article.category === 'writings' ? 'poetry-item' : ''}`;
    
    const tagsHtml = article.tags.map(t => `<span class="post-tag">#${t}</span>`).join(' ');
    
    postItem.innerHTML = `
      <div class="post-meta">
        <span class="post-date">${article.date}</span>
        ${tagsHtml}
      </div>
      <a href="post.html?p=${article.id}" class="post-title-link ${article.category === 'writings' ? 'poetry-title-link' : ''}">${article.title}</a>
      <p class="post-summary">${article.summary}</p>
    `;
    
    if (article.category === 'tech') {
      techList.appendChild(postItem);
    } else {
      writingsList.appendChild(postItem);
    }
  });

  // Empty states
  if (techList.children.length === 0) {
    techList.innerHTML = `<div style="color:var(--fg-dim);font-family:var(--font-mono);font-size:14px;padding:24px 0;">NO_POSTS_FOUND (query: "${currentSearch}")</div>`;
  }
  if (writingsList.children.length === 0) {
    writingsList.innerHTML = `<div style="color:var(--fg-dim);font-family:var(--font-mono);font-size:14px;padding:24px 0;">NO_WRITINGS_FOUND (query: "${currentSearch}")</div>`;
  }
}

// Search interaction
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderLists();
  });
}

// Global Keyboard Navigation
window.addEventListener('keydown', (e) => {
  // If user typing in inputs, ignore hotkeys
  if (document.activeElement === searchInput) {
    if (e.key === 'Escape') {
      document.activeElement.blur();
    }
    return;
  }

  // Hotkeys
  switch (e.key) {
    case '1':
      e.preventDefault();
      switchTab('projects');
      break;
    case '2':
      e.preventDefault();
      switchTab('tech');
      break;
    case '3':
      e.preventDefault();
      switchTab('writings');
      break;
    case 't':
    case 'T':
      e.preventDefault();
      setTheme(activeTheme === 'dark' ? 'light' : 'dark');
      break;
    case '/':
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
      break;
    case 'h':
    case 'H':
      // Move tab left
      e.preventDefault();
      navigateTab(-1);
      break;
    case 'l':
    case 'L':
      // Move tab right
      e.preventDefault();
      navigateTab(1);
      break;
    case '?':
      e.preventDefault();
      if (keyboardHelper) keyboardHelper.classList.toggle('hidden');
      break;
  }
});

function navigateTab(direction) {
  const tabSequence = ['projects', 'tech', 'writings'];
  let idx = tabSequence.indexOf(activeTab);
  idx = (idx + direction + tabSequence.length) % tabSequence.length;
  switchTab(tabSequence[idx]);
}

// Initialize
renderProjects();
renderLists();
updateNeofetch();
fetchAndUpdateProjectStats();

// Hide keyboard helper after 5 seconds
setTimeout(() => {
  if (keyboardHelper) {
    keyboardHelper.classList.add('hidden');
  }
}, 5000);
