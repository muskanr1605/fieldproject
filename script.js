document.addEventListener("DOMContentLoaded", () => {

  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const actionForm = document.getElementById("actionForm");

  const donationAmounts = document.getElementById("donationAmounts");
  const amountField = document.getElementById("amountField");
  const interestField = document.getElementById("interestField");
  const orgField = document.getElementById("orgField");

  const amountInput = document.getElementById("amountInput");
  const successState = document.getElementById("successState");
  const toast = document.getElementById("toast");
  const navLinks = document.getElementById("navLinks");

  let currentMode = "donate";
  let selectedNeed = "";

  // Show small notification
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // Open the appropriate modal
  function openModal(mode = "donate", need = "") {
    currentMode = mode;
    selectedNeed = need;

    actionForm.reset();

    successState.hidden = true;
    actionForm.hidden = false;

    donationAmounts.hidden = mode !== "donate";
    amountField.hidden = mode !== "donate";
    interestField.hidden = mode !== "volunteer";
    orgField.hidden = mode !== "partner";

    amountInput.value = "250";

    document.querySelectorAll(".amount").forEach((button, index) => {
      button.classList.toggle("active", index === 0);
    });

    const settings = {
      donate: [
        "Donate Now",
        "Choose a contribution to support a cause."
      ],

      volunteer: [
        "Become a Volunteer",
        "Share your details and interests to explore volunteering."
      ],

      partner: [
        "Partner With Us",
        "Tell us about your organisation or collaboration idea."
      ]
    };

    modalTitle.textContent = settings[mode][0];

    modalDescription.textContent = need
      ? `Your support can help provide ${need.toLowerCase()}.`
      : settings[mode][1];

    document.getElementById("submitAction").textContent =
      mode === "donate" ? "Continue →" : "Submit Interest →";

    modalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";

    document.getElementById("modalClose").focus();
  }

  // Close modal
  function closeModal() {
    modalBackdrop.hidden = true;
    document.body.style.overflow = "";
  }

  // Connect all Donate, Volunteer and Partner buttons
  document.querySelectorAll("[data-modal]").forEach(button => {
    button.addEventListener("click", () => {
      const mode = button.dataset.modal.replace("Modal", "");

      openModal(mode, button.dataset.need || "");
    });
  });

  document.getElementById("modalClose")
    .addEventListener("click", closeModal);

  document.getElementById("successClose")
    .addEventListener("click", closeModal);

  modalBackdrop.addEventListener("click", event => {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modalBackdrop.hidden) {
      closeModal();
    }
  });

  // Donation amount selection
  document.querySelectorAll(".amount").forEach(button => {
    button.addEventListener("click", () => {

      document.querySelectorAll(".amount").forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      amountInput.value = button.dataset.amount;
    });
  });

  amountInput.addEventListener("input", () => {
    document.querySelectorAll(".amount").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.amount === amountInput.value
      );
    });
  });

  // Form submission
  actionForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(actionForm);
    const name = formData.get("name").trim();

    if (!name) return;

    actionForm.hidden = true;
    successState.hidden = false;

    const messages = {

      donate:
        `Thank you, ${name}! Your ₹${Number(
          formData.get("amount") || 0
        ).toLocaleString("en-IN")} donation interest${
          selectedNeed ? ` for ${selectedNeed}` : ""
        } is ready for the NGO team to follow up. This is a demo; no payment was processed.`,

      volunteer:
        `Thank you, ${name}! Your volunteering interest has been recorded in this demo. The NGO team can follow up once real contact handling is connected.`,

      partner:
        `Thank you, ${name}! Your partnership enquiry is ready for follow-up in this demo. No data has been sent to a server.`
    };

    document.getElementById("successMessage").textContent =
      messages[currentMode];

    successState.querySelector("h3").textContent =
      currentMode === "donate"
        ? "Thank you for caring!"
        : currentMode === "volunteer"
        ? "Your time can make a difference!"
        : "Let's build something meaningful!";
  });

  // Mobile navigation
  document.getElementById("menuToggle").addEventListener("click", () => {
    const opened = navLinks.classList.toggle("open");

    document.getElementById("menuToggle")
      .setAttribute("aria-expanded", String(opened));
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");

      document.getElementById("menuToggle")
        .setAttribute("aria-expanded", "false");
    });
  });

  // Search interaction
  document.getElementById("searchOpen").addEventListener("click", () => {

    const query = prompt(
      "What are you looking for? Try: donate, volunteer, needs, impact, stories"
    );

    if (!query) return;

    const searchTerm = query.toLowerCase();

    const target =
      searchTerm.includes("vol") ? "#volunteer" :
      searchTerm.includes("need") || searchTerm.includes("donat") ? "#needs" :
      searchTerm.includes("impact") ? "#impact" :
      searchTerm.includes("stor") ? "#stories" :
      searchTerm.includes("partner") ? "#partner" :
      searchTerm.includes("work") ? "#work" :
      "#home";

    document.querySelector(target).scrollIntoView({
      behavior: "smooth"
    });

    showToast(`Showing ${target.replace("#", "")} section`);
  });

  // Volunteer matching based on selected skills
  document.getElementById("findOpportunities")
    .addEventListener("click", () => {

      const skills = [
        ...document.querySelectorAll(".skills-box input:checked")
      ].map(input => input.value);

      const message = document.getElementById("matchMessage");

      if (!skills.length) {
        message.textContent = "Select at least one skill to see suggestions.";
        showToast("Choose one or more skills first.");
        return;
      }

      message.textContent =
        `Matched using your selected skills: ${skills.join(", ")}.`;

      const opportunities = [
        ...document.querySelectorAll(".opportunity")
      ];

      opportunities.forEach(card => {

        const text = card.textContent.toLowerCase();

        const matches = skills.some(skill => {
          const s = skill.toLowerCase();

          return (
            (s.includes("teach") && text.includes("teach")) ||
            (s.includes("design") && text.includes("creative")) ||
            (s.includes("event") && text.includes("event")) ||
            (
              s.includes("communication") &&
              (text.includes("community") || text.includes("teach"))
            ) ||
            (s.includes("tech") && text.includes("creative")) ||
            s === "other"
          );
        });

        card.style.display = matches ? "flex" : "none";
      });

      showToast("Volunteer suggestions updated.");
    });

  // View volunteer opportunity
  document.querySelectorAll("[data-opportunity]").forEach(button => {

    button.addEventListener("click", () => {

      const title = button.dataset.opportunity;

      openModal("volunteer");

      modalTitle.textContent = `Apply: ${title}`;

      modalDescription.textContent =
        "Share your details and the NGO team can follow up about this demo opportunity.";
    });
  });

  // Story interaction
  document.querySelectorAll(".story-open").forEach(button => {

    button.addEventListener("click", () => {

      const story = button.dataset.story;

      openModal("volunteer");

      modalTitle.textContent = story;

      modalDescription.textContent =
        "This is placeholder story content for your NGO website demo. Add a real story only with the person's informed consent.";
    });
  });

  // View all needs
  document.getElementById("allNeedsButton")
    .addEventListener("click", () => {

      showToast(
        "These are sample needs for the demo. Replace them with the NGO's verified current needs."
      );

      const grid = document.getElementById("needsGrid");

      grid.classList.toggle("needs-highlight");

      setTimeout(() => {
        grid.classList.remove("needs-highlight");
      }, 1300);
    });

  // Impact report demo
  document.getElementById("reportButton")
    .addEventListener("click", () => {

      showToast(
        "Impact report is demo data. Connect verified reports before publishing."
      );
    });

  // Animated impact counters
  const counters = document.querySelectorAll("[data-count]");

  const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const element = entry.target;
      const end = Number(element.dataset.count);

      const startTime = performance.now();
      const duration = 1100;

      function tick(now) {

        const progress = Math.min(
          (now - startTime) / duration,
          1
        );

        const value = Math.floor(
          end * (1 - Math.pow(1 - progress, 3))
        );

        element.textContent =
          value.toLocaleString("en-IN") + "+";

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);

      counterObserver.unobserve(element);
    });

  }, { threshold: 0.4 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

});
// ===== FULL STORY CONTENT =====

