// QuizMaster JavaScript Functions

document.addEventListener('DOMContentLoaded', function () {
  // Initialize the application
  initializeApp();
});

function initializeApp() {
  // Add fade-in animation to main content
  addFadeInAnimation();

  // Initialize quiz functionality
  initializeQuiz();

  // Initialize smooth scrolling
  initializeSmoothScrolling();

  // Initialize tooltips if Bootstrap is available
  initializeTooltips();

  // Add click animations to buttons
  initializeButtonAnimations();
}

function addFadeInAnimation() {
  const elements = document.querySelectorAll(
    '.card, .hero-section, .quiz-header'
  );
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';

    setTimeout(() => {
      element.style.transition = 'all 0.6s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

function initializeQuiz() {
  const quizForm = document.getElementById('quizForm');

  if (quizForm) {
    // Add form submission handling
    quizForm.addEventListener('submit', handleQuizSubmission);

    // Add question navigation
    initializeQuestionNavigation();

    // Add answer selection animations
    initializeAnswerAnimations();

    // Add quiz timer (optional feature)
    // initializeQuizTimer();
  }
}

function handleQuizSubmission(event) {
  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');

  // Show loading state
  if (submitButton) {
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
    submitButton.disabled = true;

    // Re-enable after a short delay (in case of validation errors)
    setTimeout(() => {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }, 3000);
  }

  // Validate that all questions are answered
  if (!validateQuizCompletion()) {
    event.preventDefault();
    showValidationMessage();
    return false;
  }

  // Add visual feedback
  form.classList.add('loading');
}

function validateQuizCompletion() {
  const questionCards = document.querySelectorAll('.question-card');
  let allAnswered = true;

  questionCards.forEach((card, index) => {
    const radioButtons = card.querySelectorAll('input[type="radio"]');
    const isAnswered = Array.from(radioButtons).some((radio) => radio.checked);

    if (!isAnswered) {
      allAnswered = false;
      // Highlight unanswered question
      card.style.borderLeft = '4px solid #dc3545';
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      card.style.borderLeft = '4px solid #198754';
    }
  });

  return allAnswered;
}

function showValidationMessage() {
  // Create and show a toast notification
  const toast = createToast(
    'Please answer all questions before submitting!',
    'warning'
  );
  showToast(toast);
}

function initializeQuestionNavigation() {
  const questionCards = document.querySelectorAll('.question-card');

  questionCards.forEach((card, index) => {
    // Add question number click functionality for smooth scrolling
    const questionHeader = card.querySelector('.card-header h5');
    if (questionHeader) {
      questionHeader.style.cursor = 'pointer';
      questionHeader.addEventListener('click', () => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  });
}

function initializeAnswerAnimations() {
  const formChecks = document.querySelectorAll('.form-check');

  formChecks.forEach((formCheck) => {
    const radio = formCheck.querySelector('input[type="radio"]');
    const label = formCheck.querySelector('.form-check-label');

    if (radio && label) {
      formCheck.addEventListener('click', function () {
        // Remove selection from other options in the same question
        const questionCard = this.closest('.question-card');
        const allOptions = questionCard.querySelectorAll('.form-check');

        allOptions.forEach((option) => {
          option.classList.remove('selected');
        });

        // Add selection to clicked option
        this.classList.add('selected');

        // Add ripple effect
        addRippleEffect(this);
      });
    }
  });
}

function addRippleEffect(element) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.transform = 'scale(0)';
  ripple.style.animation = 'ripple 0.6s linear';
  ripple.style.backgroundColor = 'rgba(13, 110, 253, 0.3)';

  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

function initializeSmoothScrolling() {
  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

function initializeTooltips() {
  // Initialize Bootstrap tooltips if available
  if (typeof bootstrap !== 'undefined') {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}

function initializeButtonAnimations() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((button) => {
    button.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });

    button.addEventListener('mousedown', function () {
      this.style.transform = 'translateY(0) scale(0.98)';
    });

    button.addEventListener('mouseup', function () {
      this.style.transform = 'translateY(-2px) scale(1)';
    });
  });
}

// Toast notification system
function createToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${getIconForType(type)} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

  return toast;
}

function getIconForType(type) {
  const icons = {
    success: 'check-circle',
    warning: 'exclamation-triangle',
    danger: 'times-circle',
    info: 'info-circle',
  };
  return icons[type] || 'info-circle';
}

function showToast(toast) {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className =
      'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }

  toastContainer.appendChild(toast);

  // Initialize and show toast
  if (typeof bootstrap !== 'undefined') {
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  } else {
    // Fallback for when Bootstrap is not available
    toast.style.display = 'block';
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
}

// Keyboard navigation for quiz
document.addEventListener('keydown', function (event) {
  if (document.getElementById('quizForm')) {
    handleQuizKeyNavigation(event);
  }
});

function handleQuizKeyNavigation(event) {
  const currentQuestion =
    document.querySelector('.question-card:focus-within') ||
    document.querySelector('.question-card');

  if (!currentQuestion) return;

  const allQuestions = Array.from(document.querySelectorAll('.question-card'));
  const currentIndex = allQuestions.indexOf(currentQuestion);

  switch (event.key) {
    case 'ArrowDown':
    case 'PageDown':
      event.preventDefault();
      if (currentIndex < allQuestions.length - 1) {
        allQuestions[currentIndex + 1].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        allQuestions[currentIndex + 1]
          .querySelector('input[type="radio"]')
          .focus();
      }
      break;
    case 'ArrowUp':
    case 'PageUp':
      event.preventDefault();
      if (currentIndex > 0) {
        allQuestions[currentIndex - 1].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        allQuestions[currentIndex - 1]
          .querySelector('input[type="radio"]')
          .focus();
      }
      break;
    case '1':
    case '2':
    case '3':
    case '4':
      event.preventDefault();
      const optionIndex = parseInt(event.key) - 1;
      const radios = currentQuestion.querySelectorAll('input[type="radio"]');
      if (radios[optionIndex]) {
        radios[optionIndex].checked = true;
        radios[optionIndex].dispatchEvent(new Event('change'));
      }
      break;
  }
}

// Performance monitoring (optional)
function trackPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(
          'Page load time:',
          perfData.loadEventEnd - perfData.loadEventStart,
          'ms'
        );
      }, 0);
    });
  }
}

// Initialize performance tracking
trackPerformance();

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeApp,
    createToast,
    showToast,
    validateQuizCompletion,
  };
}
