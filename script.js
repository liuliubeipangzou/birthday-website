const siteConfig = {
  startDate: new Date("2018-09-16T00:00:00+08:00"),
};

const counterIds = ["daysTogether", "hoursTogether", "minutesTogether", "secondsTogether"];
const numberFormatter = new Intl.NumberFormat("zh-CN");

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
  const cards = document.querySelectorAll(".tilt-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 900) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = ((event.clientY - centerY) / rect.height) * -5;
      const rotateY = ((event.clientX - centerX) / rect.width) * 5;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function setupCursorGlow() {
  const cursorGlow = document.getElementById("cursorGlow");
  if (!cursorGlow || window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.transform = `translate(${event.clientX - 208}px, ${event.clientY - 208}px)`;
  });
}

function setupGiftInteraction() {
  const giftButton = document.getElementById("giftButton");
  const giftBox = document.getElementById("giftBox");
  const secretMessage = document.getElementById("secretMessage");

  if (!giftButton || !giftBox || !secretMessage) {
    return;
  }

  giftButton.addEventListener("click", () => {
    giftBox.classList.add("open");
    secretMessage.classList.add("visible");
    giftButton.textContent = "礼物已打开";
    giftButton.disabled = true;
    launchBirthdayFireworks();
  });
}

function createFireworksEngine() {
  const canvas = document.getElementById("fireworks");
  const context = canvas.getContext("2d");
  const rockets = [];
  const particles = [];

  function resize() {
    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function randomColor() {
    const colors = ["#ffd77d", "#ff8fb1", "#8fe0ff", "#fff1c8", "#c5a8ff"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function explode(x, y, color) {
    const count = 56 + Math.floor(Math.random() * 22);
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1.6 + Math.random() * 3.4;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 70 + Math.random() * 18,
        alpha: 1,
        color,
        size: 1.6 + Math.random() * 2.2,
      });
    }
  }

  function launch(x, targetY, color) {
    rockets.push({
      x,
      y: window.innerHeight + 20,
      targetY,
      vy: 6.5 + Math.random() * 1.2,
      color,
    });
  }

  function render() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = rockets.length - 1; i >= 0; i -= 1) {
      const rocket = rockets[i];
      rocket.y -= rocket.vy;

      context.beginPath();
      context.arc(rocket.x, rocket.y, 2.4, 0, Math.PI * 2);
      context.fillStyle = rocket.color;
      context.fill();

      context.beginPath();
      context.moveTo(rocket.x, rocket.y);
      context.lineTo(rocket.x, rocket.y + 18);
      context.strokeStyle = `${rocket.color}88`;
      context.lineWidth = 2;
      context.stroke();

      if (rocket.y <= rocket.targetY) {
        explode(rocket.x, rocket.y, rocket.color);
        rockets.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.035;
      particle.vx *= 0.992;
      particle.vy *= 0.992;
      particle.life -= 1;
      particle.alpha = Math.max(0, particle.life / 88);

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fillStyle = `${particle.color}${Math.round(particle.alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
      context.fill();

      if (particle.life <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  resize();
  render();
  window.addEventListener("resize", resize);

  return {
    celebrate() {
      const bursts = [
        { x: window.innerWidth * 0.22, y: window.innerHeight * 0.26, delay: 0 },
        { x: window.innerWidth * 0.74, y: window.innerHeight * 0.2, delay: 220 },
        { x: window.innerWidth * 0.48, y: window.innerHeight * 0.3, delay: 420 },
        { x: window.innerWidth * 0.3, y: window.innerHeight * 0.18, delay: 720 },
        { x: window.innerWidth * 0.68, y: window.innerHeight * 0.34, delay: 900 },
      ];

      for (const burst of bursts) {
        window.setTimeout(() => launch(burst.x, burst.y, randomColor()), burst.delay);
      }
    },
  };
}

let fireworksEngine;

function launchBirthdayFireworks() {
  if (!fireworksEngine) {
    return;
  }

  fireworksEngine.celebrate();
}

function createStarfield() {
  const canvas = document.getElementById("stars");
  const context = canvas.getContext("2d");
  const stars = [];

  function getStarCount() {
    return Math.min(220, Math.max(120, Math.floor(window.innerWidth / 8)));
  }

  function resize() {
    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);

    stars.length = 0;
    for (let i = 0; i < getStarCount(); i += 1) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.6 + 0.2,
        alpha: Math.random() * 0.7 + 0.12,
        speed: Math.random() * 0.25 + 0.04,
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
      context.fillStyle = `rgba(255, 245, 219, ${star.alpha})`;
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
setupCursorGlow();
setupGiftInteraction();
createStarfield();
fireworksEngine = createFireworksEngine();
