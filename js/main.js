// Cyberably - Main JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('active');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navigation Background Change on Scroll
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for Section Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all sections with reveal class
document.querySelectorAll('.reveal').forEach(element => {
    observer.observe(element);
});

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        start += increment;
        
        if (start >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(start));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                animateCounter(stat, target);
            });
            
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe stats section
const statsSection = document.querySelector('.grid.grid-cols-3.gap-6');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formValues = {};
        
        for (let [key, value] of formData.entries()) {
            formValues[key] = value;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Show success message
            showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Enroll Button Handling
const enrollButtons = document.querySelectorAll('.enroll-btn');

enrollButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get course name from parent card
        const courseCard = this.closest('.course-card');
        const courseName = courseCard.querySelector('h3').textContent;
        
        // Show notification
        showNotification(`Great choice! You've selected "${courseName}". Please scroll down to the contact form to complete your enrollment.`, 'success');
        
        // Scroll to contact form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = contactSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Pre-fill course selection
            setTimeout(() => {
                const courseSelect = document.querySelector('select');
                if (courseSelect) {
                    const options = Array.from(courseSelect.options);
                    const matchingOption = options.find(option => 
                        option.text.includes(courseName.split(' ').slice(0, 3).join(' '))
                    );
                    if (matchingOption) {
                        courseSelect.value = matchingOption.value;
                        courseSelect.focus();
                    }
                }
            }, 1000);
        }
    });
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-24 right-4 z-50 max-w-md ${type === 'success' ? 'success-message' : 'error-message'}`;
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-3 text-xl"></i>
                <span>${message}</span>
            </div>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

// Add slideOutRight animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`;
document.head.appendChild(style);

// Course Card Hover Effects
const courseCards = document.querySelectorAll('.course-card');

courseCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Lazy Loading Images (if any are added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add Active State to Navigation on Scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navHeight = document.querySelector('nav').offsetHeight;
        
        if (window.pageYOffset >= (sectionTop - navHeight - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-cyber-blue', 'font-bold');
        
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-cyber-blue', 'font-bold');
        }
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        const scrolled = window.pageYOffset;
        const parallax = heroSection.querySelector('.relative.z-10');
        
        if (parallax && scrolled < heroSection.offsetHeight) {
            parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
});

// Add Animation Classes on Load
window.addEventListener('load', function() {
    // Fade in feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
});

// Back to Top Button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'fixed bottom-8 right-8 bg-cyber-blue text-cyber-dark w-12 h-12 rounded-full shadow-lg hover:bg-cyber-dark hover:text-white transition duration-300 z-40 opacity-0 pointer-events-none';
backToTopBtn.id = 'back-to-top';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
    }
});

backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Console Welcome Message
console.log('%c🛡️ Cyberably', 'font-size: 24px; font-weight: bold; color: #00d4ff;');
console.log('%cWelcome to our website! Interested in cybersecurity training?', 'font-size: 14px; color: #8b5cf6;');
console.log('%cContact us at: cyberably@gmail.com', 'font-size: 12px; color: #666;');

// Performance Monitoring (Development Only)
if (window.performance) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}