const ngoStories = [
    {
        category: "EDUCATION",
        title: "Giving Young Minds a Chance to Learn",
        description: `Education can open doors to a brighter future.

For children from underprivileged backgrounds, access to books,
stationery, and learning resources can make continuing their
education easier.

Through education-focused initiatives, NGOs can connect
supporters with children who need learning materials and
encouragement.

Every contribution can help create an environment where
children have more opportunities to learn and grow.

Note: This is an illustrative example, not a verified
beneficiary story from a specific NGO.`
    },

    {
        category: "COMMUNITY SUPPORT",
        title: "Standing Beside Families in Difficult Times",
        description: `When families experience financial difficulties,
access to essential supplies and community support can make
a meaningful difference.

NGOs can organise donation drives and connect donors with
communities that need additional assistance.

From essential supplies to community outreach, collective
efforts can help families navigate challenging times.

Note: This is an illustrative example, not a verified
beneficiary story from a specific NGO.`
    },

    {
        category: "VOLUNTEERING",
        title: "Small Acts of Kindness, Collective Impact",
        description: `Change often begins when people decide to work together.

Volunteers can help organise donation drives, collect essential
items, distribute resources, and support community initiatives.

By bringing people together around a shared purpose, NGOs
can help turn individual acts of kindness into collective action.

Note: This is an illustrative example, not a verified
beneficiary story from a specific NGO.`
    }
];

function openStory(index) {
    const story = ngoStories[index];

    if (!story) return;

    document.getElementById("modalCategory").textContent =
        story.category;

    document.getElementById("modalTitle").textContent =
        story.title;

    document.getElementById("modalDescription").textContent =
        story.description;

    document.getElementById("storyModal").classList.add("active");

    document.body.style.overflow = "hidden";
}

function closeStory() {
    document.getElementById("storyModal").classList.remove("active");

    document.body.style.overflow = "";
}

// Close popup by clicking outside it
document.getElementById("storyModal").addEventListener("click", function(event) {
    if (event.target === this) {
        closeStory();
    }
});

// Close popup using Escape key
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeStory();
    }
});
