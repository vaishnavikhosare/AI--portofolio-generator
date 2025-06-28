function startGenerator() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("form-section").style.display = "block";
}

window.onload = function () {
  document.getElementById("addProjectBtn").addEventListener("click", addProject);

  document.getElementById("portfolioForm").addEventListener("submit", function (e) {
    e.preventDefault();
    generatePortfolio();
  });
};

function addProject() {
  const container = document.getElementById("projectsContainer");
  const div = document.createElement("div");
  div.className = "project-input";
  div.innerHTML = `
    <input type="text" class="projectTitle" placeholder="Project Name" required />
    <input type="url" class="projectLink" placeholder="Project Link (https://...)" required />
  `;
  container.appendChild(div);
}

function generatePortfolio() {
  const name = document.getElementById("name").value;
  const bio = document.getElementById("bio").value;
  const skills = document.getElementById("skills").value.split(",");
  const contact = document.getElementById("contact").value;
  const github = document.getElementById("github").value;
  const linkedin = document.getElementById("linkedin").value;
  const template = document.getElementById("template").value;

  const projectTitles = Array.from(document.getElementsByClassName("projectTitle")).map(i => i.value);
  const projectLinks = Array.from(document.getElementsByClassName("projectLink")).map(i => i.value);
  const projects = projectTitles.map((title, i) => ({ title, link: projectLinks[i] }));

  const profileInput = document.getElementById("profilePic");
  const resumeInput = document.getElementById("resumeFile");

  if (!profileInput.files.length || !resumeInput.files.length) {
    alert("Please upload both profile picture and resume.");
    return;
  }

  const profileReader = new FileReader();
  const resumeReader = new FileReader();

  profileReader.onload = function () {
    const profileImage = profileReader.result;

    resumeReader.onload = function () {
      const resumeDataURL = resumeReader.result;

      document.getElementById("loading").style.display = "block";

      setTimeout(() => {
        const html = generateTemplate(
          template,
          name,
          bio,
          skills,
          projects,
          contact,
          github,
          linkedin,
          profileImage,
          resumeDataURL
        );

        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        document.getElementById("previewFrame").src = url;
        document.getElementById("loading").style.display = "none";
        document.getElementById("previewArea").style.display = "block";

        window.generatedHTML = html;
        document.getElementById("previewArea").scrollIntoView({ behavior: "smooth" });
      }, 100);
    };

    resumeReader.readAsDataURL(resumeInput.files[0]);
  };

  profileReader.readAsDataURL(profileInput.files[0]);
}

