document.addEventListener('DOMContentLoaded', function() {
  // Update current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Load services data from API
  function loadServices() {
    fetch('/api/services')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        return response.json();
      })
      .then(services => {
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid && services.length > 0) {
          // Clear existing content
          servicesGrid.innerHTML = '';
          
          // Add services cards
          services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            
            let itemsHtml = '';
            if (service.items && service.items.length > 0) {
              itemsHtml = '<ul class="service-list">';
              service.items.forEach(item => {
                itemsHtml += `<li><i class="fa-solid fa-circle"></i> ${item}</li>`;
              });
              itemsHtml += '</ul>';
            }
            
            serviceCard.innerHTML = `
              <div class="service-image">
                <img src="${service.image_url}" alt="${service.title}">
              </div>
              <div class="service-content">
                <h3 class="service-title">${service.title}</h3>
                <p class="service-description">${service.description}</p>
                ${itemsHtml}
                <a href="#" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a>
              </div>
            `;
            
            servicesGrid.appendChild(serviceCard);
          });
        }
      })
      .catch(error => {
        console.error('Error loading services:', error);
      });
  }
  
  // Load gallery items from API
  function loadGallery(category = 'all') {
    fetch(`/api/gallery${category !== 'all' ? `?category=${category}` : ''}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch gallery items');
        }
        return response.json();
      })
      .then(items => {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid && items.length > 0) {
          // Clear existing content
          galleryGrid.innerHTML = '';
          
          // Add gallery items
          items.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-category', item.category);
            
            galleryItem.innerHTML = `
              <div class="before-after-slider">
                <div class="before-image">
                  <img src="${item.before_image_url}" alt="Before ${item.procedure_type}">
                </div>
                <div class="after-image">
                  <img src="${item.after_image_url}" alt="After ${item.procedure_type}">
                </div>
                <div class="slider-handle"></div>
                <div class="procedure-badge">${item.procedure_type}</div>
              </div>
              <div class="gallery-info">
                <div class="info-top">
                  <span class="procedure-type">${item.procedure_type}</span>
                  <span class="patient-age">Age: ${item.patient_age}</span>
                </div>
                <p class="recovery-time">Recovery time: ${item.recovery_time}</p>
              </div>
            `;
            
            galleryGrid.appendChild(galleryItem);
          });
          
          // Initialize sliders for the new items
          initializeSliders();
        }
      })
      .catch(error => {
        console.error('Error loading gallery:', error);
      });
  }
  
  // Load testimonials from API
  function loadTestimonials() {
    fetch('/api/testimonials')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        return response.json();
      })
      .then(testimonials => {
        const testimonialWrapper = document.querySelector('.testimonial-wrapper');
        const dotsContainer = document.querySelector('.testimonial-dots');
        
        if (testimonialWrapper && testimonials.length > 0) {
          // Clear existing content
          testimonialWrapper.innerHTML = '';
          if (dotsContainer) {
            dotsContainer.innerHTML = '';
          }
          
          // Add testimonials
          testimonials.forEach((testimonial, index) => {
            const testimonialCard = document.createElement('div');
            testimonialCard.className = 'testimonial-card';
            
            // Generate stars HTML
            const fullStars = Math.floor(testimonial.stars);
            const hasHalfStar = testimonial.stars % 1 !== 0;
            let starsHtml = '';
            
            for (let i = 0; i < fullStars; i++) {
              starsHtml += '<i class="fas fa-star"></i>';
            }
            
            if (hasHalfStar) {
              starsHtml += '<i class="fas fa-star-half-alt"></i>';
            }
            
            testimonialCard.innerHTML = `
              <div class="testimonial-rating">
                ${starsHtml}
                <span class="rating-number">${testimonial.stars.toFixed(1)}</span>
              </div>
              <blockquote class="testimonial-quote">
                "${testimonial.testimonial_text}"
              </blockquote>
              <div class="testimonial-author">
                <img src="${testimonial.image_url}" alt="${testimonial.patient_name}" class="author-image">
                <div class="author-info">
                  <h4 class="author-name">${testimonial.patient_name}</h4>
                  <p class="author-procedure">${testimonial.procedure}</p>
                </div>
              </div>
            `;
            
            testimonialWrapper.appendChild(testimonialCard);
            
            // Add dot
            if (dotsContainer) {
              const dot = document.createElement('button');
              dot.className = `dot${index === 0 ? ' active' : ''}`;
              dot.setAttribute('data-index', index);
              dotsContainer.appendChild(dot);
            }
          });
          
          // Reinitialize testimonial slider
          initializeTestimonialSlider();
        }
      })
      .catch(error => {
        console.error('Error loading testimonials:', error);
      });
  }
  
  // Load blog posts from API
  function loadBlogPosts() {
    fetch('/api/blog')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        return response.json();
      })
      .then(posts => {
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid && posts.length > 0) {
          // Clear existing content
          blogGrid.innerHTML = '';
          
          // Add blog posts
          posts.forEach(post => {
            const blogCard = document.createElement('article');
            blogCard.className = 'blog-card';
            
            // Format date
            const publishDate = new Date(post.publish_date);
            const formattedDate = publishDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            blogCard.innerHTML = `
              <div class="blog-image">
                <img src="${post.image_url}" alt="${post.title}">
              </div>
              <div class="blog-content">
                <div class="blog-meta">
                  <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                  <span>•</span>
                  <span>${post.category}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="#" class="blog-link">Read More <i class="fas fa-arrow-right"></i></a>
              </div>
            `;
            
            blogGrid.appendChild(blogCard);
          });
        }
      })
      .catch(error => {
        console.error('Error loading blog posts:', error);
      });
  }
  
  // Load FAQs from API
  function loadFAQs() {
    fetch('/api/faqs')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch FAQs');
        }
        return response.json();
      })
      .then(faqs => {
        const faqContainer = document.querySelector('.faq-container');
        if (faqContainer && faqs.length > 0) {
          // Clear existing content
          faqContainer.innerHTML = '';
          
          // Add FAQs
          faqs.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            
            faqItem.innerHTML = `
              <button class="faq-question">
                <span>${faq.question}</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              <div class="faq-answer">
                <p>${faq.answer}</p>
              </div>
            `;
            
            faqContainer.appendChild(faqItem);
          });
          
          // Reinitialize FAQ functionality
          initializeFAQs();
        }
      })
      .catch(error => {
        console.error('Error loading FAQs:', error);
      });
  }
  
  // Try to load data from API
  try {
    loadServices();
    loadGallery();
    loadTestimonials();
    loadBlogPosts();
    loadFAQs();
  } catch (error) {
    console.error('Error loading data from API:', error);
  }
  
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  mobileMenuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
  
  // Close mobile menu when a link is clicked
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
  
  // Smooth scrolling for all links with hash
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Header scroll effect
  const header = document.querySelector('.header');
  const scrollThreshold = 50;
  
  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
  
  // Before-After Slider Functionality
  const sliders = document.querySelectorAll('.before-after-slider');
  
  sliders.forEach(slider => {
    const handle = slider.querySelector('.slider-handle');
    const afterImage = slider.querySelector('.after-image');
    
    if (!handle || !afterImage) return;
    
    let isResizing = false;
    
    const startResize = (e) => {
      isResizing = true;
      e.preventDefault();
    };
    
    const resize = (e) => {
      if (!isResizing) return;
      
      let clientX;
      if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }
      
      const sliderRect = slider.getBoundingClientRect();
      let position = (clientX - sliderRect.left) / sliderRect.width;
      
      // Constrain position between 0 and 1
      position = Math.max(0, Math.min(1, position));
      
      // Update handle and after image positions
      handle.style.left = position * 100 + '%';
      afterImage.style.width = position * 100 + '%';
    };
    
    const stopResize = () => {
      isResizing = false;
    };
    
    // Add event listeners
    handle.addEventListener('mousedown', startResize);
    handle.addEventListener('touchstart', startResize);
    document.addEventListener('mousemove', resize);
    document.addEventListener('touchmove', resize);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchend', stopResize);
  });
  
  // Gallery Filter
  const filterButtons = document.querySelectorAll('.filter-button');
  
  function initializeGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        // Load gallery items with the selected filter
        loadGallery(filter);
      });
    });
  }
  
  // Initialize gallery filters
  initializeGalleryFilters();
  
  // Testimonial Slider Functions
  let currentSlide = 0;
  let autoSlideInterval;
  
  function initializeTestimonialSlider() {
    const testimonialWrapper = document.querySelector('.testimonial-wrapper');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.testimonial-nav.prev');
    const nextButton = document.querySelector('.testimonial-nav.next');
    const dots = document.querySelectorAll('.dot');
    
    if (!testimonialCards.length) return;
    
    currentSlide = 0;
    const slideCount = testimonialCards.length;
    
    // Set initial position
    updateSlider();
    
    // Add event listeners for testimonial slider
    if (prevButton && nextButton) {
      prevButton.addEventListener('click', prevSlide);
      nextButton.addEventListener('click', nextSlide);
    }
    
    // Add event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
      });
    });
    
    // Clear any existing interval
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    
    // Auto slide every 5 seconds
    autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Pause auto sliding when hovering over testimonial slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider) {
      testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
      });
      
      testimonialSlider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
      });
    }
  }
  
  function updateSlider() {
    const testimonialWrapper = document.querySelector('.testimonial-wrapper');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    if (!testimonialCards.length) return;
    
    const cardWidth = testimonialCards[0].offsetWidth;
    const slideMargin = parseInt(getComputedStyle(testimonialCards[0]).marginRight) + 
                       parseInt(getComputedStyle(testimonialCards[0]).marginLeft);
    const offset = currentSlide * (cardWidth + slideMargin);
    
    testimonialWrapper.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  function nextSlide() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (!testimonialCards.length) return;
    
    const slideCount = testimonialCards.length;
    currentSlide = (currentSlide + 1) % slideCount;
    updateSlider();
  }
  
  function prevSlide() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (!testimonialCards.length) return;
    
    const slideCount = testimonialCards.length;
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateSlider();
  }
  
  // Initialize gallery sliders
  function initializeSliders() {
    const sliders = document.querySelectorAll('.before-after-slider');
    
    sliders.forEach(slider => {
      const sliderHandle = slider.querySelector('.slider-handle');
      const beforeImage = slider.querySelector('.before-image');
      
      // Set initial position (50% split)
      beforeImage.style.width = '50%';
      sliderHandle.style.left = '50%';
      
      // Track mouse position and slider state
      let isDragging = false;
      
      // Handle mouse/touch events
      sliderHandle.addEventListener('mousedown', startResize);
      sliderHandle.addEventListener('touchstart', startResize);
      
      function startResize(e) {
        e.preventDefault();
        isDragging = true;
        
        document.addEventListener('mousemove', resize);
        document.addEventListener('touchmove', resize);
      }
      
      function resize(e) {
        if (!isDragging) return;
        
        const containerRect = slider.getBoundingClientRect();
        let x = (e.clientX || (e.touches && e.touches[0].clientX)) - containerRect.left;
        
        // Constrain x within the slider bounds
        if (x < 0) x = 0;
        if (x > containerRect.width) x = containerRect.width;
        
        // Set the width of the before image
        const percent = (x / containerRect.width) * 100;
        beforeImage.style.width = `${percent}%`;
        sliderHandle.style.left = `${percent}%`;
      }
      
      function stopResize() {
        isDragging = false;
      }
      
      document.addEventListener('mouseup', stopResize);
      document.addEventListener('touchend', stopResize);
    });
  }
  
  // Initialize FAQ functionality
  function initializeFAQs() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        const isActive = this.classList.contains('active');
        
        // Close all other answers
        faqQuestions.forEach(q => {
          if (q !== this) {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('active');
          }
        });
        
        // Toggle current answer
        this.classList.toggle('active', !isActive);
        answer.classList.toggle('active', !isActive);
      });
    });
  }
  
  // Initialize the FAQ section
  initializeFAQs();
  
  // Form Validation
  function validateForm(form, fields) {
    let isValid = true;
    
    fields.forEach(fieldName => {
      const field = form.elements[fieldName];
      const errorElement = document.getElementById(`${fieldName}Error`);
      
      if (!field || !errorElement) return;
      
      // Reset error
      errorElement.textContent = '';
      
      // Skip validation if field is not required and empty
      if (!field.required && field.value.trim() === '') return;
      
      // Validate based on field type
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          errorElement.textContent = 'Please enter a valid email address';
          isValid = false;
        }
      } else if (field.type === 'tel') {
        const phoneRegex = /^\+?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(field.value)) {
          errorElement.textContent = 'Please enter a valid phone number';
          isValid = false;
        }
      } else if (field.type === 'checkbox' && field.required && !field.checked) {
        errorElement.textContent = 'This field is required';
        isValid = false;
      } else if (field.required && field.value.trim() === '') {
        errorElement.textContent = 'This field is required';
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  // Consultation Form Submission
  const consultationForm = document.getElementById('consultationForm');
  
  if (consultationForm) {
    consultationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fields = ['firstName', 'lastName', 'email', 'phone', 'procedure', 'date', 'time', 'message', 'consent'];
      
      if (validateForm(this, fields)) {
        // Get form data
        const formData = {
          firstName: this.elements.firstName.value,
          lastName: this.elements.lastName.value,
          email: this.elements.email.value,
          phone: this.elements.phone.value,
          procedure: this.elements.procedure.value,
          date: this.elements.date.value,
          time: this.elements.time.value,
          message: this.elements.message.value
        };
        
        // Disable submit button
        const submitButton = document.getElementById('consultationSubmit');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        // Send data to API
        fetch('/api/consultation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to submit consultation request');
          }
          return response.json();
        })
        .then(data => {
          showToast('success', 'Consultation Request Submitted', 'We\'ll contact you shortly to confirm your appointment.');
          this.reset();
        })
        .catch(error => {
          showToast('error', 'Error', error.message || 'Failed to submit consultation request. Please try again later.');
        })
        .finally(() => {
          submitButton.disabled = false;
          submitButton.textContent = 'Request Consultation';
        });
      }
    });
  }
  
  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fields = ['contactName', 'contactEmail', 'contactPhone', 'contactSubject', 'contactMessage'];
      
      if (validateForm(this, fields)) {
        // Get form data
        const formData = {
          name: this.elements.contactName.value,
          email: this.elements.contactEmail.value,
          phone: this.elements.contactPhone.value,
          subject: this.elements.contactSubject.value,
          message: this.elements.contactMessage.value
        };
        
        // Disable submit button
        const submitButton = document.getElementById('contactSubmit');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Send data to API
        fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to send message');
          }
          return response.json();
        })
        .then(data => {
          showToast('success', 'Message Sent Successfully', 'Thank you for reaching out! We\'ll get back to you soon.');
          this.reset();
        })
        .catch(error => {
          showToast('error', 'Error', error.message || 'Failed to send message. Please try again later.');
        })
        .finally(() => {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        });
      }
    });
  }
  
  // Toast Notification
  function showToast(type, title, message) {
    const toast = document.getElementById('toast');
    const toastTitle = toast.querySelector('.toast-title');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Set content
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Set icon based on type
    if (type === 'success') {
      toastIcon.className = 'toast-icon fas fa-check-circle';
      toast.className = 'toast success show';
    } else if (type === 'error') {
      toastIcon.className = 'toast-icon fas fa-exclamation-circle';
      toast.className = 'toast error show';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Auto hide after 5 seconds
    const autoHideTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
    
    // Close button functionality
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', function() {
      toast.classList.remove('show');
      clearTimeout(autoHideTimeout);
    });
  }
  
  // Intersection Observer for animations
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };
    
    const sectionsToAnimate = document.querySelectorAll('.about, .services, .gallery, .testimonials, .consultation, .blog, .faq, .contact');
    
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    sectionsToAnimate.forEach(section => {
      sectionObserver.observe(section);
    });
  }
});