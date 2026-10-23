'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const surpriseToggle = document.querySelector("[data-surprise-toggle]");
const surpriseAudio = document.querySelector("[data-surprise-audio]");
surpriseAudio.volume = 0.5;

const setTheme = function (theme) {
  const isLight = theme === "light";
  document.body.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} mode`);
  themeToggle.querySelector("ion-icon").name = isLight ? "moon-outline" : "sunny-outline";
  themeToggle.querySelector("span").textContent = isLight ? "Dark mode" : "Light mode";
};

themeToggle.addEventListener("click", function () {
  setTheme(document.body.dataset.theme === "light" ? "dark" : "light");
});

surpriseToggle.addEventListener("click", function () {
  if (surpriseAudio.paused) {
    surpriseAudio.play().catch(function (error) {
      console.error("Could not play the surprise audio:", error);
    });
  } else {
    surpriseAudio.pause();
    surpriseAudio.currentTime = 0;
  }
});

surpriseAudio.addEventListener("play", function () {
  surpriseToggle.setAttribute("aria-pressed", "true");
  surpriseToggle.querySelector("span").textContent = "Pause surprise";
});

surpriseAudio.addEventListener("pause", function () {
  surpriseToggle.setAttribute("aria-pressed", "false");
  surpriseToggle.querySelector("span").textContent = "Surprise Me!";
});

surpriseAudio.addEventListener("ended", function () {
  surpriseToggle.setAttribute("aria-pressed", "false");
  surpriseToggle.querySelector("span").textContent = "Surprise Me!";
});

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

const interestCards = document.querySelectorAll("[data-interest-card]");

interestCards.forEach(function (card) {
  const flipCard = function () {
    const isFlipped = card.classList.toggle("is-flipped");
    const interest = card.querySelector(".interest-card-title").textContent;
    const video = card.querySelector("[data-interest-video]");

    card.setAttribute("aria-pressed", String(isFlipped));
    card.setAttribute(
      "aria-label",
      `${isFlipped ? "Hide" : "Show"} details about ${interest}`
    );

    if (video) {
      if (isFlipped) {
        video.muted = false;
        video.play().catch(function (error) {
          console.error("Could not play the interest video:", error);
        });
      } else {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
      }
    }
  };

  card.addEventListener("click", function (event) {
    if (!event.target.closest("video")) {
      flipCard();
    }
  });

  card.addEventListener("keydown", function (event) {
    if ((event.key === "Enter" || event.key === " ") && !event.target.closest("video")) {
      event.preventDefault();
      flipCard();
    }
  });
});

const interestsCarousel = document.querySelector("[data-interests-carousel]");

// rotating title typing animation
const typingText = document.querySelector("[data-typing-text]");
const titles = ["BSIT Student", "Web Developer", "Live Stream Operator", "Working Scholar"];
let titleIndex = 0;
let characterIndex = titles[titleIndex].length;
let deletingTitle = true;

const typeTitle = function () {
  const currentTitle = titles[titleIndex];

  if (deletingTitle) {
    characterIndex--;
    typingText.textContent = currentTitle.slice(0, characterIndex);

    if (characterIndex === 0) {
      deletingTitle = false;
      titleIndex = (titleIndex + 1) % titles.length;
    }
  } else {
    characterIndex++;
    typingText.textContent = titles[titleIndex].slice(0, characterIndex);

    if (characterIndex === titles[titleIndex].length) {
      deletingTitle = true;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.setTimeout(typeTitle, 1400);
      }
      return;
    }
  }

  window.setTimeout(typeTitle, deletingTitle ? 55 : 100);
};

window.setTimeout(typeTitle, 1400);



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");
const modalRelationship = document.querySelector("[data-modal-relationship]");
const modalDate = document.querySelector("[data-modal-date]");

// modal toggle function
const testimonialsModalFunc = function (isOpen) {
  modalContainer.classList.toggle("active", isOpen);
  overlay.classList.toggle("active", isOpen);
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  const openTestimonial = function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    modalRelationship.textContent = this.querySelector("[data-testimonials-relationship]").textContent;

    const testimonialDate = this.querySelector("[data-testimonials-date]");
    if (modalDate) {
      modalDate.hidden = !testimonialDate || !testimonialDate.dateTime;
    }
    if (testimonialDate && testimonialDate.dateTime && modalDate) {
      modalDate.dateTime = testimonialDate.dateTime;
      modalDate.textContent = testimonialDate.textContent;
    }

    testimonialsModalFunc(true);

  };

  testimonialsItem[i].addEventListener("click", openTestimonial);
  testimonialsItem[i].addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openTestimonial.call(this);
    }
  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", function () { testimonialsModalFunc(false); });
overlay.addEventListener("click", function () { testimonialsModalFunc(false); });



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");
const projectEmptyState = document.querySelector("[data-project-empty]");

const filterFunc = function (selectedValue) {
  let visibleProjectCount = 0;

  for (let i = 0; i < filterItems.length; i++) {
    const matchesCategory = selectedValue === "all" ||
      selectedValue === filterItems[i].dataset.category;

    filterItems[i].classList.remove("active");

    if (matchesCategory) {
      void filterItems[i].offsetWidth;
      filterItems[i].classList.add("active");
      visibleProjectCount++;
    }

  }

  projectEmptyState.hidden = visibleProjectCount > 0;

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formSuccessPopup = document.querySelector("[data-form-success]");
const formSuccessClose = document.querySelector("[data-form-success-close]");

const closeFormSuccessPopup = function () {
  formSuccessPopup.hidden = true;
};

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  formSuccessPopup.hidden = false;
  formSuccessClose.focus();
  form.reset();
  formBtn.disabled = true;
});

formSuccessClose.addEventListener("click", closeFormSuccessPopup);
formSuccessPopup.addEventListener("click", function (event) {
  if (event.target === formSuccessPopup) {
    closeFormSuccessPopup();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !formSuccessPopup.hidden) {
    closeFormSuccessPopup();
  }
});

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
const skillSection = document.querySelector(".skill");
const skillFills = skillSection.querySelectorAll("[data-skill-target]");
const timelineEntries = document.querySelectorAll("[data-timeline-entry]");
let resumeIsActive = false;
let skillAnimationPlayed = false;

if ("IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const resumePage = document.querySelector('[data-page="resume"]');
  resumePage.classList.add("timeline-reveal-ready");

  const timelineObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  timelineEntries.forEach(function (entry) {
    timelineObserver.observe(entry);
  });
}

const revealSkillBars = function () {
  skillFills.forEach(function (fill) {
    fill.style.width = `${fill.dataset.skillTarget}%`;
  });
};

const resetSkillBars = function () {
  skillFills.forEach(function (fill) {
    fill.style.width = "0%";
  });
};

if ("IntersectionObserver" in window) {
  const skillObserver = new IntersectionObserver(function (entries) {
    if (resumeIsActive && !skillAnimationPlayed &&
        entries.some(function (entry) { return entry.isIntersecting; })) {
      skillAnimationPlayed = true;
      revealSkillBars();
    }
  }, { threshold: 0.01 });

  skillObserver.observe(skillSection);
}

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const selectedPage = this.innerText.toLowerCase();
    const wasResumeActive = resumeIsActive;

    for (let i = 0; i < pages.length; i++) {
      if (selectedPage === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

    resumeIsActive = selectedPage === "resume";

    if (resumeIsActive && !wasResumeActive) {
      resetSkillBars();
      skillAnimationPlayed = false;
    } else if (!resumeIsActive) {
      resetSkillBars();
      skillAnimationPlayed = false;
    }

  });

  // timeline reveal animation
document.body.classList.add("reveal-ready");

const timelineItems = document.querySelectorAll(".timeline-item");

// stagger entries within each list (0s, 0.25s, 0.5s...)
document.querySelectorAll(".timeline-list").forEach(function (list) {
  list.querySelectorAll(".timeline-item").forEach(function (item, i) {
    item.style.setProperty("--delay", (i * 0.25) + "s");
  });
});

const timelineObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal");
    }
  });
}, { threshold: 0.2 });

timelineItems.forEach(function (item) { timelineObserver.observe(item); });

// replay the animation every time the Resume tab is opened
navigationLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    if (link.innerHTML.toLowerCase() === "resume") {
      timelineItems.forEach(function (item) {
        item.classList.remove("reveal");
        timelineObserver.unobserve(item);
        timelineObserver.observe(item);
      });
    }
  });
});
}