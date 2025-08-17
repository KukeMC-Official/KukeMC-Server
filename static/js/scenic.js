// Scenic Pictures Auto Scroll
document.addEventListener('DOMContentLoaded', function() {
    // 图片数据
    const scenicImages = [
        {
            src: "https://m.ccw.site/gandi_application/user_assets/a0c2de8fe9a53e81deaf11fc19da6d52.jpg",
            title: "主城风景",
            description: "主城一处美好风光"
        },
        {
            src: "https://m.ccw.site/gandi_application/user_assets/0e7ef28c24e3ee63b7c9f31362e12803.jpg",
            title: "主城风景",
            description: "主城一处美好风光"
        },
        {
            src: "https://m.ccw.site/gandi_application/user_assets/caa27402a39899ce10964ecd2a544161.jpg",
            title: "其他风景",
            description: "粘液空岛-- 大唐不夜城"
        },
        {
            src: "https://m.ccw.site/gandi_application/user_assets/a17b7e2f515de9ee70f8e5b9d5585a0f.jpg",
            title: "其他风景",
            description: "机械动力-- 混凝土量产流水线"
        },
        {
            src: "https://m.ccw.site/gandi_application/user_assets/682263843b8e631893afa944f1dc85e8.jpg",
            title: "玩家合照",
            description: "职业战争-- 2024 跨年晚会"
        },
        {
            src: "https://cdn.nlark.com/yuque/0/2025/jpeg/25796891/1754700888552-413f40f0-6f16-49c4-8c65-0be2957f611e.jpeg",
            title: "玩家建筑",
            description: "趣味生存-- by taoliu666"
        },
        {
            src: "https://cdn.nlark.com/yuque/0/2025/jpeg/25796891/1754700888609-887adb7c-3f4b-45cb-8207-415d5f54c423.jpeg",
            title: "玩家建筑",
            description: "趣味生存-- by taoliu666"
        },
        {
            src: "https://cdn.nlark.com/yuque/0/2025/jpeg/25796891/1754700888845-b77ddfaa-6e73-4b80-9c28-84a998013407.jpeg",
            title: "玩家建筑",
            description: "趣味生存-- by taoliu666"
        },
        {
            src: "https://cdn.nlark.com/yuque/0/2025/jpeg/25796891/1754700888622-9f795130-e070-4529-bed7-4ffd73440611.jpeg",
            title: "玩家建筑",
            description: "趣味生存-- by taoliu666"
        },
        {
            src: "https://cdn.nlark.com/yuque/0/2025/jpeg/25796891/1755425471434-cdc637e8-58d3-4afe-8050-b69d48b9087f.jpeg",
            title: "玩家建筑",
            description: "趣味生存-- by taoliu666"
        },
        {
            src: "https://cdn.nlark.com/yuque/0/2025/png/25796891/1755425842611-fd33767e-53ab-4473-80cb-da06b71224d9.png",
            title: "主城风景",
            description: "趣味生存-- 主城风景"
        },
        {
            src: "https://cdn.nlark.com/yuque/0/2025/png/25796891/1755426230177-045a148b-2f81-414d-b398-52d0d16f4c69.png",
            title: "主城风景",
            description: "趣味生存-- 主城风景"
        },
        {
            src: "https://cdn.nlark.com/yuque/0/2025/png/25796891/1755426219735-d84afeb8-54ed-46a2-95be-8922bf7c30c0.png",
            title: "玩家合照",
            description: "主大厅-- 2025 跨年晚会"
        },
        {
            src: "https://cdn.nlark.com/yuque/0/2025/png/25796891/1755426204574-d319eff5-b7de-4e8b-9e61-b80478fe672d.png",
            title: "玩家合照",
            description: "主大厅-- 2025 跨年晚会"
        }
    ];

    // 检查风景欣赏板块是否存在
    const scenicSection = document.querySelector('.scenic-pictures');
    if (!scenicSection) {
        return;
    }

    const topRow = document.querySelector('.scenic-row.top-row');
    const bottomRow = document.querySelector('.scenic-row.bottom-row');
    
    // 检查元素是否存在
    if (!topRow || !bottomRow) {
        return;
    }
    
    // 清空现有内容
    topRow.innerHTML = '';
    bottomRow.innerHTML = '';
    
    // 生成顶部行图片
    scenicImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'scenic-item';
        item.innerHTML = `
            <a class="popup-with-move-anim" href="#scenic-lightbox-${index}">
                <div class="scenic-overlay">
                    <span>${image.title}</span>
                </div>
                <div class="image-description">${image.description}</div>
                <img src="${image.src}" alt="${image.title}">
            </a>
        `;
        topRow.appendChild(item);
    });
    
    // 生成底部行图片（倒序）
    [...scenicImages].reverse().forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'scenic-item';
        item.innerHTML = `
            <a class="popup-with-move-anim" href="#scenic-lightbox-${scenicImages.length - index - 1}">
                <div class="scenic-overlay">
                    <span>${image.title}</span>
                </div>
                <div class="image-description">${image.description}</div>
                <img src="${image.src}" alt="${image.title}">
            </a>
        `;
        bottomRow.appendChild(item);
    });
    
    // 为顶部行添加重复项以实现无缝循环
    scenicImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'scenic-item';
        item.innerHTML = `
            <a class="popup-with-move-anim" href="#scenic-lightbox-${index}">
                <div class="scenic-overlay">
                    <span>${image.title}</span>
                </div>
                <div class="image-description">${image.description}</div>
                <img src="${image.src}" alt="${image.title}">
            </a>
        `;
        topRow.appendChild(item);
    });
    
    // 为底部行添加重复项以实现无缝循环
    [...scenicImages].reverse().forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'scenic-item';
        item.innerHTML = `
            <a class="popup-with-move-anim" href="#scenic-lightbox-${scenicImages.length - index - 1}">
                <div class="scenic-overlay">
                    <span>${image.title}</span>
                </div>
                <div class="image-description">${image.description}</div>
                <img src="${image.src}" alt="${image.title}">
            </a>
        `;
        bottomRow.appendChild(item);
    });
    
    // 动态生成lightbox
    let existingLightboxContainer = document.getElementById('scenic-lightbox-container');
    if (existingLightboxContainer) {
        existingLightboxContainer.remove();
    }
    
    const lightboxContainer = document.createElement('div');
    lightboxContainer.id = 'scenic-lightbox-container';
    scenicImages.forEach((image, index) => {
        const lightbox = document.createElement('div');
        lightbox.id = `scenic-lightbox-${index}`;
        lightbox.className = 'lightbox-basic zoom-anim-dialog mfp-hide';
        lightbox.innerHTML = `
            <div class="row">
                <button title="Close (Esc)" type="button" class="mfp-close x-button">×</button>
                <div class="col-lg-8">
                    <img class="img-fluid" src="${image.src}" alt="${image.title}">
                </div>
                <div class="col-lg-4">
                    <h3>${image.title}</h3>
                    <hr class="line-heading">
                    <p>${image.description}</p>
                    <a class="btn-outline-reg mfp-close as-button" href="#picture">返回</a> 
                </div>
            </div>
        `;
        lightboxContainer.appendChild(lightbox);
    });
    
    document.body.appendChild(lightboxContainer);
    // 初始化Magnific Popup
    setTimeout(() => {
        if (typeof jQuery !== 'undefined' && typeof jQuery.fn.magnificPopup !== 'undefined') {
            jQuery('.popup-with-move-anim').magnificPopup({
                type: 'inline',
                fixedContentPos: false,
                fixedBgPos: true,
                overflowY: 'auto',
                closeBtnInside: true,
                preloader: false,
                midClick: true,
                removalDelay: 300,
                mainClass: 'my-mfp-slide-bottom'
            });
            console.log('Magnific Popup initialized');
        }
    }, 100);
});