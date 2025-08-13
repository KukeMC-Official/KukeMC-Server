// 服务器名称映射
const serverNames = {
    "kitbattle": "职业战争",
    "slime": "粘液空岛",
    "bedwars": "起床战争",
    "redstone": "纯净生存",
    "lobby": "大厅",
    "surret": "避暑山庄",
    "auth": "登录大厅",
    "funsurvival": "趣味生存",
    "bridgepractise": "搭路练习",
    "zombies": "僵尸末日",
    "creative": "创造家园",
    "murdermystery": "密室杀手"
};

async function fetchPlayerList() {
    try {
        const response = await fetch('https://api.kuke.ink/api/playerlist');
        const data = await response.json();

        const playerCountDiv = document.getElementById('playerCount');
        const playerListDiv = document.getElementById('playerList');
        const textContainer = document.getElementById('textContainer');
        const lastUpdateDiv = document.getElementById('lastUpdate');

        // 显示最后更新时间
        if (data.lastUpdate) {
            lastUpdateDiv.textContent = `最后更新: ${data.lastUpdate}`;
        }

        if (data.players && data.players.length > 0) {
            playerCountDiv.textContent = `在线玩家数量：${data.players.length}`;
            playerListDiv.innerHTML = '';

            data.players.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player';

                const playerAvatar = document.createElement('div');
                playerAvatar.className = 'player-avatar';

                const playerImage = document.createElement('img');
                playerImage.src = `https://crafthead.net/cube/${player.name}`;
                playerImage.alt = `${player.name}'s avatar`;
                playerImage.onerror = function() {
                    this.src = 'https://m.ccw.site/gandi_application/user_assets/2a6bb37880317d2bb5525ab560618e04.png';
                };

                const playerName = document.createElement('div');
                playerName.className = 'player-name';
                playerName.textContent = player.name;

                const playerServer = document.createElement('div');
                playerServer.className = 'player-server';
                playerServer.textContent = serverNames[player.server] || player.server;

                playerAvatar.appendChild(playerImage);
                playerDiv.appendChild(playerAvatar);
                playerDiv.appendChild(playerName);
                
                // 添加信息容器
                const playerInfo = document.createElement('div');
                playerInfo.className = 'player-info';
                
                // 添加延迟显示
                if (player.ping !== undefined) {
                    const playerPing = document.createElement('div');
                    playerPing.className = 'player-ping';
                    
                    // 根据延迟值设置不同的颜色类
                    if (player.ping <= 100) {
                        playerPing.classList.add('ping-good');
                    } else if (player.ping <= 200) {
                        playerPing.classList.add('ping-medium');
                    } else {
                        playerPing.classList.add('ping-bad');
                    }
                    
                    playerPing.textContent = `${player.ping}ms`;
                    playerInfo.appendChild(playerPing);
                }
                
                playerInfo.appendChild(playerServer);
                playerDiv.appendChild(playerInfo);
                playerListDiv.appendChild(playerDiv);
            });
        } else {
            playerCountDiv.textContent = '在线玩家数量：0';
            playerListDiv.textContent = '服务器里暂时没有人 ＞﹏＜';
        }
    } catch (error) {
        console.error('Error fetching player list:', error);
        document.getElementById('playerList').textContent = 'Failed to load player list.';
    }
}

// Fetch player list when the page loads
window.onload = fetchPlayerList;

// 每10秒自动刷新一次数据
setInterval(fetchPlayerList, 10000);