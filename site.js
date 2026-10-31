(() => {
  "use strict";

  /* ---------- Mobile menu ---------- */
  const nav = document.getElementById("site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = [...document.querySelectorAll(".nav-links a")];

  function closeMenu() {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1180) closeMenu();
  });

  /* ---------- Home page: highlight "Catch Up" when its section is targeted ---------- */
  if (document.body.dataset.page === "home") {
    const home = navLinks.find((a) => a.getAttribute("href") === "index.html");
    const catchUp = navLinks.find((a) => a.getAttribute("href") === "index.html#catch-up");
    const syncCurrent = () => {
      const onCatchUp = location.hash === "#catch-up";
      if (!home || !catchUp) return;
      if (onCatchUp) {
        home.removeAttribute("aria-current");
        catchUp.setAttribute("aria-current", "page");
      } else {
        catchUp.removeAttribute("aria-current");
        home.setAttribute("aria-current", "page");
      }
    };
    window.addEventListener("hashchange", syncCurrent);
    syncCurrent();
  }

  /* ---------- Search ---------- */
  const catalog = [
    { title: "Home", hint: "Every adventure starts with a wag", href: "index.html" },
    { title: "Catch Up", hint: "Explore Adventures", href: "index.html#catch-up" },
    { title: "Latest Episode", hint: "Episode 16 · Moon Capsule Recovery", href: "index.html#latest" },
    { title: "Adventures", hint: "Explore", href: "adventures.html" },
    { title: "The Lunar Expedition", hint: "Adventures", href: "adventures.html" },
    { title: "The Camping Adventure", hint: "Adventures", href: "adventures.html" },
    { title: "Early Adventures", hint: "Adventures", href: "adventures.html" },
    { title: "Remastered", hint: "Catch Up · YouTube playlist", href: "https://www.youtube.com/playlist?list=PLMj7z8zenfUA" },
    { title: "Shorts & Extras", hint: "Adventures", href: "adventures.html" },
    { title: "Meet the Crew", hint: "Explore", href: "meet-the-crew.html" },
    { title: "Buddy", hint: "The Enthusiast · Meet the Crew", href: "meet-the-crew.html" },
    { title: "Malley", hint: "The Planner · Meet the Crew", href: "meet-the-crew.html" },
    { title: "Oscar", hint: "The Observer · Meet the Crew", href: "meet-the-crew.html" },
    { title: "Our World", hint: "Explore", href: "our-world.html" },
    { title: "Behind the Scenes", hint: "Explore", href: "behind-the-scenes.html" },
    { title: "Toys & Equipment", hint: "Explore", href: "toys-and-equipment.html" },
    { title: "Stay Up to Date", hint: "Newsletter", href: "#signup" }
  ];

  const searchDialog = document.getElementById("search-dialog");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchForm = document.getElementById("search-form");

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    const matches = catalog.filter((item) => {
      const hay = (item.title + " " + item.hint).toLowerCase();
      return q === "" || hay.includes(q);
    });
    searchResults.innerHTML = "";
    if (!matches.length) {
      const note = document.createElement("li");
      note.className = "empty-note";
      note.textContent = "Nothing matches that yet.";
      searchResults.appendChild(note);
      return;
    }
    matches.forEach((item) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.href;
      const title = document.createElement("strong");
      title.textContent = item.title;
      const hint = document.createElement("span");
      hint.textContent = item.hint;
      link.append(title, hint);
      link.addEventListener("click", () => searchDialog.close());
      li.appendChild(link);
      searchResults.appendChild(li);
    });
  }

  document.getElementById("open-search").addEventListener("click", () => {
    searchInput.value = "";
    renderResults("");
    searchDialog.showModal();
    searchInput.focus();
  });
  searchInput.addEventListener("input", () => renderResults(searchInput.value));
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const first = searchResults.querySelector("a");
    if (first) first.click();
  });

  /* ---------- Dialogs ---------- */
  document.getElementById("open-account").addEventListener("click", () => {
    document.getElementById("account-dialog").showModal();
  });
  document.querySelectorAll("[data-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.dialog).showModal();
    });
  });
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.querySelectorAll("[data-close]").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });
  });

  /* ---------- Toast + social buttons ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(message) {
    toast.hidden = false;
    toast.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
  }
  document.querySelectorAll("[data-social]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(button.dataset.social + " is almost ready.");
    });
  });

  /* ---------- Newsletter signup ---------- */
  const form = document.getElementById("signup-form");
  const email = document.getElementById("email");
  const status = document.getElementById("form-status");
  const submitBtn = form.querySelector("button[type=submit]");

  function markSignedUp() {
    status.textContent = "You're in. This browser will remember you stopped by.";
    status.classList.add("ok");
    email.value = "";
    email.disabled = true;
    email.removeAttribute("aria-invalid");
    submitBtn.textContent = "Subscribed";
    submitBtn.disabled = true;
  }

  if (localStorage.getItem("bm-signup") === "1") markSignedUp();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = email.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!ok) {
      email.setAttribute("aria-invalid", "true");
      status.classList.remove("ok");
      status.textContent = value ? "That email doesn't look quite right." : "Add your email so the crew knows where to send the news.";
      email.focus();
      return;
    }
    localStorage.setItem("bm-signup", "1");
    markSignedUp();
  });

  /* ---------- Meet the Crew: one character at a time ---------- */
  const crewPanel = document.getElementById("details-meet");
  if (crewPanel) {
    const crewTabs = [...crewPanel.querySelectorAll(".crew-tab")];
    const crewCards = [...crewPanel.querySelectorAll(".chapter[data-crew]")];
    const crewBar = crewPanel.querySelector(".crew-tabs");
    const phoneQuery = window.matchMedia("(max-width: 800px)");

    function setCrew(name, options) {
      const opts = options || {};
      crewTabs.forEach((tab) => {
        const on = tab.dataset.crewTab === name;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        if (on && opts.focus) tab.focus();
      });
      crewCards.forEach((card) => card.classList.toggle("is-active", card.dataset.crew === name));
      crewPanel.dataset.active = name;
      if (opts.scroll && phoneQuery.matches) {
        const card = crewCards.find((c) => c.dataset.crew === name);
        const header = document.querySelector(".site-header").offsetHeight;
        const top = card.getBoundingClientRect().top;
        const limit = header + crewBar.offsetHeight;
        if (top < limit) {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: Math.max(0, top + window.scrollY - limit - 8), behavior: reduce ? "auto" : "smooth" });
        }
      }
    }

    crewPanel.querySelectorAll("[data-crew-next]").forEach((btn) => {
      btn.addEventListener("click", () => setCrew(btn.dataset.crewNext, { scroll: true }));
    });

    crewTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => setCrew(tab.dataset.crewTab, { scroll: true }));
      tab.addEventListener("keydown", (event) => {
        let next = -1;
        if (event.key === "ArrowRight") next = (index + 1) % crewTabs.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + crewTabs.length) % crewTabs.length;
        if (next < 0) return;
        event.preventDefault();
        setCrew(crewTabs[next].dataset.crewTab, { focus: true });
      });
    });

    let swipeStart = null;
    crewCards.forEach((card) => {
      card.addEventListener("touchstart", (event) => {
        const t = event.touches[0];
        swipeStart = { x: t.clientX, y: t.clientY };
      }, { passive: true });
      card.addEventListener("touchend", (event) => {
        if (!swipeStart || !phoneQuery.matches) return;
        const t = event.changedTouches[0];
        const dx = t.clientX - swipeStart.x;
        const dy = t.clientY - swipeStart.y;
        swipeStart = null;
        if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        const current = crewCards.findIndex((c) => c.classList.contains("is-active"));
        const next = dx < 0 ? current + 1 : current - 1;
        if (next < 0 || next >= crewCards.length) return;
        setCrew(crewCards[next].dataset.crew, { scroll: true });
      }, { passive: true });
    });
  }
})();
