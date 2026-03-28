const siteConfig = {
  startDate: new Date("2018-09-16T00:00:00+08:00"),
};

const numberFormatter = new Intl.NumberFormat("zh-CN");
const counterIds = ["daysTogether", "hoursTogether", "minutesTogether", "secondsTogether"];

function formatNumber(value) {
  return numberFormatter.format(value);
}

function updateTogetherCounter() {
  const now = new Date();
  const diff = now - siteConfig.startDate;

  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const values = [totalDays, totalHours, totalMinutes, totalSeconds];

  for (const [index, id] of counterIds.entries()) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = formatNumber(values[index]);
    }
  }
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function setupTiltCards() {
  const cards = document.querySelectorAll(
    ".hero-card, .status-card, .glass-card, .memory, .timeline-panel, .quote-card, .promise-card, .letter-card"
  );

  cards.forEach((card) => {
    card.setAttribute("data-tilt", "");

    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 900) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = ((event.clientY - centerY) / rect.height) * -5;
      const rotateY = ((event.clientX - centerX) / rect.width) * 5;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function createStarfield() {
  const canvas = document.getElementById("stars");
  const context = canvas.getContext("2d");
  const stars = [];
  const maxStars = Math.min(220, Math.max(120, Math.floor(window.innerWidth / 8)));

  function resize() {
    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);

    stars.length = 0;
    for (let i = 0; i < maxStars; i += 1) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.7 + 0.2,
        alpha: Math.random() * 0.7 + 0.12,
        speed: Math.random() * 0.24 + 0.04,
      });
    }
  }

  function render() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const star of stars) {
      star.y += star.speed;
      if (star.y > window.innerHeight + 12) {
        star.y = -12;
        star.x = Math.random() * window.innerWidth;
      }

      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 246, 222, ${star.alpha})`;
      context.fill();
    }

    requestAnimationFrame(render);
  }

  resize();
  render();
  window.addEventListener("resize", resize);
}

updateTogetherCounter();
setInterval(updateTogetherCounter, 1000);
setupRevealAnimations();
setupTiltCards();
createStarfield();
