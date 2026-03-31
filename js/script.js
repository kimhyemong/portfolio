document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const header = document.querySelector(".hero");
    const menuToggle = document.querySelector(".menu-toggle");
    const navButtons = document.querySelectorAll(".nav-btn");

    const portfolioItems = document.querySelectorAll(".portfolio-item");
    const modal = document.querySelector(".portfolio-modal");
    const modalOverlay = document.querySelector(".portfolio-modal-overlay");
    const modalClose = document.querySelector(".portfolio-modal-close");
    const modalDialog = document.querySelector(".portfolio-modal-dialog");
    const modalMedia = document.querySelector(".portfolio-modal-media");
    const modalTitle = document.querySelector("#modalTitle");
    const modalDesc = document.querySelector(".portfolio-modal-desc");

    function openMenu() {
        if (!header || !menuToggle) return;
        header.classList.add("menu-open");
        body.classList.add("nav-open");
        menuToggle.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
        if (!header || !menuToggle) return;
        header.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");

        if (!modal || !modal.classList.contains("show")) {
            body.classList.remove("nav-open");
        }
    }

    function toggleMenu() {
        if (!header) return;

        if (header.classList.contains("menu-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMenu);
    }

    function moveToSection(targetId) {
        if (!targetId || !header) return;

        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        const headerHeight = header.offsetHeight;
        const targetTop =
            targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: targetTop,
            behavior: "smooth"
        });

        if (window.innerWidth <= 767) {
            closeMenu();
        }
    }

    navButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            moveToSection(button.dataset.target);
        });
    });

    function updateHeaderStyle() {
        if (!header) return;

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    function updateActiveMenu() {
        if (!header) return;

        let currentId = "";

        navButtons.forEach((button) => {
            const section = document.getElementById(button.dataset.target);
            if (!section) return;

            const sectionTop = section.offsetTop - header.offsetHeight - 120;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentId = button.dataset.target;
            }
        });

        navButtons.forEach((button) => {
            button.classList.toggle("active", button.dataset.target === currentId);
        });
    }

    function clearModalMedia() {
        if (!modalMedia) return;

        const video = modalMedia.querySelector("video");
        if (video) {
            video.pause();
            video.currentTime = 0;
        }

        modalMedia.classList.remove("is-scrollable");
        modalMedia.innerHTML = "";
        modalMedia.scrollTop = 0;
    }

    function createEmptyModal() {
        const emptyBox = document.createElement("div");
        emptyBox.className = "modal-empty";

        const text = document.createElement("span");
        text.textContent = "WORK IN PROGRESS";

        emptyBox.appendChild(text);
        return emptyBox;
    }

    function openPortfolioModal(type, src, title, desc, isScrollable = false) {
        if (!modal || !modalMedia || !modalTitle || !modalDesc) return;

        clearModalMedia();

        let element;

        if (!src || src.trim() === "") {
            element = createEmptyModal();
        } else if (type === "video") {
            element = document.createElement("video");
            element.src = src;
            element.controls = true;
            element.autoplay = true;
            element.playsInline = true;
        } else {
            element = document.createElement("img");
            element.src = src;
            element.alt = title || "";

            if (isScrollable) {
                modalMedia.classList.add("is-scrollable");
            }
        }

        modalMedia.appendChild(element);
        modalTitle.textContent = title || "";
        modalDesc.innerHTML = desc || "";

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        body.classList.add("nav-open");
    }

    function closePortfolioModal() {
        if (!modal) return;

        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");

        setTimeout(() => {
            if (!modal.classList.contains("show")) {
                clearModalMedia();
            }
        }, 450);

        if (!header || !header.classList.contains("menu-open")) {
            body.classList.remove("nav-open");
        }
    }

    portfolioItems.forEach((item) => {
        item.setAttribute("tabindex", "0");

        item.addEventListener("click", () => {
            openPortfolioModal(
                item.dataset.type,
                item.dataset.src,
                item.dataset.title,
                item.dataset.desc,
                item.dataset.scroll === "true"
            );
        });

        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                item.click();
            }
        });
    });

    if (modalOverlay) {
        modalOverlay.addEventListener("click", closePortfolioModal);
    }

    if (modalClose) {
        modalClose.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            closePortfolioModal();
        });
    }

    if (modalDialog) {
        modalDialog.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    document.addEventListener("click", (e) => {
        if (!header) return;

        const isMobile = window.innerWidth <= 767;
        const clickedInsideHeader = header.contains(e.target);

        if (isMobile && !clickedInsideHeader && header.classList.contains("menu-open")) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMenu();
            closePortfolioModal();
        }
    });

    window.addEventListener("scroll", updateHeaderStyle);
    window.addEventListener("scroll", updateActiveMenu);

    window.addEventListener("resize", () => {
        if (window.innerWidth > 767) {
            closeMenu();
        }
    });

    updateHeaderStyle();
    updateActiveMenu();
});