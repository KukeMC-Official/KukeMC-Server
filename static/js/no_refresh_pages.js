document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面容器和缓存
    const contentContainer = document.getElementById('content-container');
    const loadingIndicator = document.createElement('div');
    const pageCache = new Map(); // 缓存已加载的页面内容

    // 创建加载指示器
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = `
        <div class="loading-spinner"></div>
        <p>加载中...</p>
    `;
    document.body.appendChild(loadingIndicator);

    // 初始化导航拦截
    initNavigation();

    // 初始化历史记录监听
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.url) {
            loadPage(e.state.url, false);
        }
    });

    // 导航拦截处理
    function initNavigation() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;

            const url = link.getAttribute('href');
            // 过滤不需要拦截的链接（外部链接、锚点、新窗口等）
            if (
                url.startsWith('http') || 
                url.startsWith('#') || 
                link.target === '_blank' || 
                url.startsWith('mailto:')
            ) {
                return;
            }

            e.preventDefault();
            loadPage(url);
        });
    }

    // 加载页面内容
    function loadPage(url, addToHistory = true) {
        // 显示加载指示器
        loadingIndicator.classList.add('active');
        
        // 检查缓存
        if (pageCache.has(url)) {
            renderPage(pageCache.get(url), url, addToHistory);
            loadingIndicator.classList.remove('active');
            return;
        }

        // 远程加载页面
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('加载失败');
                return response.text();
            })
            .then(html => {
                pageCache.set(url, html); // 存入缓存
                renderPage(html, url, addToHistory);
            })
            .catch(() => {
                // 加载失败时降级为普通跳转
                window.location.href = url;
            })
            .finally(() => {
                loadingIndicator.classList.remove('active');
            });
    }

    // 渲染页面内容
    function renderPage(html, url, addToHistory) {
        // 解析HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 提取关键内容
        const newContent = doc.getElementById('content-container')?.innerHTML;
        const newTitle = doc.title;

        if (!newContent) {
            window.location.href = url; // 内容无效时跳转
            return;
        }

        // 添加退出动画
        contentContainer.classList.remove('content-visible');
        contentContainer.classList.add('content-loading');

        setTimeout(() => {
            // 更新内容
            contentContainer.innerHTML = newContent;
            document.title = newTitle;

            // 执行新页面中的脚本
            executeScripts(doc);

            // 添加进入动画
            contentContainer.classList.remove('content-loading');
            contentContainer.classList.add('content-visible');

            // 滚动到顶部
            window.scrollTo(0, 0);

            // 更新历史记录
            if (addToHistory) {
                history.pushState({ url }, newTitle, url);
            }

            // 重新初始化导航高亮（如果有）
            if (window.updateNavActive) {
                window.updateNavActive(url);
            }
        }, 300); // 与动画时长匹配
    }

    // 执行页面中的脚本
    function executeScripts(doc) {
        // 处理外部脚本
        doc.querySelectorAll('script[src]').forEach(oldScript => {
            const existing = document.querySelector(`script[src="${oldScript.src}"]`);
            if (!existing) {
                const script = document.createElement('script');
                script.src = oldScript.src;
                script.async = oldScript.async;
                script.defer = oldScript.defer;
                document.body.appendChild(script);
            }
        });

        // 处理内联脚本
        doc.querySelectorAll('script:not([src])').forEach(oldScript => {
            const script = document.createElement('script');
            script.textContent = oldScript.textContent;
            document.body.appendChild(script);
        });
    }

    // 暴露全局方法（可选）
    window.loadPage = loadPage;
});