$(document).ready(function() {
    
    // 确保页脚在页面底部
    function adjustFooterPosition() {
        const body = document.body;
        const html = document.documentElement;
        const height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        
        if (height <= window.innerHeight) {
            document.body.style.minHeight = '100vh';
            document.body.style.display = 'flex';
            document.body.style.flexDirection = 'column';
            document.querySelector('.main-content').style.flex = '1';
            document.getElementById('footer').style.marginTop = 'auto';
        }
    }
    
    // 页面加载完成后调整页脚位置
    setTimeout(adjustFooterPosition, 100);
    
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('skinFile');
    const form = document.getElementById('skinUploadForm');
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('uploadLoading');
    const resultContainer = document.getElementById('resultContainer');
    const skinPreview = document.getElementById('skinPreview');
    const commandBox = document.getElementById('commandBox');
    const copyButton = document.getElementById('copyButton');
    const uploadAnother = document.getElementById('uploadAnother');
    const fileInfo = document.getElementById('fileInfo');
    const uploadButton = document.getElementById('uploadButton');
    
    // 点击上传区域选择文件
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 文件选择后的处理
    fileInput.addEventListener('change', function() {
        if (this.files.length) {
            const file = this.files[0];
            fileInfo.textContent = `已选择文件: ${file.name}`;
            fileInfo.style.display = 'block';
            uploadButton.disabled = false;
        } else {
            fileInfo.style.display = 'none';
            uploadButton.disabled = true;
        }
    });
    
    // 拖拽上传功能
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            // 触发change事件以更新文件信息
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    });
    
    // 表单提交处理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!fileInput.files.length) {
            showError('请选择一个皮肤文件');
            return;
        }
        
        const file = fileInput.files[0];
        if (!file.type.match('image.*')) {
            showError('请选择一个有效的图片文件');
            return;
        }
        
        uploadSkin(file);
    });
    
    // 上传皮肤函数
    function uploadSkin(file) {
        // 显示加载状态
        hideError();
        loading.style.display = 'block';
        form.style.display = 'none';
        
        const formData = new FormData();
        formData.append('image', file);
        
        fetch('https://img-api.kuke.ink/raw', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('上传失败');
            }
            return response.text();
        })
        .then(imageUrl => {
            // 显示结果
            // 在加载图片时显示加载动画
            const previewLoading = document.getElementById('previewLoading');
            previewLoading.style.display = 'block';
            skinPreview.style.display = 'none';
            
            // 创建一个新的图片对象来监听加载事件
            const img = new Image();
            img.onload = function() {
                // 图片加载完成后隐藏加载动画并显示图片
                previewLoading.style.display = 'none';
                skinPreview.style.display = 'block';
                skinPreview.src = imageUrl;
                // 上传完成后重新调整页脚位置
                adjustFooterPosition();
            };
            img.src = imageUrl;
            
            commandBox.textContent = `/skin url "${imageUrl}"`;
            loading.style.display = 'none';
            resultContainer.style.display = 'block';
        })
        .catch(error => {
            console.error('上传错误:', error);
            loading.style.display = 'none';
            form.style.display = 'block';
            showError('皮肤上传失败，请稍后重试');
        });
    }
    
    // 复制指令功能
    const clipboard = new ClipboardJS(copyButton, {
        text: function() {
            return commandBox.textContent;
        }
    });
    
    clipboard.on('success', function(e) {
        const originalText = copyButton.textContent;
        copyButton.textContent = '已复制!';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 2000);
        e.clearSelection();
    });
    
    // 重新上传功能
    uploadAnother.addEventListener('click', () => {
        resultContainer.style.display = 'none';
        form.style.display = 'block';
        fileInput.value = '';
        fileInfo.style.display = 'none';
        uploadButton.disabled = true;
    });
    
    // 错误处理函数
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function hideError() {
        errorMessage.style.display = 'none';
    }
});