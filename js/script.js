// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Variables
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const themeToggle = document.querySelector('.theme-toggle');
    const sections = document.querySelectorAll('section');
    const contactForm = document.getElementById('contactForm');

    // Hamburger menu toggle
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a nav link
    navLinksItems.forEach(item => {
        item.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Theme toggle (light/dark)
    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');

        // Change icon based on theme
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        // Save theme preference to localStorage
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // Apply saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    // Add shadow to navbar on scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Active nav link based on scroll position
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Form submission handling
    // if (contactForm) {
    //     contactForm.addEventListener('submit', function(e) {
    //         e.preventDefault();

    //         // Get form data
    //         const name = document.getElementById('name').value;
    //         const email = document.getElementById('email').value;
    //         const message = document.getElementById('message').value;

    //         // Simple form validation
    //         if (!name || !email || !message) {
    //             alert('Please fill in all fields');
    //             return;
    //         }

    //         // In a real implementation, you would send this data to a server
    //         // For now, just show a success message
    //         alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon.`);

    //         // Reset the form
    //         contactForm.reset();
    //     });
    // }

    // Replace the contact form event listener in script.js with this
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simple form validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }

            // Show sending indicator
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            // Prepare data for EmailJS
            const templateParams = {
                name: name,         // Change from_name to name (or whatever your template uses)
                email: email,       // Change from_email to email
                message: message
            };

            // Send email using EmailJS
            // First send the notification to you
            emailjs.send('service_vd7sc98', 'template_uzsfyqr', templateParams)
                // .then(function () {
                //     // Then send the auto-reply to the visitor 
                //     return emailjs.send('service_vd7sc98', 'template_z5krj1l', templateParams);
                // })
                .then(function (response) {
                    // Create and show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'send-success';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Your message has been sent! I\'ll get back to you soon.';
                    contactForm.appendChild(successMessage);

                    // Reset the form
                    contactForm.reset();

                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;

                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, function (error) {
                    // Handle error
                    console.error('Email error:', error);
                    alert('Sorry, there was an error sending your message. Please try again later.');

                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add typing animation to the home section heading
    const homeHeading = document.querySelector('#home h1');
    if (homeHeading) {
        const text = homeHeading.textContent;
        homeHeading.textContent = '';

        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                homeHeading.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, 100);
    }

    // Text rotation for job titles
    const TxtRotate = function (el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtRotate.prototype.tick = function () {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = this.txt;

        let delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => {
            this.tick();
        }, delta);
    };

    window.addEventListener('DOMContentLoaded', function () {
        const elements = document.getElementsByClassName('txt-rotate');
        for (let i = 0; i < elements.length; i++) {
            const toRotate = elements[i].getAttribute('data-rotate');
            const period = elements[i].getAttribute('data-period');
            if (toRotate) {
                new TxtRotate(elements[i], JSON.parse(toRotate), period);
            }
        }
    });

});