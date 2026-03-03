const app = {
    currentModule: null,
    currentChapterId: null,
    chapterList: [], 
    
    init: function() {
        this.initTheme();
        this.cacheDOM();
        this.bindEvents();
        this.buildSidebar();
    },

    cacheDOM: function() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarOverlay = document.getElementById('sidebar-overlay');
        this.sidebarToggle = document.getElementById('sidebar-toggle');
        this.sidebarClose = document.getElementById('sidebar-close');
        this.themeToggleBtnDesktop = document.getElementById('theme-toggle-desktop');
        this.themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');
        
        this.searchInput = document.getElementById('search-input');
        this.navHeaders = document.querySelectorAll('.nav-section-header');
        
        this.homeView = document.getElementById('home-view');
        this.contentArea = document.getElementById('chapter-content');
        this.chapterNavigation = document.getElementById('chapter-navigation');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
    },

    bindEvents: function() {
        // Sidebar Mobile Toggle
        if(this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => this.toggleSidebar(true));
        }
        if(this.sidebarClose) {
            this.sidebarClose.addEventListener('click', () => this.toggleSidebar(false));
        }
        if(this.sidebarOverlay) {
            this.sidebarOverlay.addEventListener('click', () => this.toggleSidebar(false));
        }

        // Theme Toggle
        if(this.themeToggleBtnDesktop) {
            this.themeToggleBtnDesktop.addEventListener('click', () => this.toggleTheme());
        }
        if(this.themeToggleBtnMobile) {
            this.themeToggleBtnMobile.addEventListener('click', () => this.toggleTheme());
        }

        // Accordion in Sidebar
        this.navHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                const targetId = header.getAttribute('data-target');
                this.toggleNavSection(header, targetId);
            });
        });

        // Search Filter
        if(this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.filterSidebar(e.target.value));
        }
        
        // Navigation Buttons
        if(this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigateChapter(-1));
        }
        if(this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigateChapter(1));
        }
    },

    initTheme: function() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.updateThemeBtnText(true);
        } else {
            this.updateThemeBtnText(false);
        }
    },

    toggleTheme: function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.updateThemeBtnText(isDark);
    },

    updateThemeBtnText: function(isDark) {
        const textSpan = document.querySelector('.theme-text');
        if(textSpan) {
            textSpan.textContent = isDark ? 'লাইট মোড' : 'ডার্ক মোড';
        }
        
        const desktopIconSpan = document.querySelector('#theme-toggle-desktop i');
        if(desktopIconSpan) {
            desktopIconSpan.setAttribute('data-feather', isDark ? 'sun' : 'moon');
        }

        const mobileIconSpan = document.querySelector('#theme-toggle-mobile i');
        if(mobileIconSpan) {
            mobileIconSpan.setAttribute('data-feather', isDark ? 'sun' : 'moon');
        }

        if (typeof feather !== 'undefined') feather.replace();
    },

    toggleSidebar: function(show) {
        if (!this.sidebar || !this.sidebarOverlay) return;
        
        if (show) {
            this.sidebar.classList.add('open');
            this.sidebarOverlay.classList.add('show');
        } else {
            this.sidebar.classList.remove('open');
            this.sidebarOverlay.classList.remove('show');
        }
    },

    toggleNavSection: function(headerElem, targetId) {
        const targetUL = document.getElementById(targetId);
        if (!targetUL) return;
        
        if (headerElem.classList.contains('active')) {
            // Close it
            headerElem.classList.remove('active');
            targetUL.style.display = 'none';
        } else {
            // Open it
            headerElem.classList.add('active');
            targetUL.style.display = 'block';
        }
    },

    buildSidebar: function() {
        this.chapterList = [];
        
        for (const [modKey, modData] of Object.entries(courseData)) {
            const ul = document.getElementById(`nav-${modKey}`);
            if (!ul) continue;
            
            let html = '';
            
            modData.chapters.forEach((chapter, index) => {
                // Determine previous and next for global navigation array
                this.chapterList.push({
                    moduleId: modKey,
                    chapterId: chapter.id,
                    title: chapter.title
                });
                
                html += `
                    <li class="nav-item">
                        <a class="nav-link" id="link-${chapter.id}" onclick="app.loadChapter('${modKey}', '${chapter.id}')">
                            ${chapter.title}
                        </a>
                    </li>
                `;
            });
            
            ul.innerHTML = html;
        }
    },

    filterSidebar: function(query) {
        query = query.toLowerCase();
        
        // loop over courseData
        for (const [modKey, modData] of Object.entries(courseData)) {
            let sectionHasMatch = false;
            
            modData.chapters.forEach(chapter => {
                const link = document.getElementById(`link-${chapter.id}`);
                if (!link) return;

                const matches = chapter.title.toLowerCase().includes(query);
                
                if (matches) {
                    link.parentElement.style.display = 'block';
                    sectionHasMatch = true;
                } else {
                    link.parentElement.style.display = 'none';
                }
            });
            
            // Expand section if searching
            if (query !== '' && sectionHasMatch) {
                const header = document.querySelector(`[data-target="nav-${modKey}"]`);
                const ul = document.getElementById(`nav-${modKey}`);
                if (header && ul && !header.classList.contains('active')) {
                    header.classList.add('active');
                    ul.style.display = 'block';
                }
            }
        }
    },

    loadChapter: function(moduleId, chapterId) {
        const moduleData = courseData[moduleId];
        const chapter = moduleData.chapters.find(c => c.id === chapterId);
        
        if (!chapter) return;
        
        this.currentModule = moduleId;
        this.currentChapterId = chapterId;
        
        // Update URL hash (Optional but good for sharing)
        window.location.hash = `#${chapterId}`;
        
        // Update Sidebar Active State
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.getElementById(`link-${chapterId}`);
        if(activeLink) activeLink.classList.add('active');
        
        // Open parent section if closed
        const ul = document.getElementById(`nav-${moduleId}`);
        const header = document.querySelector(`[data-target="nav-${moduleId}"]`);
        if(header && ul && !header.classList.contains('active')) {
            header.classList.add('active');
            ul.style.display = 'block';
        }
        
        // Render Content
        if(this.homeView) this.homeView.style.display = 'none';
        if(this.contentArea) {
            this.contentArea.style.display = 'block';
            this.contentArea.innerHTML = `
                <div class="chapter-meta">
                    <span class="${moduleData.colorClass}"><i data-feather="${moduleData.icon}"></i> ${moduleData.title}</span> &gt; ${chapter.title}
                </div>
                <h1 class="chapter-title">${chapter.title}</h1>
                <div class="content">
                    ${chapter.content}
                </div>
            `;
        }
        
        // Render Quiz if exists
        QuizSystem.renderQuiz(chapter.quiz, chapterId);
        
        // Update Navigation Buttons
        this.updateNavButtons();
        
        // Auto scroll to top
        window.scrollTo(0, 0);
        
        // Initialize icons for new content
        if (typeof feather !== 'undefined') feather.replace();
        
        // Close mobile sidebar if open
        this.toggleSidebar(false);
    },

    updateNavButtons: function() {
        if (!this.chapterNavigation) return;

        const currentIndex = this.chapterList.findIndex(c => c.chapterId === this.currentChapterId);
        
        this.chapterNavigation.style.display = 'flex';
        
        if (currentIndex > 0) {
            this.prevBtn.style.display = 'inline-flex';
            this.prevBtn.innerHTML = `<i data-feather="arrow-left"></i> পূর্ববর্তী: ${this.chapterList[currentIndex - 1].title}`;
        } else {
            this.prevBtn.style.display = 'none';
        }
        
        if (currentIndex < this.chapterList.length - 1) {
            this.nextBtn.style.display = 'inline-flex';
            this.nextBtn.innerHTML = `পরবর্তী: ${this.chapterList[currentIndex + 1].title} <i data-feather="arrow-right"></i>`;
        } else {
            this.nextBtn.style.display = 'none';
        }
    },

    navigateChapter: function(direction) {
        const currentIndex = this.chapterList.findIndex(c => c.chapterId === this.currentChapterId);
        const newIndex = currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.chapterList.length) {
            const nextChapterInfo = this.chapterList[newIndex];
            this.loadChapter(nextChapterInfo.moduleId, nextChapterInfo.chapterId);
        }
    },

    loadHome: function() {
        if(this.homeView) this.homeView.style.display = 'block';
        if(this.contentArea) this.contentArea.style.display = 'none';
        if(this.chapterNavigation) this.chapterNavigation.style.display = 'none';
        
        const quizContainer = document.getElementById('quiz-container');
        if(quizContainer) quizContainer.style.display = 'none';
        
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.nav-section-header').forEach(header => {
            if(header.hasAttribute('data-target')) {
                header.classList.remove('active');
            }
        });
        document.querySelectorAll('.nav-items').forEach(ul => ul.style.display = 'none');
        
        window.location.hash = '';
        this.currentModule = null;
        this.currentChapterId = null;
        
        window.scrollTo(0, 0);
        this.toggleSidebar(false);
    },

    copyCode: function(btn) {
        const pre = btn.parentElement.nextElementSibling; // <pre> element
        const code = pre.innerText;
        
        navigator.clipboard.writeText(code).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i data-feather="check"></i> Copied';
            if (typeof feather !== 'undefined') feather.replace();
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                if (typeof feather !== 'undefined') feather.replace();
            }, 2000);
        });
    }
};

// Start the app on load
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    
    // Check if URL has hash to load specific chapter
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        // Find which module it belongs to
        for (const [modKey, modData] of Object.entries(courseData)) {
            if (modData.chapters.some(c => c.id === hashId)) {
                app.loadChapter(modKey, hashId);
                break;
            }
        }
    } else {
        // Fallback to home if no hash
        app.loadHome();
    }
});
