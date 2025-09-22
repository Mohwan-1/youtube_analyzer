// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const apiModal = document.getElementById('api-modal');
const modalClose = document.getElementById('modal-close');
const loadingOverlay = document.getElementById('loading-overlay');
const apiForm = document.getElementById('api-form');
const faqItems = document.querySelectorAll('.faq-item');

// Form Step Elements
const videoUrlInput = document.getElementById('video-url');
const videoPreview = document.getElementById('video-preview');
const videoThumbnail = document.getElementById('video-thumbnail');
const videoTitle = document.getElementById('video-title');
const videoStats = document.getElementById('video-stats');
const nextStepBtn = document.getElementById('next-step');
const prevStepBtn = document.getElementById('prev-step');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');

// CTA Buttons
const startAnalysisButtons = document.querySelectorAll('#start-analysis, #final-start');
const openApiModalButtons = document.querySelectorAll('#open-api-modal, .guide-cta');
const showGuideButton = document.getElementById('show-guide');

// YouTube URL Validation and Processing
function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function validateYouTubeUrl(url) {
    const videoId = extractVideoId(url);
    return videoId !== null;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return Math.floor(num / 1000000) + '만';
    } else if (num >= 1000) {
        return Math.floor(num / 1000) + '천';
    }
    return num.toString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1일 전';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
    return `${Math.floor(diffDays / 365)}년 전`;
}

async function getVideoInfo(videoId) {
    // 실제 구현에서는 YouTube Data API를 사용
    // 여기서는 데모용 데이터를 반환
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                title: "🎮 최신 게임 리뷰 - 완전 솔직 후기",
                thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=480&h=360&fit=crop",
                viewCount: 125000,
                publishedAt: "2024-09-19T10:00:00Z",
                duration: "PT10M32S" // ISO 8601 duration format
            });
        }, 1000);
    });
}

// Video URL Input Handler
videoUrlInput.addEventListener('input', async (e) => {
    const url = e.target.value.trim();

    if (!url) {
        videoPreview.style.display = 'none';
        nextStepBtn.disabled = true;
        return;
    }

    if (!validateYouTubeUrl(url)) {
        videoPreview.style.display = 'none';
        nextStepBtn.disabled = true;
        e.target.style.borderColor = '#ef4444';
        return;
    }

    e.target.style.borderColor = '#22c55e';

    try {
        const videoId = extractVideoId(url);
        const videoInfo = await getVideoInfo(videoId);

        // 영상 정보 표시
        videoThumbnail.src = videoInfo.thumbnail;
        videoTitle.textContent = videoInfo.title;
        videoStats.textContent = `조회수 ${formatNumber(videoInfo.viewCount)}회 • ${formatDate(videoInfo.publishedAt)}`;

        videoPreview.style.display = 'block';
        nextStepBtn.disabled = false;

        showNotification('✅ 영상 정보를 성공적으로 가져왔습니다!', 'success');

    } catch (error) {
        console.error('영상 정보 가져오기 실패:', error);
        showNotification('영상 정보를 가져오는데 실패했습니다. URL을 확인해주세요.', 'error');
        videoPreview.style.display = 'none';
        nextStepBtn.disabled = true;
    }
});

// Step Navigation
nextStepBtn.addEventListener('click', () => {
    step1.style.display = 'none';
    step2.style.display = 'block';
});

prevStepBtn.addEventListener('click', () => {
    step2.style.display = 'none';
    step1.style.display = 'block';
});

// Reset modal when opening
function openModal() {
    apiModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset to first step
    step1.style.display = 'block';
    step2.style.display = 'none';
    videoPreview.style.display = 'none';
    nextStepBtn.disabled = true;

    // Clear inputs
    videoUrlInput.value = '';
    videoUrlInput.style.borderColor = '#e2e8f0';

    // Focus on video URL input
    setTimeout(() => {
        videoUrlInput.focus();
    }, 300);
}

// Mobile Navigation
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Modal functionality (기존 openModal 함수는 위에서 새로 정의됨)

