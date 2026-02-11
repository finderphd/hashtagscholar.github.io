
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
  if (!visitorCountEl) {
    return;
  }

  // Count unique visitors globally using CountAPI:
  // - One marker key per browser fingerprint
  // - One shared total counter key
  const COUNT_API_BASE = "https://api.counterapi.dev/v1";
  const NAMESPACE = "hashtagscholars";
  const TOTAL_KEY = "unique-visitors-total";

  async function countApi(path) {
    const response = await fetch(`${COUNT_API_BASE}${path}`, {
      method: "GET",
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error(`Counter API request failed: ${response.status}`);
    }
    return response.json();
  }

  async function getVisitorToken() {
    const existing = localStorage.getItem("visitorToken");
    if (existing) {
      return existing;
    }

    const token = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("visitorToken", token);
    return token;
  }

  async function updateUniqueVisitorCount() {
    visitorCountEl.textContent = "...";

    try {
      const token = await getVisitorToken();
      const visitorKey = `seen-${token}`;
      const visitorKeyPath = `/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(visitorKey)}`;
      const totalKeyPath = `/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(TOTAL_KEY)}`;

      // Increment per-visitor marker every load; first load will produce count=1.
      const seenResponse = await countApi(`${visitorKeyPath}/up`);
      const seenCount = Number(seenResponse?.count || 0);

      if (seenCount === 1) {
        const totalResult = await countApi(`${totalKeyPath}/up`);
        const totalCount = Number(totalResult?.count || 1);
        visitorCountEl.textContent = String(totalCount);
        localStorage.setItem("cachedVisitorCount", String(totalCount));
        return;
      }

      const totalResult = await countApi(totalKeyPath);
      const totalCount = Number(totalResult?.count || 0);
      visitorCountEl.textContent = String(totalCount);
      localStorage.setItem("cachedVisitorCount", String(totalCount));
    } catch (error) {
      console.error("Visitor counter failed:", error);
      visitorCountEl.textContent = localStorage.getItem("cachedVisitorCount") || "0";
    }
  }

  updateUniqueVisitorCount();
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
