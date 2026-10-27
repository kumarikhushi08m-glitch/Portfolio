/**
 * Khushi Kumari — Premium Developer Portfolio Script
 * Pure Vanilla JavaScript (No external framework dependencies)
 * Features: Interactive Mouse Spotlight, Pastel Parallax, Scroll-Reveal,
 * Typewriter, Accessible Native Dialog Modals, and Form Validation
 */

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMouseInteractions();
    initScrollReveal();
    initTypewriter();
    initScrollInteractions();
    initMobileNav();
    initScrollSpy();
    initProjectFiltering();
    initProjectModal();
    initContactForm();
    initClipboardCopy();
});

/* ==========================================================================
   1. Theme Management (Default Light Theme with Dark Mode Option)
   ========================================================================== */
function initTheme() {
    const themeBtn = document.getElementById("themeButton");
    if (!themeBtn) return;

    // Check saved theme; default is the signature Light Pastel Theme
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeBtn.setAttribute("aria-pressed", "true");
    } else {
        document.body.classList.remove("dark-mode");
        themeBtn.setAttribute("aria-pressed", "false");
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        themeBtn.setAttribute("aria-pressed", isDark ? "true" : "false");
        localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    });
}

/* ==========================================================================
   2. Interactive Mouse-Responsive Gradient & Parallax Effect
   ========================================================================== */