function closeModal() {
    apiModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Open modal events
openApiModalButtons.forEach(button => {
    button.addEventListener('click', openModal);
});

startAnalysisButtons.forEach(button => {
    button.addEventListener('click', openModal);
});

// Close modal events
modalClose.addEventListener('click', closeModal);

apiModal.addEventListener('click', (e) => {
    if (e.target === apiModal) {
        closeModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && apiModal.classList.contains('active')) {
        closeModal();
    }
});

// Show guide button
showGuideButton.addEventListener('click', () => {
    closeModal();
    document.querySelector('#guide').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// API Form submission
apiForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const videoUrl = videoUrlInput.value.trim();
    const apiKey = document.getElementById('api-key').value.trim();

    // Validate inputs
    if (!videoUrl || !validateYouTubeUrl(videoUrl)) {
        showNotification('유효한 YouTube 영상 URL을 입력해주세요.', 'error');
        return;
    }

    if (!apiKey) {
        showNotification('API 키를 입력해주세요.', 'error');
        return;
    }

    if (apiKey.length < 20) {
        showNotification('유효하지 않은 API 키 형식입니다.', 'error');
        return;
    }

    // Show loading
    loadingOverlay.classList.add('active');
    loadingOverlay.querySelector('.loading-content p').textContent = '영상을 분석하고 있습니다...';
    closeModal();

    try {
        // Simulate API connection test and video analysis
        await simulateVideoAnalysis(extractVideoId(videoUrl), apiKey);

        // Hide loading
        loadingOverlay.classList.remove('active');

        // Show success message
        showNotification('🎉 영상 분석이 완료되었습니다!', 'success');

        // Store data (in real app, this would be securely handled)
        localStorage.setItem('youtube_api_key', apiKey);
        localStorage.setItem('analyzed_video_url', videoUrl);

        // Show analysis results
        setTimeout(() => {
            showAnalysisResults();
        }, 1500);

    } catch (error) {
        loadingOverlay.classList.remove('active');
        showNotification('분석에 실패했습니다. API 키와 영상 URL을 확인해주세요.', 'error');
    }
});

// Simulate video analysis
function simulateVideoAnalysis(videoId, apiKey) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simple validation - in real app this would test actual YouTube API and perform analysis
            if (apiKey.includes('test') || apiKey.length > 30) {
                resolve({
                    videoId,
                    analysisComplete: true,
                    retentionData: generateMockRetentionData()
                });
            } else {
                reject(new Error('Invalid API key or video analysis failed'));
            }
        }, 3000);
    });
}

