document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbarCont");
  const navbarSection = document.getElementById("navbarSection");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.getElementById("siteNav");
  const year = document.getElementById("footerYear");

  if (year) year.textContent = new Date().getFullYear();

  const updateNav = () => {
    const scrolled = window.scrollY > 24;
    navbar?.classList.toggle("scrolled", scrolled);
    navbarSection?.classList.toggle("scrolledtoo", scrolled);
  };
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav?.classList.toggle("is-open", !isOpen);
  });

  siteNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // One shared audio element keeps the page from playing multiple demos at once.
  const audio = document.getElementById("characterAudio");
  const cards = [...document.querySelectorAll("[data-character-audio]")];
  const note = document.getElementById("audioNote");
  let activeCard = null;

  function setCardState(card, playing) {
    if (!card) return;
    card.classList.toggle("is-playing", playing);
    card.setAttribute("aria-pressed", String(playing));
  }

  function resetCards() {
    cards.forEach(card => setCardState(card, false));
    activeCard = null;
  }

  cards.forEach(card => {
    card.addEventListener("click", async () => {
      if (!audio) return;
      const source = card.dataset.characterAudio;
      if (!source) return;

      if (activeCard === card && !audio.paused) {
        audio.pause();
        setCardState(card, false);
        if (note) note.textContent = "Playback paused. Select the demo again to continue.";
        return;
      }

      audio.pause();
      audio.currentTime = 0;
      resetCards();
      activeCard = card;
      audio.src = source;
      setCardState(card, true);

      try {
        await audio.play();
        if (note) note.textContent = `Now playing: ${card.querySelector(".char-name")?.textContent || "voice demo"}.`;
      } catch (error) {
        resetCards();
        if (note) note.textContent = "Demo audio is not available yet. Add the approved MP3 file to the matching path in assets/audio/ before launch.";
      }
    });
  });

  audio?.addEventListener("ended", () => {
    resetCards();
    if (note) note.textContent = "Demo finished. Choose another sample to listen again.";
  });

  audio?.addEventListener("error", () => {
    resetCards();
    if (note) note.textContent = "Could not load this audio file. Check the file path and make sure the approved MP3 is in assets/audio/.";
  });

  // This demo form prepares an email; it does not submit data to a server.
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  contactForm?.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const type = String(data.get("inquiry_type") || "").trim();
    const message = String(data.get("message") || "").trim();

    // Replace this placeholder with Jackoby's confirmed booking address before launch.
    const recipient = "jackobyclinton@gmail.com";
    const subject = encodeURIComponent(`Website inquiry: ${type}`);
    const body = encodeURIComponent(
      `Hi Jackoby,\n\n${message}\n\nProject type: ${type}\nFrom: ${name}\nReply email: ${email}`
    );

    if (formStatus) {
      formStatus.textContent = "Your email app should open with the message prepared. Please confirm the booking email address before the site goes live.";
    }
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });
});