function initMouseInteractions() {
    // Only enable mouse movement effects on devices with a mouse/pointer
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let ticking = false;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight * 0.3;

    const heroParticles = document.querySelectorAll(".hero-particle");
    const photoGlow = document.querySelector(".photo-glow-wrapper");

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Update CSS variables for the interactive spotlight glow
                document.documentElement.style.setProperty("--mouse-x", `${mouseX}px`);
                document.documentElement.style.setProperty("--mouse-y", `${mouseY}px`);

                // Calculate normalized offsets (-0.5 to 0.5)
                const offsetX = (mouseX / window.innerWidth) - 0.5;
                const offsetY = (mouseY / window.innerHeight) - 0.5;

                // Subtle parallax on hero floating particles
                heroParticles.forEach((particle, index) => {
                    const depth = (index + 1) * 12;
                    const moveX = offsetX * depth;
                    const moveY = offsetY * depth;
                    particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });

                // Subtle tilt/shift on profile photo frame
                if (photoGlow) {
                    const photoShiftX = offsetX * 10;
                    const photoShiftY = offsetY * 10;
                    photoGlow.style.transform = `translate(${photoShiftX}px, ${photoShiftY}px)`;
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ==========================================================================
   3. Subtle Scroll-Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    if (revealElements.length === 0) return;

    // Respect user's reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealElements.forEach(el => el.classList.add("revealed"));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   4. Dynamic Typewriter Subtitle Effect
   ========================================================================== */
function initTypewriter() {
    const typingElement = document.getElementById("typing");
    if (!typingElement) return;

    const roles = [
        "Frontend Developer",
        "Software Developer",
        "Creative Problem Solver",
        "B.Tech CSE Student"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 85;
    const deletingSpeed = 45;
    const pauseTime = 1600;

    function typeLoop() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            delay = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(typeLoop, delay);
    }

    typeLoop();
}

/* ==========================================================================
   5. Scroll Interactions (Scroll Progress Bar, Sticky Header, Top Button)
   ========================================================================== */
function initScrollInteractions() {
    const progressBar = document.getElementById("scrollProgressBar");
    const header = document.getElementById("header");
    const topButton = document.getElementById("topButton");

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // Progress bar calculation
        if (progressBar && scrollHeight > 0) {
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Header shadow
        if (header) {
            if (scrollTop > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // Back to top floating button visibility
        if (topButton) {
            if (scrollTop > 320) {
                topButton.classList.add("visible");
            } else {
                topButton.classList.remove("visible");
            }
        }
    }, { passive: true });

    // Back to top click handler
    if (topButton) {
        topButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
}

/* ==========================================================================
   6. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const primaryNav = document.getElementById("primaryNav");

    if (!mobileBtn || !primaryNav) return;

    function toggleNav() {
        const isOpen = mobileBtn.classList.toggle("open");
        primaryNav.classList.toggle("open");
        mobileBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    function closeNav() {
        mobileBtn.classList.remove("open");
        primaryNav.classList.remove("open");
        mobileBtn.setAttribute("aria-expanded", "false");
    }

    mobileBtn.addEventListener("click", toggleNav);

    // Auto close when clicking any navigation link
    primaryNav.querySelectorAll(".nav-item").forEach(link => {
        link.addEventListener("click", closeNav);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
        if (primaryNav.classList.contains("open") && !primaryNav.contains(e.target) && !mobileBtn.contains(e.target)) {
            closeNav();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && primaryNav.classList.contains("open")) {
            closeNav();
        }
    });
}

/* ==========================================================================
   7. Active Section Highlighting (ScrollSpy with IntersectionObserver)
   ========================================================================== */
function initScrollSpy() {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll("section[id], div#achievements");

    if (sections.length === 0 || navItems.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute("id");
                navItems.forEach(item => {
                    const href = item.getAttribute("href");
                    if (href === `#${currentId}`) {
                        item.classList.add("active");
                    } else {
                        item.classList.remove("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   8. Projects Category Filtering
   ========================================================================== */
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Update active state on buttons
            filterButtons.forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const categories = card.getAttribute("data-category") || "";
                if (filterValue === "all" || categories.includes(filterValue)) {
                    card.classList.remove("filtered-out");
                } else {
                    card.classList.add("filtered-out");
                }
            });
        });
    });
}

/* ==========================================================================
   9. Accessible Project Modal Dialog (<dialog> with Light-Dismiss Fallback)
   ========================================================================== */
const projectDetailsData = {
    tripmate: {
        title: "TripMate — Travel Planner",
        category: "Web Application • Travel Tech",
        problem: "Planning vacations across various destinations often involves scattered notes, conflicting itineraries, and zero real-time budget tracking. Travelers need an all-in-one organizer that runs smoothly on desktop and mobile without tedious signups.",
        solution: "TripMate unites day-by-day destination scheduling, an automatic expense budget calculator, and an interactive packing checklist into a single responsive dashboard. State is safely stored in browser LocalStorage so travelers never lose their plans.",
        features: [
            "Interactive daily itinerary timeline builder with destination notes",
            "Real-time expense calculator with categorized travel budget allocations",
            "Interactive packing checklist with completion meter",
            "Client-side persistence via HTML5 LocalStorage",
            "Mobile-optimized touch interface"
        ],
        technologies: ["HTML5", "CSS3 (Flexbox/Grid)", "Vanilla JavaScript (ES6+)", "LocalStorage API"],
        githubUrl: "https://github.com/kumarikhushi08m-glitch",
        demoNote: "Interactive client-side web application. LocalStorage based."
    },
    landpulse: {
        title: "LandPulse AI — Predictive Analytics Dashboard",
        category: "Analytics Dashboard • Python & Data Concept",
        problem: "Agricultural landowners and environmental researchers often struggle to interpret raw soil metrics, regional rainfall statistics, and fluctuating valuation estimates without dedicated analytical visualization tools.",
        solution: "LandPulse AI presents an intuitive predictive dashboard interface for examining soil quality parameters, moisture trends, and automated land valuation forecasts using structured data models.",
        features: [
            "Multi-metric environmental dashboard (Moisture, Nitrogen, pH, Soil Health)",
            "Predictive valuation forecast modeling concept",
            "Dynamic filtering by land parcel category and geographical metrics",
            "Modern pastel glassmorphic data visualization cards"
        ],
        technologies: ["Python", "Data Analysis", "Predictive Analytics Concept", "Modern Web Dashboard UI"],
        githubUrl: "https://github.com/kumarikhushi08m-glitch",
        demoNote: "Data analytics & visualization dashboard architecture."
    },
    portfolio: {
        title: "Personal Developer Portfolio (v2.0)",
        category: "Frontend Engineering • Modern Web",
        problem: "Aspiring developers need a high-impact, professional digital presence that authentically reflects technical skills, verified academic credentials, and project work without unnecessary heavy frameworks.",
        solution: "Engineered with semantic HTML5, modern CSS3 custom properties, and modular Vanilla JavaScript. Implements native dialogs, pastel themes, responsive glassmorphism, and accessible interaction patterns.",
        features: [
            "Native HTML5 <dialog> modal system with light-dismiss support",
            "Signature pastel light theme with mouse-interactive glowing spotlight",
            "Scroll progress tracking, dynamic typewriter animations, and filterable projects",
            "Strictly zero heavy external JS libraries; blazing fast loading and Live Server compatibility"
        ],
        technologies: ["HTML5 (Semantic)", "CSS3 Custom Properties", "Vanilla JavaScript", "Native Dialog API"],
        githubUrl: "https://github.com/kumarikhushi08m-glitch",
        demoNote: "You are currently viewing this live portfolio!"
    },
    facedetection: {
        title: "Real-Time Face Detection System",
        category: "Python Application • Computer Vision",
        problem: "Understanding real-time visual recognition pipelines requires hands-on implementation of video frame processing, edge detection, and classifier inference at optimal frame rates.",
        solution: "Built using Python and OpenCV, this project interfaces with real-time camera streams to detect single and multiple human faces simultaneously with visual bounding box coordinates.",
        features: [
            "Webcam video capture & real-time frame-by-frame conversion",
            "Haar Cascade pre-trained classifier integration for facial landmarks",
            "Multi-face bounding box drawing with coordinate tracking",
            "Fine-tuned scale factor and minimum neighbor parameters to minimize false positives"
        ],
        technologies: ["Python", "OpenCV (cv2)", "Haar Cascade Classifiers", "Computer Vision"],
        githubUrl: "https://github.com/kumarikhushi08m-glitch",
        demoNote: "Local desktop application utilizing webcam hardware."
    },
    taskflow: {
        title: "TaskFlow — Interactive Task Manager",
        category: "Productivity Tool • DOM Architecture",
        problem: "Daily study and task planning often gets derailed when task management software is bloated, slow, or requires mandatory cloud logins.",
        solution: "TaskFlow offers instant task creation, priority flagging, category filtering (All, Active, Completed), and automatic browser storage to keep daily coding and academic targets organized.",
        features: [
            "Instant task creation, inline editing, and deletion",
            "Priority status flags (High, Medium, Normal)",
            "Instant state filtering between active and completed items",
            "Auto-save persistence in browser storage"
        ],
        technologies: ["HTML5", "CSS3", "JavaScript (DOM Manipulation)", "LocalStorage"],
        githubUrl: "https://github.com/kumarikhushi08m-glitch",
        demoNote: "Lightweight client-side task manager."
    }
};

function initProjectModal() {
    const modal = document.getElementById("projectModal");
    const modalBody = document.getElementById("modalBody");
    const modalCloseBtn = document.getElementById("modalCloseBtn");

    if (!modal || !modalBody || !modalCloseBtn) return;

    // Open modal buttons
    const triggerButtons = document.querySelectorAll(".btn-details-trigger, .btn-demo-action");
    triggerButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const projectId = btn.getAttribute("data-project");
            const data = projectDetailsData[projectId];
            if (!data) return;

            // Render modal content
            modalBody.innerHTML = `
                <span class="modal-category">${escapeHtml(data.category)}</span>
                <h2 id="modalTitle" class="modal-title">${escapeHtml(data.title)}</h2>
                
                <h3 class="modal-section-title">The Challenge & Problem Solved</h3>
                <p class="modal-p">${escapeHtml(data.problem)}</p>

                <h3 class="modal-section-title">Architectural Solution</h3>
                <p class="modal-p">${escapeHtml(data.solution)}</p>

                <h3 class="modal-section-title">Key Capabilities & Features</h3>
                <ul class="modal-feature-list">
                    ${data.features.map(f => `<li>${escapeHtml(f)}</li>`).join("")}
                </ul>

                <h3 class="modal-section-title">Technologies Leveraged</h3>
                <div class="tech-badge-container">
                    ${data.technologies.map(t => `<span class="tech-badge">${escapeHtml(t)}</span>`).join("")}
                </div>

                <div class="modal-btn-row">
                    <a href="${escapeHtml(data.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        <span>View Repository on GitHub</span>
                    </a>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('projectModal').close()">
                        <span>Close Window</span>
                    </button>
                </div>
            `;

            modal.showModal();
        });
    });

    // Close button
    modalCloseBtn.addEventListener("click", () => {
        modal.close();
    });

    // Light-Dismiss Fallback for browsers that do not natively support closedby="any"
    if (!('closedBy' in HTMLDialogElement.prototype)) {
        modal.addEventListener("click", (event) => {
            if (event.target !== modal) return;
            const rect = modal.getBoundingClientRect();
            const isInside = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );
            if (!isInside) {
                modal.close();
            }
        });
    }
}