function generateMockRetentionData() {
    return {
        dropPoints: [
            { time: 207, percentage: 15, reason: "갑작스러운 화면 전환" },
            { time: 445, percentage: 22, reason: "긴 설명 구간" },
            { time: 623, percentage: 12, reason: "음성 품질 저하" }
        ],
        improvements: [
            { time: 207, suggestion: "부드러운 전환 효과 추가" },
            { time: 445, suggestion: "시각적 요소로 설명 보완" },
            { time: 623, suggestion: "오디오 후처리 개선" }
        ]
    };
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 4000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        max-width: 400px;
        font-size: 14px;
        line-height: 1.5;
    `;

    // Add to document
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Show analysis results (simulated)
function showAnalysisResults() {
    const analysisModal = document.createElement('div');
    analysisModal.className = 'modal';
    analysisModal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>🎉 분석 준비 완료!</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🚀</div>
                    <h3 style="margin-bottom: 16px; color: #1d4ed8;">API 연결이 완료되었습니다!</h3>
                    <p style="color: #64748b; margin-bottom: 30px;">
                        이제 YouTube 영상을 분석할 수 있어요. 실제 서비스에서는 여기서 영상 URL을 입력하거나
                        채널의 최근 영상 목록을 볼 수 있습니다.
                    </p>
                    <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 20px;">
                        <strong>데모 모드</strong><br>
                        이것은 데모 페이지입니다. 실제 분석 기능은 백엔드 서버와 AI 모델이 필요합니다.
                    </div>
                    <button class="cta-button primary" style="margin-right: 10px;">데모 분석 보기</button>
                    <button class="cta-button secondary modal-close-btn">닫기</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(analysisModal);
    analysisModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Close functionality
    const closeButtons = analysisModal.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            analysisModal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                document.body.removeChild(analysisModal);
            }, 300);
        });
    });

    // Demo analysis button
    analysisModal.querySelector('.cta-button.primary').addEventListener('click', () => {
        analysisModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            document.body.removeChild(analysisModal);
            document.querySelector('.demo-results').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    });
}

// FAQ functionality
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQ items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active', !isActive);
    });
});

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animationElements = [
        { selector: '.problem-card', class: 'fade-in' },
        { selector: '.feature-card', class: 'fade-in' },
        { selector: '.step', class: 'fade-in' },
        { selector: '.guide-step:nth-child(odd)', class: 'slide-in-left' },
        { selector: '.guide-step:nth-child(even)', class: 'slide-in-right' }
    ];

    animationElements.forEach(({ selector, class: className }) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add(className);
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    });
}

// Hero dashboard animations
function initHeroDashboardAnimations() {
    const dashboardPreview = document.querySelector('.dashboard-preview');

    if (dashboardPreview) {
        // Animate chart drawing
        const chartLine = document.querySelector('.chart-line');
        if (chartLine) {
            setTimeout(() => {
                chartLine.style.animation = 'drawChart 2s ease-out';
            }, 1000);
        }

        // Animate drop point pulsing
        const dropMarker = document.querySelector('.drop-marker');
        if (dropMarker) {
            setTimeout(() => {
                dropMarker.style.animation = 'pulse 2s infinite';
            }, 2000);
        }

        // Animate insight cards appearing
        const insightCards = document.querySelectorAll('.insight-card');
        insightCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease-out';

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 2500 + (index * 200));
            }, 0);
        });
    }
}

// Typing animation for hero title
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const text = heroTitle.innerHTML;

    // Only run on desktop for better performance
    if (window.innerWidth > 768) {
        heroTitle.innerHTML = '';
        heroTitle.style.borderRight = '2px solid #2563eb';

        let index = 0;
        const speed = 50;

        function typeWriter() {
            if (index < text.length) {
                heroTitle.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeWriter, speed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        }

        // Start typing animation after page load
        setTimeout(typeWriter, 500);
    }
}

// Parallax scrolling effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Count up animation (가격 기능 제거됨)
function initCountUpAnimation() {
    // 가격 기능이 제거되어 더 이상 필요하지 않음
    return;
}

// Form validation enhancements
function enhanceFormValidation() {
    const apiKeyInput = document.getElementById('api-key');

    apiKeyInput.addEventListener('input', (e) => {
        const value = e.target.value;
        const isValid = value.length >= 20;

        // Visual feedback
        if (value.length > 0) {
            e.target.style.borderColor = isValid ? '#22c55e' : '#ef4444';
        } else {
            e.target.style.borderColor = '#e2e8f0';
        }
    });

    // Paste event handling
    apiKeyInput.addEventListener('paste', (e) => {
        setTimeout(() => {
            const value = e.target.value.trim();
            if (value.length >= 20) {
                showNotification('API 키가 입력되었습니다. 연결 테스트를 시작하세요!', 'info');
            }
        }, 100);
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Log Core Web Vitals
    if ('web-vital' in window) {
        import('https://unpkg.com/web-vitals?module').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
}

// Easter egg - Konami code
function initEasterEgg() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let userInput = [];

    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);

        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }

        if (userInput.join('') === konamiCode.join('')) {
            showNotification('🎉 축하합니다! 숨겨진 기능을 발견했어요! (개발자 모드 활성화)', 'success');
            document.body.classList.add('developer-mode');

            // Add some fun effects
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 4000);
        }
    });
}

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }

    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
        opacity: 0.8;
        transition: opacity 0.2s;
    }

    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initHeroDashboardAnimations();
    enhanceFormValidation();
    initPerformanceMonitoring();
    initEasterEgg();

    // Delay heavy animations for better performance
    setTimeout(() => {
        if (window.innerWidth > 768) {
            // initTypingAnimation();
            initParallaxEffect();
        }
        initCountUpAnimation();
    }, 1000);
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.classList.add('tab-hidden');
    } else {
        // Resume animations when tab becomes visible
        document.body.classList.remove('tab-hidden');
    }
});

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle connection status
window.addEventListener('online', () => {
    showNotification('인터넷 연결이 복구되었습니다.', 'success');
});

window.addEventListener('offline', () => {
    showNotification('인터넷 연결이 끊어졌습니다.', 'error');
});

// Preload critical images
function preloadImages() {
    const criticalImages = [
        './white@2x.png',
        './android-icon-48x48.png'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // This would integrate with Google Analytics or other analytics services
    console.log('Event tracked:', eventName, properties);

    // Example: gtag('event', eventName, properties);
}

// Track important user interactions
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cta-button')) {
        trackEvent('cta_click', {
            button_text: e.target.textContent.trim(),
            section: e.target.closest('section')?.className || 'unknown'
        });
    }
});

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);

    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;

        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(maxScrollDepth)) {
            trackEvent('scroll_depth', { depth: maxScrollDepth });
        }
    }
});

// Export functions for potential use by other scripts
window.YouTubeAnalyzer = {
    openModal,
    closeModal,
    showNotification,
    trackEvent
};