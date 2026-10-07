/**
 * Taksh Chavda - Portfolio JavaScript
 * Handles interactivity, animations, certificate toggle, dynamic year, and form submission.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. PRELOADER
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 500);
        });
    }

    // 2. DYNAMIC CURRENT YEAR IN FOOTER
    const currentYearEl = document.getElementById("currentYear");
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 3. NAVBAR STICKY & SCROLL EFFECTS
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll("#mainNavbar .nav-link");
    const sections = document.querySelectorAll("section[id], header[id]");

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar?.classList.add("navbar-scrolled");
        } else {
            navbar?.classList.remove("navbar-scrolled");
        }

        // Active Nav Link Spy
        let currentSection = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id") || "";
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", handleNavbarScroll);

    // Close Bootstrap Mobile Menu on Link Click
    const navbarCollapse = document.getElementById("mainNavbar");
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (navbarCollapse && navbarCollapse.classList.contains("show")) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                bsCollapse?.hide();
            }
        });
    });

    // 4. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll(".reveal");

    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.88;

        revealElements.forEach((el) => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", checkReveal);
    checkReveal(); // Trigger on initial load

    // 5. ANIMATE SKILL BARS
    const skillLines = document.querySelectorAll(".skill-line-fill");
    let skillsAnimated = false;

    function animateSkills() {
        const skillsSection = document.getElementById("skills");
        if (!skillsSection) return;

        const sectionTop = skillsSection.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.85;

        if (sectionTop < triggerPoint && !skillsAnimated) {
            skillLines.forEach((bar) => {
                const targetLevel = bar.getAttribute("data-level") || "0";
                bar.style.width = `${targetLevel}%`;
            });
            skillsAnimated = true;
        }
    }

    window.addEventListener("scroll", animateSkills);
    animateSkills();

    // 6. PROJECT CATEGORY FILTERING
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectItems = document.querySelectorAll(".project-item");

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectItems.forEach((item) => {
                const category = item.getAttribute("data-category");
                if (filterValue === "all" || filterValue === category) {
                    item.style.display = "block";
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "scale(1)";
                    }, 50);
                } else {
                    item.style.opacity = "0";
                    item.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        item.style.display = "none";
                    }, 300);
                }
            });
        });
    });

    // 7. BACK TO TOP BUTTON
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // 8. CONTACT FORM HANDLING WITH AJAX
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add("was-validated");
                return;
            }

            const submitBtn = contactForm.querySelector(".submit-btn");
            const originalBtnText = submitBtn ? submitBtn.innerHTML : "Send Message";

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...`;
            }

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then((response) => {
                if (response.ok) {
                    if (formMessage) {
                        formMessage.innerHTML = `
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <i class="bi bi-check-circle-fill me-2"></i>
                                Thank you! Your message has been sent successfully to Taksh Chavda.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        `;
                    }
                    contactForm.reset();
                    contactForm.classList.remove("was-validated");
                } else {
                    throw new Error("Form submission failed");
                }
            })
            .catch(() => {
                if (formMessage) {
                    formMessage.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                            Oops! Something went wrong while sending your message. Please try sending an email directly to <strong>takshchavda18@gmail.com</strong>.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                }
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            });
        });
    }
});