function downloadPortfolio() {
  const blob = new Blob([window.generatedHTML], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "portfolio.html";
  a.click();
}

function generateTemplate(template, name, bio, skills, projects, contact, github, linkedin, profileImg, resumeURL) {
  const iconScript = `<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/js/all.min.js" crossorigin="anonymous"></script>`;
  const resumeBtn = `<a href="${resumeURL}" download="My_Resume.pdf" style="text-decoration:none;">
    <button style="padding:10px 20px; border:none; background:#0077b6; color:white; border-radius:5px; cursor:pointer;">
      Download My Resume
    </button></a>`;
  const footer = `
    <footer style="text-align:center; padding: 15px; background: #222; color: white; font-size: 1.2rem;">
      ${github ? `<a href="${github}" target="_blank" style="margin: 0 15px; color:white;" title="GitHub"><i class="fab fa-github"></i></a>` : ""}
      ${linkedin ? `<a href="${linkedin}" target="_blank" style="margin: 0 15px; color:white;" title="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ""}
    </footer>
  `;

  const skillsList = `<ul>${skills.map(skill => `<li>${skill.trim()}</li>`).join("")}</ul>`;
  const projectsList = `<ul>${projects.map(project => `
    <li><a href="${project.link}" target="_blank">${project.title}</a></li>
  `).join("")}</ul>`;

  switch (template) {
    case "modern":
      return `<html><head>${iconScript}<style>
      body { margin: 0; font-family: 'Segoe UI'; background: linear-gradient(to right, #1f4037, #99f2c8); color: #333; }
      header { text-align: center; padding: 40px; background: white; }
      header img { width: 130px; border-radius: 50%; }
      section { max-width: 900px; margin: auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.2); margin-top: 20px; }
      h2 { color: #1f4037; }
      button:hover { background: #005f4b; }
      </style></head><body>
      <header><img src="${profileImg}" alt="Profile Picture" /><h1>${name}</h1><p>${bio}</p></header>
      <section><h2>Skills</h2>${skillsList}</section>
      <section><h2>Projects</h2>${projectsList}</section>
      <section><h2>Contact</h2><p>${contact}</p></section>
      <section><h2>Resume</h2>${resumeBtn}</section>
      ${footer}</body></html>`;

    case "classic":
      return `<html><head>${iconScript}<style>
      body { font-family: Georgia; background: #fff9f0; margin: 0; }
      header { background: #eae0c8; text-align: center; padding: 30px; }
      header img { width: 100px; border-radius: 50%; margin-top: 10px; }
      main { display: flex; max-width: 1000px; margin: auto; padding: 20px; gap: 20px; }
      aside { width: 30%; background: #f4e3d7; padding: 20px; border-radius: 8px; }
      article { width: 70%; background: #ffffff; padding: 20px; border-radius: 8px; }
      button:hover { background: #cfa26e; }
      </style></head><body>
      <header><h1>${name}</h1><p>${bio}</p><img src="${profileImg}" alt="Profile Picture" /></header>
      <main>
        <aside>
          <h2>Contact</h2><p>${contact}</p>
          <h2>Resume</h2>${resumeBtn}
          <h2>Social</h2>
          <p>${github ? `<a href="${github}" target="_blank" style="color:#333; margin-right: 10px;" title="GitHub"><i class="fab fa-github fa-2x"></i></a>` : ""}
             ${linkedin ? `<a href="${linkedin}" target="_blank" style="color:#0077b6;" title="LinkedIn"><i class="fab fa-linkedin fa-2x"></i></a>` : ""}
          </p>
        </aside>
        <article>
          <h2>Skills</h2>${skillsList}
          <h2>Projects</h2>${projectsList}
        </article>
      </main>
      ${footer}</body></html>`;

    case "creative":
      return `<html><head>${iconScript}<style>
      body { background: linear-gradient(to right, #182848, #4b6cb7); font-family: 'Comic Sans MS'; color: white; }
      header { text-align: center; padding: 40px; }
      header img { width: 110px; border-radius: 50%; border: 3px solid white; }
      section { background: rgba(255,255,255,0.1); margin: 20px auto; padding: 20px; border-radius: 10px; width: 80%; }
      a { color: #ffd166; font-weight: bold; text-decoration: none; }
      a:hover { color: #ffe27a; text-decoration: underline; }
      button { background: white; color: #4b6cb7; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
      button:hover { background: #2c4a86; color: white; }
      </style></head><body>
      <header><h1>${name}</h1><p>${bio}</p><img src="${profileImg}" alt="Profile Picture" /></header>
      <section><h2>Skills</h2>${skillsList}</section>
      <section><h2>Projects</h2>${projectsList}</section>
      <section><h2>Contact</h2><p>${contact}</p></section>
      <section><h2>Resume</h2>${resumeBtn}</section>
      ${footer}</body></html>`;

    case "professional":
      return `<html><head>${iconScript}<style>
      body { background: #e8edf3; font-family: 'Helvetica Neue', sans-serif; margin: 0; color: #333; }
      header { background: #004080; color: white; text-align: center; padding: 40px; }
      header img { width: 120px; border-radius: 50%; margin-top: 10px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1000px; margin: auto; padding: 30px; }
      section { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
      button:hover { background: #003366; color: white; }
      </style></head><body>
      <header><h1>${name}</h1><p>${bio}</p><img src="${profileImg}" alt="Profile Picture" /></header>
      <div class="grid">
        <section><h2>Skills</h2>${skillsList}</section>
        <section><h2>Projects</h2>${projectsList}</section>
        <section><h2>Contact</h2><p>${contact}</p></section>
        <section><h2>Resume</h2>${resumeBtn}</section>
      </div>
      ${footer}</body></html>`;

    case "simple":
    default:
      return `<html><head>${iconScript}<style>
      body { font-family: Arial; margin: 0; background: #f0f0f0; color: #222; }
      .container { width: 80%; margin: auto; text-align: center; padding: 30px; }
      img { width: 100px; border-radius: 50%; margin: 20px 0; }
      section { margin: 20px auto; background: white; padding: 20px; border-radius: 8px; }
      button:hover { background: #555; color: white; }
      </style></head><body>
      <div class="container">
        <h1>${name}</h1>
        <img src="${profileImg}" alt="Profile Picture" />
        <p>${bio}</p>
        <section><h2>Skills</h2>${skillsList}</section>
        <section><h2>Projects</h2>${projectsList}</section>
        <section><h2>Contact</h2><p>${contact}</p></section>
        <section><h2>Resume</h2>${resumeBtn}</section>
      </div>
      ${footer}</body></html>`;
  }
  
}

function addProject() {
  const container = document.getElementById("projectsContainer");
  const div = document.createElement("div");
  div.className = "project-input";
  div.innerHTML = `
    <input type="text" class="projectTitle" placeholder="Project Name" required />
    <input type="url" class="projectLink" placeholder="Project Link (https://...)" required />
  `;
  container.appendChild(div);
}
