// ==========================================
// مطعم الذواقة - ملف JavaScript
// ==========================================

// ===== تشغيل عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    
    // تفعيل جميع الوظائف
    initNavbar();
    initScrollAnimations();
    initForms();
    initGallery();
    initSmoothScroll();
    
    // رسالة ترحيب في Console
    console.log('%c🍴 مرحباً بك في مطعم الذواقة! ', 'background: #ffc107; color: #1a1a1a; font-size: 20px; padding: 10px; border-radius: 5px;');
});

// ===== تفعيل شريط التنقل =====
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    // تغيير مظهر Navbar عند التمرير
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // إغلاق القائمة عند النقر على رابط (للشاشات الصغيرة)
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
    
    // تحديث الرابط النشط حسب القسم المرئي
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink);
}

// ===== تحديث الرابط النشط =====
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== التمرير السلس =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // تجاهل الروابط التي تفتح Modal
            if (href === '#' || this.hasAttribute('data-bs-toggle')) {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== رسوم متحركة عند التمرير =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // إضافة تأخير للعناصر المتعددة
                const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    }, observerOptions);
    
    // مراقبة عناصر القائمة
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.add('scroll-fade');
        observer.observe(item);
    });
    
    // مراقبة عناصر المعرض
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.add('scroll-fade');
        observer.observe(item);
    });
    
    // مراقبة البطاقات
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('scroll-fade');
        observer.observe(card);
    });
}

// ===== معالجة النماذج =====
function initForms() {
    
    // نموذج الحجز
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // الحصول على البيانات
            const formData = {
                name: document.getElementById('resName').value,
                phone: document.getElementById('resPhone').value,
                date: document.getElementById('resDate').value,
                time: document.getElementById('resTime').value,
                guests: document.getElementById('resGuests').value
            };
            
            // عرض رسالة نجاح
            showSuccessMessage('تم تأكيد حجزك بنجاح! سنتواصل معك قريباً.');
            
            // إغلاق النافذة المنبثقة
            const modal = bootstrap.Modal.getInstance(document.getElementById('reservationModal'));
            modal.hide();
            
            // إعادة تعيين النموذج
            reservationForm.reset();
            
            // في التطبيق الحقيقي، يتم إرسال البيانات للخادم
            console.log('بيانات الحجز:', formData);
        });
    }
    
    // نموذج التواصل
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // الحصول على البيانات
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // عرض رسالة نجاح
            showSuccessMessage('شكراً لتواصلك معنا! سنرد عليك في أقرب وقت.');
            
            // إعادة تعيين النموذج
            contactForm.reset();
            
            // في التطبيق الحقيقي، يتم إرسال البيانات للخادم
            console.log('بيانات التواصل:', formData);
        });
    }
    
    // تحقق من صحة التاريخ (يجب أن يكون في المستقبل)
    const dateInput = document.getElementById('resDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// ===== عرض رسالة النجاح =====
function showSuccessMessage(message) {
    // إنشاء عنصر التنبيه
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // إضافة إلى الصفحة
    document.body.appendChild(alertDiv);
    
    // إزالة بعد 5 ثواني
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
}

// ===== معرض الصور =====
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // فتح الصورة في نافذة جديدة أو lightbox
            showImageModal(this.src, this.alt);
        });
        
        // إضافة مؤشر اليد
        item.style.cursor = 'pointer';
    });
}

// ===== عرض الصورة في Modal =====
function showImageModal(imageSrc, imageAlt) {
    // إنشاء modal للصورة
    const modalHTML = `
        <div class="modal fade" id="imageModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content bg-transparent border-0">
                    <div class="modal-body p-0 position-relative">
                        <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
                                data-bs-dismiss="modal" style="z-index: 1;"></button>
                        <img src="${imageSrc}" alt="${imageAlt}" class="img-fluid rounded">
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // إضافة Modal إلى الصفحة
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    document.body.appendChild(tempDiv.firstElementChild);
    
    // فتح Modal
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
    
    // حذف Modal بعد الإغلاق
    document.getElementById('imageModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// ===== تأثيرات إضافية للأزرار =====
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ===== عداد الأرقام المتحرك =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===== تحميل كسول للصور =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== حفظ تفضيلات المستخدم =====
function saveUserPreference(key, value) {
    try {
        localStorage.setItem(`restaurant_${key}`, JSON.stringify(value));
    } catch (e) {
        console.warn('لا يمكن حفظ التفضيلات:', e);
    }
}

function getUserPreference(key) {
    try {
        const value = localStorage.getItem(`restaurant_${key}`);
        return value ? JSON.parse(value) : null;
    } catch (e) {
        console.warn('لا يمكن قراءة التفضيلات:', e);
        return null;
    }
}

// ===== تتبع تفاعل المستخدم (Analytics) =====
function trackEvent(category, action, label) {
    // في التطبيق الحقيقي، يتم إرسال البيانات لـ Google Analytics
    console.log('تتبع الحدث:', { category, action, label });
}

// تتبع النقرات على الأزرار
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        trackEvent('Button', 'Click', buttonText);
    });
});

// ===== معالجة الأخطاء العامة =====
window.addEventListener('error', function(e) {
    console.error('حدث خطأ:', e.error);
});

// ===== تحسين الأداء =====
// Debounce function للأحداث المتكررة
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// استخدام debounce للتمرير
const handleScroll = debounce(() => {
    updateActiveLink();
}, 100);

window.addEventListener('scroll', handleScroll);

// ===== إضافة تأثير Parallax للـ Hero =====
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const scrolled = window.scrollY;
        heroSection.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// ===== زر العودة لأعلى الصفحة =====
function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="bi bi-arrow-up"></i>';
    button.className = 'btn btn-warning position-fixed bottom-0 end-0 m-4 rounded-circle';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.display = 'none';
    button.style.zIndex = '9999';
    button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
}

// تفعيل زر العودة لأعلى
createBackToTopButton();

// ===== طباعة رسالة عند مغادرة الصفحة =====
window.addEventListener('beforeunload', function() {
    console.log('شكراً لزيارتك! نتمنى رؤيتك قريباً 🍴');
});
