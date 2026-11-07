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
    { title: "Latest Episode", hint: "Remastered Episode 1 · Introduction", href: "index.html#latest" },
    { title: "Adventures", hint: "Explore", href: "adventures.html" },
    { title: "Lunar Expedition", hint: "Adventures", href: "adventures.html" },
    { title: "Buddy & Malley Remastered", hint: "Adventures", href: "adventures.html" },
    { title: "Remastered", hint: "Catch Up · YouTube playlist", href: "https://www.youtube.com/playlist?list=PLMj7z8zenfUA" },
    { title: "Lessons & Extras", hint: "Adventures", href: "adventures.html" },
    { title: "Lessons and Extras", hint: "Catch Up · YouTube playlist", href: "https://www.youtube.com/watch?v=2ov-cvUPiAk&list=PLDJLloAznSp8" },
    { title: "Meet the Crew", hint: "Explore", href: "meet-the-crew.html" },
    { title: "Buddy", hint: "The Enthusiast · Meet the Crew", href: "meet-the-crew.html" },
    { title: "Malley", hint: "The Planner · Meet the Crew", href: "meet-the-crew.html" },
    { title: "Oscar", hint: "The Observer · Meet the Crew", href: "meet-the-crew.html" },
    { title: "Our World", hint: "Explore", href: "our-world.html" },
    { title: "Lunar Expedition", hint: "Our World", href: "our-world.html" },
    { title: "Space Exploration Agency", hint: "Our World", href: "our-world.html" },
    { title: "Rocket", hint: "Our World · Lunar Expedition", href: "our-world.html" },
    { title: "LEM", hint: "Our World · Lunar Excursion Module", href: "our-world.html" },
    { title: "Rocket Cradle", hint: "Our World", href: "our-world.html" },
    { title: "Spacesuit", hint: "Our World", href: "our-world.html" },
    { title: "Space Helmet", hint: "Our World", href: "our-world.html" },
    { title: "Transport Ring", hint: "Our World · moon samples", href: "our-world.html" },
    { title: "Comforts of Home", hint: "Our World", href: "our-world.html" },
    { title: "Buddy's Red Ball", hint: "Our World", href: "our-world.html" },
    { title: "Bed", hint: "Our World · Comforts of Home", href: "our-world.html" },
    { title: "Fountain", hint: "Our World · Comforts of Home", href: "our-world.html" },
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

  /* ---------- Newsletter signup (pages that still use the local placeholder form) ---------- */
  const form = document.getElementById("signup-form");
  if (form) {
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
  }

  /* ---------- One-at-a-time pickers (crew + adventures) ---------- */
  const phoneQuery = window.matchMedia("(max-width: 800px)");

  function bindPicker(panel, keys) {
    if (!panel) return;
    const tabs = [...panel.querySelectorAll(".crew-tab")].filter((tab) => !tab.hidden);
    const cards = [...panel.querySelectorAll(".chapter[data-" + keys.card + "]")].filter((card) => !card.hidden);
    const bar = panel.querySelector(".crew-tabs");

    function setPick(name, options) {
      const opts = options || {};
      tabs.forEach((tab) => {
        const on = tab.dataset[keys.tab] === name;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        if (on && opts.focus) tab.focus();
      });
      cards.forEach((card) => card.classList.toggle("is-active", card.dataset[keys.card] === name));
      panel.dataset.active = name;
      if (opts.scroll && phoneQuery.matches) {
        const card = cards.find((c) => c.dataset[keys.card] === name);
        const header = document.querySelector(".site-header").offsetHeight;
        const top = card.getBoundingClientRect().top;
        const limit = header + bar.offsetHeight;
        if (top < limit) {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: Math.max(0, top + window.scrollY - limit - 8), behavior: reduce ? "auto" : "smooth" });
        }
      }
    }

    panel.querySelectorAll("[data-" + keys.nextAttr + "]").forEach((btn) => {
      btn.addEventListener("click", () => setPick(btn.dataset[keys.next], { scroll: true }));
    });

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => setPick(tab.dataset[keys.tab], { scroll: true }));
      tab.addEventListener("keydown", (event) => {
        let next = -1;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (next < 0) return;
        event.preventDefault();
        setPick(tabs[next].dataset[keys.tab], { focus: true });
      });
    });

    let swipeStart = null;
    cards.forEach((card) => {
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
        const current = cards.findIndex((c) => c.classList.contains("is-active"));
        const next = dx < 0 ? current + 1 : current - 1;
        if (next < 0 || next >= cards.length) return;
        setPick(cards[next].dataset[keys.card], { scroll: true });
      }, { passive: true });
    });
  }

  bindPicker(document.getElementById("details-meet"), { tab: "crewTab", card: "crew", next: "crewNext", nextAttr: "crew-next" });
  bindPicker(document.getElementById("details-adventures"), { tab: "advTab", card: "adv", next: "advNext", nextAttr: "adv-next" });
  bindPicker(document.getElementById("world-group-lunar"), { tab: "worldTab", card: "world", next: "worldNext", nextAttr: "world-next" });
  bindPicker(document.getElementById("world-group-home"), { tab: "worldTab", card: "world", next: "worldNext", nextAttr: "world-next" });

  const worldPanel = document.getElementById("details-world");
  if (worldPanel) {
    const groupTabs = [...worldPanel.querySelectorAll("[data-world-group-tab]")];
    const groups = [...worldPanel.querySelectorAll(".world-group")];

    function showWorldGroup(name, options) {
      const opts = options || {};
      groupTabs.forEach((tab) => {
        const on = tab.dataset.worldGroupTab === name;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        if (on && opts.focus) tab.focus();
      });
      groups.forEach((group) => {
        const on = group.dataset.worldGroup === name;
        group.hidden = !on;
        group.classList.toggle("is-active", on);
      });
      worldPanel.dataset.group = name;
    }

    groupTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => showWorldGroup(tab.dataset.worldGroupTab));
      tab.addEventListener("keydown", (event) => {
        let next = -1;
        if (event.key === "ArrowRight") next = (index + 1) % groupTabs.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + groupTabs.length) % groupTabs.length;
        if (next < 0) return;
        event.preventDefault();
        showWorldGroup(groupTabs[next].dataset.worldGroupTab, { focus: true });
      });
    });

    worldPanel.querySelectorAll("[data-world-group-next]").forEach((btn) => {
      btn.addEventListener("click", () => showWorldGroup(btn.dataset.worldGroupNext));
    });
  }
})();
