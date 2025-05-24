const skillInput = document.getElementById('skillInput');
const presetSkills = document.getElementById('presetSkills');
const addBtn = document.getElementById('addBtn');
const skillList = document.getElementById('skillList');
const skillType = document.getElementById('skillType');
const filterType = document.getElementById('filterType');
const jobPrediction = document.getElementById('jobPrediction');
const searchInput = document.getElementById('searchInput');
const resetBtn = document.getElementById('resetBtn');
const noSkillsMessage = document.getElementById('noSkillsMessage');

let items = JSON.parse(localStorage.getItem('skillItems')) || [];

presetSkills.addEventListener('change', () => {
  const selected = Array.from(presetSkills.selectedOptions).map(opt => opt.value);
  skillInput.value = selected.join(', ');
});

function saveItems() {
  localStorage.setItem('skillItems', JSON.stringify(items));
}

function predictJob() {
  const skillTitles = items.map(i => i.title.toLowerCase());
  let predictions = [];

  if (skillTitles.includes("python") && skillTitles.includes("machine learning")) {
    predictions.push("Machine Learning Engineer");
  }
  if (skillTitles.includes("html") && skillTitles.includes("css") && skillTitles.includes("javascript")) {
    predictions.push("Frontend Web Developer");
  }
  if (skillTitles.includes("java") && skillTitles.includes("dbms")) {
    predictions.push("Backend Developer");
  }
  if (skillTitles.includes("git") && skillTitles.includes("github")) {
    predictions.push("DevOps Intern");
  }

  jobPrediction.textContent = predictions.length > 0
    ? "Suggested Job Roles: " + predictions.join(", ")
    : "Suggested Job Role: Keep adding more skills to get suggestions!";
}

function renderList() {
  skillList.innerHTML = '';
  const filter = filterType.value;
  const search = searchInput.value.toLowerCase();
  let found = 0;

  items.forEach((item, index) => {
    if ((filter === 'All' || item.type === filter) && item.title.toLowerCase().includes(search)) {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div>
          <strong>${item.title}</strong> <span class="badge bg-secondary">${item.type}</span>
          ${item.learned ? '<span class="badge bg-success">Learned</span>' : ''}
        </div>
        <div>
          <button class="btn btn-sm btn-info me-2" onclick="toggleLearned(${index})"><i class="fas ${item.learned ? 'fa-undo' : 'fa-check'}"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deleteItem(${index})"><i class="fas fa-trash"></i></button>
        </div>
      `;
      skillList.appendChild(li);
      found++;
    }
  });

  noSkillsMessage.style.display = found === 0 ? 'block' : 'none';
  predictJob();
}

function addItem() {
  const titles = skillInput.value.split(',').map(t => t.trim()).filter(Boolean);
  const type = skillType.value;
  titles.forEach(title => {
    items.push({ title, type, learned: false });
  });
  skillInput.value = '';
  presetSkills.value = '';
  saveItems();
  renderList();
}

function toggleLearned(index) {
  items[index].learned = !items[index].learned;
  saveItems();
  renderList();
}

function deleteItem(index) {
  items.splice(index, 1);
  saveItems();
  renderList();
}

function resetSkills() {
  items = [];
  saveItems();
  renderList();
}

addBtn.addEventListener('click', addItem);
skillInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') addItem();
});
filterType.addEventListener('change', renderList);
searchInput.addEventListener('input', renderList);
resetBtn.addEventListener('click', resetSkills);

renderList();
