// 服务器分类筛选功能
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const serverItems = document.querySelectorAll('.server-item');
    
    // 检查元素是否在视口中
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // 显示在视口中的元素
    function showItemsInViewport() {
        serverItems.forEach((item) => {
            if (isInViewport(item)) {
                item.classList.add('show');
            }
        });
    }
    
    // 页面加载时检查一次
    showItemsInViewport();
    
    // 滚动时检查
    window.addEventListener('scroll', showItemsInViewport);
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // 给当前点击的按钮添加active类
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // 先隐藏所有项目并添加缩小动画
            serverItems.forEach(item => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                item.classList.remove('show'); // 移除show类以重置动画
            });
            
            // 等待动画完成后重新筛选
            setTimeout(() => {
                // 显示或隐藏服务器项
                serverItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                        // 添加出现动画
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                            item.classList.add('show'); // 添加show类触发动画
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // 重新检查视口中的元素
                showItemsInViewport();
            }, 300);
        });
    });
});