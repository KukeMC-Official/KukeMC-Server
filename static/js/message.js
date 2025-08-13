// 安全转义函数
const escapeHtml = (unsafe) => {
    return unsafe.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
};

// 安全内容格式化（保留换行）
const safeContentFormat = (text) => {
    return escapeHtml(text).replace(/\n/g, '<br>');
};

// 管理员相关功能
const ADMIN_KEY_STORAGE = 'admin_key';
let isAdmin = false;

// 管理员登录处理
async function handleAdminLogin() {
    const key = prompt('请输入管理员密钥：');
    if (!key) return;

    try {
        const response = await fetch('https://api.kuke.ink/api/message/admin/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key })
        });

        if (response.ok) {
            localStorage.setItem(ADMIN_KEY_STORAGE, key);
            alert('管理员验证成功！');
            loadMessages(); // 重新加载消息
        } else {
            alert('验证失败，请检查密钥');
        }
    } catch (error) {
        console.error('验证请求失败:', error);
        alert('验证服务不可用');
    }
}

// 删除留言功能
async function deleteMessage(messageId) {
    if (!confirm('确定要删除这条留言吗？')) return;

    const adminKey = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (!adminKey) {
        alert('请先登录管理员账号');
        return;
    }

    try {
        const response = await fetch(`https://api.kuke.ink/api/message/${messageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminKey}`
            }
        });

        if (response.ok) {
            alert('删除成功！');
            loadMessages(); // 刷新列表
        } else {
            alert(`删除失败: ${await response.text()}`);
        }
    } catch (error) {
        console.error('删除请求失败:', error);
        alert('删除操作失败，请检查网络');
    }
}

// 时间戳转日期格式
function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\//g, '-');
}

// 处理头像加载失败
function handleAvatarError(img) {
    img.onerror = null;
    img.src = `https://crafthead.net/cube/MHF_Steve`;
}

// 创建留言元素
function createMessageElement(message) {
    const element = document.createElement('div');
    element.className = 'message-item' + (message.parent_id ? ' reply-item' : '');
    element.id = `msg-${message.id}`;
    
    const adminKey = localStorage.getItem(ADMIN_KEY_STORAGE);
    const showDelete = adminKey !== null;
    
    const encodedName = encodeURIComponent(message.player);
    const avatarUrl = `https://crafthead.net/cube/${encodedName}`;

    // 添加回复标识
    const replyIndicator = message.parent_id ? 
        `<span class="reply-to">> 回复 <a href="#msg-${message.parent_id}" style="color: #39ad66;">#${message.parent_id}</a></span>` : 
        '';

    element.innerHTML = `
        <img class="avatar" 
             src="${avatarUrl}" 
             alt="${message.player}的头像"
             onerror="handleAvatarError(this)">
        <div class="message-content">
            <div class="user-header">
                <div>
                    <span class="username">${message.player}</span>
                    <span class="message-id">#${message.id}</span>
                    ${replyIndicator}
                    ${showDelete ? 
                        `<button class="delete-btn" 
                            onclick="deleteMessage(${message.id})">
                            删除
                        </button>` : ''}
                </div>
                <span class="message-time">${formatTimestamp(message.timestamp)}</span>
            </div>
            <p class="message-text">${safeContentFormat(message.content)}</p>
        </div>
    `;

    return element;
}

// 初始化事件监听
document.getElementById('adminLogin').addEventListener('click', handleAdminLogin);

// 页面加载时检查本地存储
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem(ADMIN_KEY_STORAGE)) {
        loadMessages();
    }
});

// 加载留言数据
async function loadMessages() {
    try {
        const response = await fetch('https://api.kuke.ink/api/message/read');
        const messages = await response.json();
        const container = document.getElementById('messageContainer');
        container.innerHTML = '';

        // 创建留言映射表和根留言数组
        const messageMap = new Map();
        const rootMessages = [];

        // 第一次遍历：建立映射
        messages.forEach(msg => {
            messageMap.set(msg.id, msg);
            msg.replies = [];
        });

        // 第二次遍历：建立层级关系
        messages.forEach(msg => {
            if (msg.parent_id) {
                const parent = messageMap.get(msg.parent_id);
                if (parent) {
                    parent.replies.push(msg);
                }
            } else {
                rootMessages.push(msg);
            }
        });

        // 按时间倒序排序并渲染
        rootMessages.sort((a, b) => b.timestamp - a.timestamp)
            .forEach(msg => {
                container.appendChild(renderMessageWithReplies(msg));
            });

    } catch (error) {
        console.error('加载留言失败:', error);
        const container = document.getElementById('messageContainer');
        container.innerHTML = `
            <div class="error">
                😢 留言加载失败，请稍后刷新重试<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

function renderMessageWithReplies(message, level = 0) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper';
    
    // 限制最大层级为3，超过3层的回复平铺显示
    const effectiveLevel = Math.min(level, 2);
    wrapper.style.marginLeft = effectiveLevel * 20 + 'px';
    
    // 只在3层以内显示层级指示线
    if (level > 0 && level <= 2) {
        const indicator = document.createElement('div');
        indicator.className = 'level-indicator';
        wrapper.appendChild(indicator);
    }

    wrapper.appendChild(createMessageElement(message));
    
    // 递归渲染回复
    if (message.replies && message.replies.length > 0) {
        message.replies.sort((a, b) => a.timestamp - b.timestamp)
            .forEach(reply => {
                wrapper.appendChild(renderMessageWithReplies(reply, level + 1));
            });
    }

    return wrapper;
}

loadMessages();

// 每60秒自动刷新
setInterval(loadMessages, 60000);