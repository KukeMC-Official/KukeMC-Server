// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载导航栏和页脚
    $('#navbar').load('navbar.html');
    $('#footer').load('footer.html');
    
    // 初始化经验条为NaN状态
    const expLevel = document.getElementById('expLevel');
    expLevel.textContent = 'NaN';
    
    // 签到按钮功能
    const checkinBtn = document.getElementById('checkinBtn');
    const checkinStatus = document.getElementById('checkinStatus');
    
    checkinBtn.addEventListener('click', function() {
        // 模拟签到功能
        checkinBtn.disabled = true;
        checkinBtn.textContent = '签到中...';
        
        // 模拟网络请求延迟
        setTimeout(function() {
            checkinStatus.textContent = '今日已签到！获得10金币和50经验（哈哈哈骗你的）';
            checkinStatus.style.color = '#4ade80';
            checkinBtn.textContent = '已签到';
            
            // 模拟经验条增加
            updateExpBar(30); // 假设增加到30%
        }, 1000);
    });
    
    // 金币兑换游戏币
    const exchangeCoinsBtn = document.getElementById('exchangeCoins');
    exchangeCoinsBtn.addEventListener('click', function() {
        alert('金币兑换游戏币功能即将上线，敬请期待！ 傻逼kuke快做');
    });
    
    // 兑换称号
    const exchangeTitleBtn = document.getElementById('exchangeTitle');
    exchangeTitleBtn.addEventListener('click', function() {
        alert('兑换称号【签到の神】需要114514金币，当前功能即将上线 傻逼kuke快做！');
    });
});

// 更新经验条函数
function updateExpBar(percentage) {
    const expBar = document.getElementById('expBar');
    if (percentage >= 0 && percentage <= 100) {
        expBar.style.width = percentage + '%';
    }
}