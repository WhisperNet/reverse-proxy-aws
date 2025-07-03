// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // Add animation to goal cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe goal cards for animation
  document.querySelectorAll('.goal-card').forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

  // Form validation and enhancement
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('submit', function (e) {
      // Basic validation
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#dc3545';

          // Remove error styling after user starts typing
          field.addEventListener('input', function () {
            this.style.borderColor = '#e9ecef';
          });
        } else {
          field.style.borderColor = '#28a745';
        }
      });

      if (!isValid) {
        e.preventDefault();
        showNotification('Please fill in all required fields', 'error');
      } else {
        showNotification('Goal created successfully!', 'success');
      }
    });
  });

  // Add interactive features to goal cards
  document.querySelectorAll('.goal-card').forEach((card) => {
    // Add hover effects
    card.addEventListener('mouseenter', function () {
      this.style.borderLeftWidth = '8px';
    });

    card.addEventListener('mouseleave', function () {
      this.style.borderLeftWidth = '5px';
    });

    // Handle complete/undo buttons
    const completeBtn = card.querySelector('.btn-success, .btn-warning');
    if (completeBtn) {
      completeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const isCompleted = this.classList.contains('btn-warning');

        if (isCompleted) {
          // Undo completion
          card.classList.remove('completed');
          this.classList.remove('btn-warning');
          this.classList.add('btn-success');
          this.innerHTML = '<i class="fas fa-check"></i> Complete';
          showNotification('Goal marked as incomplete', 'info');
        } else {
          // Mark as complete
          card.classList.add('completed');
          this.classList.remove('btn-success');
          this.classList.add('btn-warning');
          this.innerHTML = '<i class="fas fa-undo"></i> Undo';
          showNotification('Goal completed! 🎉', 'success');

          // Add confetti effect
          createConfetti();
        }
      });
    }
  });

  // Add loading states to buttons
  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('click', function () {
      if (this.type === 'submit' || this.closest('form')) {
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        this.disabled = true;

        // Re-enable after a short delay (for demo purposes)
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
        }, 1000);
      }
    });
  });
});

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

  notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;

  notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0.25rem;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Add close functionality
  notification
    .querySelector('.notification-close')
    .addEventListener('click', () => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
  };
  return icons[type] || icons.info;
}

function getNotificationColor(type) {
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
  };
  return colors[type] || colors.info;
}

// Confetti animation for goal completion
function createConfetti() {
  const colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#f9ca24',
    '#f0932b',
    '#eb4d4b',
    '#6c5ce7',
  ];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
  }
}

function createConfettiPiece(color) {
  const confetti = document.createElement('div');
  confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${color};
        top: -10px;
        left: ${Math.random() * window.innerWidth}px;
        z-index: 10000;
        pointer-events: none;
        border-radius: 50%;
    `;

  document.body.appendChild(confetti);

  const animation = confetti.animate(
    [
      {
        transform: 'translateY(0) rotate(0deg)',
        opacity: 1,
      },
      {
        transform: `translateY(${window.innerHeight + 100}px) rotate(720deg)`,
        opacity: 0,
      },
    ],
    {
      duration: Math.random() * 3000 + 2000,
      easing: 'cubic-bezier(0.5, 0, 0.5, 1)',
    }
  );

  animation.onfinish = () => confetti.remove();
}

// Add some easter eggs
document.addEventListener('keydown', function (e) {
  // Konami code easter egg
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  if (!window.konamiSequence) window.konamiSequence = [];

  window.konamiSequence.push(e.keyCode);
  if (window.konamiSequence.length > konamiCode.length) {
    window.konamiSequence.shift();
  }

  if (
    window.konamiSequence.length === konamiCode.length &&
    window.konamiSequence.every((key, index) => key === konamiCode[index])
  ) {
    showNotification(
      '🎮 Konami Code Activated! You found the easter egg!',
      'success'
    );
    createConfetti();
    window.konamiSequence = [];
  }
});

// Performance optimization: Lazy load images if any
document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
});
