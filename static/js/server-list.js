// 服务器分类筛选功能
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const serverItems = document.querySelectorAll('.server-item');
    
    // 添加动画效果到服务器项
    function animateItems() {
        serverItems.forEach((item, index) => {
            // 添加延迟显示效果
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                // 触发重排
                void item.offsetWidth;
                
                // 显示元素
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // 初始动画
    animateItems();
    
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
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            }, 300);
        });
    });
});