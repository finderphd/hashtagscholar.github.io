// script.js
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
      };

      // Basic validation
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showMessage('Please fill in all fields.', 'error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }

      const recipient = "finderphd@gmail.com";
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

      // Open user's email client with prefilled content
      window.location.href = mailtoUrl;

      showMessage('Your email app should open now. If it didn\'t, please try again.', 'success');
      contactForm.reset();
    });
  }

  // Helper function to show form messages
  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.style.display = 'block';
    formMessage.style.color = type === 'success' ? '#28a745' : '#dc3545';
    formMessage.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    formMessage.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
    formMessage.style.padding = '10px';
    formMessage.style.borderRadius = '4px';
    formMessage.style.marginTop = '10px';

    // Auto-hide message after 5 seconds
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const visitorCountEl = document.getElementById("visitorCount");
  if (!visitorCountEl) return;

  const API_BASE = "https://api.counterapi.dev/v1";
  const NAMESPACE = "hashtagscholars";
  const TOTAL_KEY = "unique-visitors-total";

  async function callAPI(path) {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) throw new Error("API failed");
    return res.json();
  }

  async function updateVisitorCount() {
    visitorCountEl.textContent = "...";

    try {
      // 1️⃣ Get or create a unique ID for this browser
      let browserId = localStorage.getItem("browser_id");
      if (!browserId) {
        browserId = crypto.randomUUID();
        localStorage.setItem("browser_id", browserId);
      }

      const visitorKey = `visitor-${browserId}`;

      // 2️⃣ Increment visitor-specific key
      await callAPI(`/${NAMESPACE}/${visitorKey}/up`);

      // 3️⃣ Get visitor key count
      const visitorRes = await callAPI(`/${NAMESPACE}/${visitorKey}`);
      const visitorCount = Number(visitorRes?.count || 0);

      // 4️⃣ If first visit, increment total unique visitors
      if (visitorCount === 1) {
        await callAPI(`/${NAMESPACE}/${TOTAL_KEY}/up`);
      }

      // 5️⃣ Get total unique visitors
      const totalRes = await callAPI(`/${NAMESPACE}/${TOTAL_KEY}`);
      visitorCountEl.textContent = totalRes?.count || 1;

      // 6️⃣ Cache locally
      localStorage.setItem("cachedVisitorCount", totalRes?.count || 1);

    } catch (err) {
      console.error("Visitor counter error:", err);
      visitorCountEl.textContent =
        localStorage.getItem("cachedVisitorCount") || "1";
    }
  }

  updateVisitorCount();
});



// Welcome overlay behavior
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("welcome-overlay");
  const enterBtn = document.getElementById("enter-site");
  if (!overlay || !enterBtn) {
    return;
  }
  
  // Always show the welcome overlay on page load if:
  // 1. It's a reload
  // 2. Or if the user hasn't seen it yet in this session
  
  const navEntry = performance.getEntriesByType("navigation")[0];
  const isReload = navEntry ? navEntry.type === 'reload' : performance.navigation.type === 1;
  const hasSeenWelcome = sessionStorage.getItem('has_seen_welcome');

  if (isReload || !hasSeenWelcome) {
    overlay.style.display = "flex";
  }
  
  // Handle enter button click
  enterBtn.addEventListener("click", () => {
    overlay.classList.add("hide");
    sessionStorage.setItem('has_seen_welcome', 'true');
    
    setTimeout(() => {
      overlay.style.display = "none";
    }, 700);
  });
});

// Coming soon popup
document.querySelectorAll(".coming-soon").forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const text = item.textContent.trim();
    showComingSoonModal(text);
  });
});

// Smooth scroll (if not already enabled)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Coming Soon Modal Functions
function showComingSoonModal(text) {
  const modal = document.getElementById("comingSoonModal");
  const textElement = document.getElementById("comingSoonText");
  
  // Update the text based on what was clicked
  if (text.includes("Blogs")) {
    textElement.textContent = "Our blog section is under construction. Stay tuned for insightful articles!";
  } else if (text.includes("Podcasts")) {
    textElement.textContent = "Our podcast series is being recorded. Get ready for amazing conversations!";
  } else if (text.includes("Scholars")) {
    textElement.textContent = "Scholars' Stories coming soon. Inspiring journeys await!";
  } else {
    textElement.textContent = "We're working on something amazing!";
  }
  
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeComingSoonModal() {
  const modal = document.getElementById("comingSoonModal");
  if (!modal) {
    return;
  }
  modal.classList.remove("active");
  document.body.style.overflow = ""; // Re-enable background scrolling
}

// Close modal when clicking outside
const comingSoonModal = document.getElementById("comingSoonModal");
if (comingSoonModal) {
  comingSoonModal.addEventListener("click", (e) => {
    if (e.target.id === "comingSoonModal") {
      closeComingSoonModal();
    }
  });
}

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeComingSoonModal();
  }
});
