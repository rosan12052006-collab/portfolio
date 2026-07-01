document.getElementById("year").textContent = new Date().getFullYear();

/* ---------------- Custom cursor ---------------- */
const cursorDot = document.querySelector(".cursor-dot");
if (cursorDot) {
  window.addEventListener("mousemove", (e) => {
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
  });
  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => { cursorDot.style.width = "20px"; cursorDot.style.height = "20px"; });
    el.addEventListener("mouseleave", () => { cursorDot.style.width = "8px"; cursorDot.style.height = "8px"; });
  });
}

/* ---------------- Mobile nav toggle ---------------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav__links");
navToggle?.addEventListener("click", () => navLinks.classList.toggle("is-open"));
navLinks?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("is-open"))
);

/* ---------------- Terminal typing effect (hero signature element) ---------------- */
const terminalLines = [
  { type: "cmd", text: "whoami" },
  { type: "out", text: "rosan-s · full-stack developer" },
  { type: "cmd", text: "cat skills.json" },
  { type: "out", text: '["React", "Node.js", "Express", "MongoDB", "Python", "Flask"]' },
  { type: "cmd", text: "ls projects/" },
  { type: "out", text: "promptc  taskledger  ecommerce  inkwell" },
  { type: "cmd", text: "npm run deploy" },
  { type: "out", text: "✓ build complete · live on Render + Vercel" },
];

async function typeTerminal() {
  const body = document.getElementById("terminalBody");
  if (!body) return;
  for (const line of terminalLines) {
    const el = document.createElement("div");
    if (line.type === "cmd") {
      el.innerHTML = `<span class="prompt">$</span> `;
      body.appendChild(el);
      for (const ch of line.text) {
        el.innerHTML += ch;
        await sleep(28);
      }
      await sleep(250);
    } else {
      el.className = "line-out";
      el.textContent = line.text;
      body.appendChild(el);
      await sleep(350);
    }
  }
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
typeTerminal();

/* ---------------- Status line rotator ---------------- */
const statusMessages = [
  "currently building things that ship",
  "open to internships & freelance work",
  "creator of promptc — an NL-to-app compiler",
];
let statusIndex = 0;
setInterval(() => {
  statusIndex = (statusIndex + 1) % statusMessages.length;
  const el = document.getElementById("statusLine");
  if (el) {
    el.style.opacity = 0;
    setTimeout(() => {
      el.textContent = statusMessages[statusIndex];
      el.style.opacity = 1;
    }, 200);
  }
}, 3500);

/* ---------------- Scroll reveal ---------------- */
const revealEls = document.querySelectorAll(
  ".section-head, .skill-card, .about__lead, .about__stats, .contact-form"
);
revealEls.forEach((el) => el.classList.add("reveal"));
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

/* ---------------- Fetch & render projects ---------------- */
const projectGrid = document.getElementById("projectGrid");
const workEmpty = document.getElementById("workEmpty");
const filterBar = document.getElementById("filterBar");
let allProjects = [];

async function loadProjects() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/projects`);
    if (!res.ok) throw new Error("Request failed");
    allProjects = await res.json();
    renderFilters(allProjects);
    renderProjects(allProjects);
  } catch (err) {
    console.error("Failed to load projects:", err);
    projectGrid.innerHTML = "";
    workEmpty.hidden = false;
    workEmpty.textContent =
      "Couldn't reach the API. Check that the backend is running and API_BASE_URL in js/config.js is correct.";
  }
}

function renderFilters(projects) {
  const categories = ["all", ...new Set(projects.map((p) => p.category).filter(Boolean))];
  filterBar.innerHTML = categories
    .map(
      (cat, i) =>
        `<button class="filter-btn ${i === 0 ? "is-active" : ""}" data-filter="${cat}">${
          cat === "all" ? "All" : cat
        }</button>`
    )
    .join("");

  filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      const filtered = filter === "all" ? allProjects : allProjects.filter((p) => p.category === filter);
      renderProjects(filtered);
    });
  });
}

function renderProjects(projects) {
  if (!projects.length) {
    projectGrid.innerHTML = "";
    workEmpty.hidden = false;
    return;
  }
  workEmpty.hidden = true;

  projectGrid.innerHTML = projects
    .map((p, i) => {
      const tech = (p.techStack || [])
        .map((t) => `<span class="tech-pill">${escapeHtml(t)}</span>`)
        .join("");
      const mediaStyle = p.image ? `style="background-image:url('${escapeHtml(p.image)}')"` : "";
      const clickUrl = p.liveUrl || p.repoUrl || "";
      return `
        <article class="project-card reveal" style="transition-delay:${i * 60}ms" data-url="${escapeHtml(clickUrl)}">
          <div class="project-card__media" ${mediaStyle}>
            ${p.liveUrl ? '<span class="live-badge">● Live</span>' : ""}
          </div>
          <div class="project-card__body">
            <span class="project-card__cat">${escapeHtml(p.category || "Project")}</span>
            <h3 class="project-card__title">${escapeHtml(p.title)}</h3>
            <p class="project-card__summary">${escapeHtml(p.summary)}</p>
            <div class="project-card__tech">${tech}</div>
            <div class="project-card__links">
              ${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener">Live ↗</a>` : ""}
              ${p.repoUrl ? `<a href="${escapeHtml(p.repoUrl)}" target="_blank" rel="noopener">Code ↗</a>` : ""}
            </div>
          </div>
        </article>`;
    })
    .join("");

  // re-observe newly added cards for reveal animation
  document.querySelectorAll(".project-card.reveal").forEach((el) => observer.observe(el));

  // Make the whole card clickable (opens liveUrl, or repoUrl if no live link)
  document.querySelectorAll(".project-card[data-url]").forEach((card) => {
    const url = card.dataset.url;
    if (!url) return;
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.open(url, "_blank", "noopener");
    });
    // Prevent inner links from double-triggering (let them handle their own navigation)
    card.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", (e) => e.stopPropagation());
    });
  });
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadProjects();

/* ---------------- Contact form submission ---------------- */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    setStatus("Please fill in all fields.", "error");
    return;
  }

  submitBtn.disabled = true;
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = "Sending...";
  setStatus("", "");

  try {
    const res = await fetch(`${API_BASE_URL}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to send");

    setStatus("Message sent — I'll get back to you soon.", "success");
    contactForm.reset();
  } catch (err) {
    setStatus("Something went wrong. Please try again or email me directly.", "error");
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

function setStatus(text, type) {
  formStatus.textContent = text;
  formStatus.className = "form-status" + (type ? ` is-${type}` : "");
}
