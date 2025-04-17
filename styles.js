// DOM元素加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载作品集项目
    loadPortfolioItems();
    
    // 初始化导航栏功能
    initNavigation();
    
    // 初始化过滤按钮功能
    initFilterButtons();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 初始化弹窗功能
    initModal();
});

// 加载作品集项目
function loadPortfolioItems() {
    const portfolioGrid = document.getElementById('portfolio-items');
    
    // 清空现有内容
    portfolioGrid.innerHTML = '';
    
    // 遍历项目数据并创建HTML元素
    projects.forEach(project => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = `portfolio-item ${project.category}`;
        portfolioItem.setAttribute('data-id', project.id);
        
        portfolioItem.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="portfolio-img">
            <div class="portfolio-info">
                <h3>${project.title}</h3>
                <p class="portfolio-category">${getCategoryName(project.category)}</p>
            </div>
        `;
        
        // 添加点击事件，打开弹窗
        portfolioItem.addEventListener('click', () => {
            openModal(project);
        });
        
        portfolioGrid.appendChild(portfolioItem);
    });
}

// 根据类别代码获取类别名称
function getCategoryName(categoryCode) {
    switch(categoryCode) {
        case 'ui':
            return 'UI设计';
        case 'graphic':
            return '平面设计';
        case 'branding':
            return '品牌设计';
        default:
            return '其他';
    }
}

// 初始化导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    
    // 汉堡菜单点击事件
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // 导航链接点击事件
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            
            // 移除所有链接的active类
            links.forEach(l => l.classList.remove('active'));
            
            // 给当前点击的链接添加active类
            link.classList.add('active');
        });
    });
    
    // 滚动时导航栏变化
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 100);
        
        // 更新当前活动链接
        updateActiveNavLink();
    });
}

// 更新当前活动导航链接
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if(window.scrollY >= (sectionTop - sectionHeight/3)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// 初始化过滤按钮功能
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 给当前点击的按钮添加active类
            button.classList.add('active');
            
            // 获取过滤类别
            const filterValue = button.getAttribute('data-filter');
            
            // 过滤作品项目
            portfolioItems.forEach(item => {
                if(filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    
                    // 添加动画效果
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    // 添加延迟以便动画完成
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 500);
                }
            });
        });
    });
}

// 初始化平滑滚动
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const offsetTop = targetElement.offsetTop;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 初始化弹窗功能
function initModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // 关闭按钮点击事件
    closeBtn.addEventListener('click', () => {
        closeModal();
    });
    
    // 点击弹窗外部关闭弹窗
    window.addEventListener('click', (e) => {
        if(e.target === modal) {
            closeModal();
        }
    });
    
    // ESC键关闭弹窗
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
            closeModal();
        }
    });
}

// 打开弹窗
function openModal(project) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modal-title');
    const modalImages = document.getElementById('modal-images');
    const modalDescription = document.getElementById('modal-description');
    const modalLink = document.getElementById('modal-link');
    
    // 设置弹窗内容
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalLink.href = project.link;
    
    // 清空现有图片
    modalImages.innerHTML = '';
    
    // 添加项目图片
    project.detailImages.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = project.title;
        modalImages.appendChild(img);
    });
    
    // 显示弹窗
    modal.style.display = 'block';
    
    // 防止页面滚动
    document.body.style.overflow = 'hidden';
}

// 关闭弹窗
function closeModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    
    // 恢复页面滚动
    document.body.style.overflow = 'auto';
} 