/* Helper to prevent XSS in modal content */
function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================================================
   10. Contact Form Validation & Truthful Client-Side Dispatch
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById("contactForm");
    const nameInput = document.getElementById("senderName");
    const emailInput = document.getElementById("senderEmail");
    const subjectInput = document.getElementById("messageSubject");
    const messageInput = document.getElementById("messageBody");
    const formStatus = document.getElementById("formStatus");

    if (!form) return;

    function validateField(input, minLen = 1, isEmail = false) {
        const val = input.value.trim();
        const parent = input.closest(".form-group");
        let valid = val.length >= minLen;

        if (isEmail && valid) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            valid = emailRegex.test(val);
        }

        if (parent) {
            if (!valid) {
                parent.classList.add("has-error");
            } else {
                parent.classList.remove("has-error");
            }
        }
        return valid;
    }

    // Input listeners to clear error states as user types
    nameInput.addEventListener("input", () => validateField(nameInput, 2));
    emailInput.addEventListener("input", () => validateField(emailInput, 5, true));
    subjectInput.addEventListener("input", () => validateField(subjectInput, 3));
    messageInput.addEventListener("input", () => validateField(messageInput, 10));

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const isNameValid = validateField(nameInput, 2);
        const isEmailValid = validateField(emailInput, 5, true);
        const isSubjectValid = validateField(subjectInput, 3);
        const isMessageValid = validateField(messageInput, 10);

        if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
            formStatus.className = "form-status error";
            formStatus.textContent = "Please correct the highlighted fields before sending.";
            return;
        }

        // Truthful, transparent client-side dispatch mechanism
        const nameVal = encodeURIComponent(nameInput.value.trim());
        const emailVal = encodeURIComponent(emailInput.value.trim());
        const subjectVal = encodeURIComponent(subjectInput.value.trim());
        const messageVal = encodeURIComponent(messageInput.value.trim());

        const mailtoBody = `Sender Name: ${nameVal}%0D%0ASender Email: ${emailVal}%0D%0A%0D%0AMessage:%0D%0A${messageVal}`;
        const mailtoUrl = `mailto:kumarikhushi08@gmail.com?subject=${subjectVal}&body=${mailtoBody}`;

        formStatus.className = "form-status success";
        formStatus.innerHTML = `
            <strong>Message Prepared!</strong> Opening your default email client with your pre-filled inquiry to <code>kumarikhushi08@gmail.com</code>.<br>
            <small style="opacity: 0.85;">(Developer Note: To send messages directly in the background without launching a mail client, configure an API endpoint like Formspree or EmailJS here in <code>script.js</code>).</small>
        `;

        // Launch mail client after a brief feedback moment
        setTimeout(() => {
            window.location.href = mailtoUrl;
        }, 600);

        // Reset form inputs after submission
        form.reset();
    });
}

/* ==========================================================================
   11. One-Click Copy Email to Clipboard
   ========================================================================== */
function initClipboardCopy() {
    const copyBtn = document.getElementById("copyEmailBtn");
    const copyTooltip = document.getElementById("copyTooltip");

    if (!copyBtn || !copyTooltip) return;

    copyBtn.addEventListener("click", async () => {
        const email = "kumarikhushi08@gmail.com";
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(email);
            } else {
                // Fallback for older browsers
                const tempTextArea = document.createElement("textarea");
                tempTextArea.value = email;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand("copy");
                document.body.removeChild(tempTextArea);
            }

            copyTooltip.textContent = "Copied!";
            copyBtn.style.borderColor = "var(--accent-purple)";

            setTimeout(() => {
                copyTooltip.textContent = "Copy";
                copyBtn.style.borderColor = "";
            }, 2000);
        } catch (err) {
            console.error("Failed to copy email:", err);
            copyTooltip.textContent = "Press Ctrl+C";
        }
    });
}
