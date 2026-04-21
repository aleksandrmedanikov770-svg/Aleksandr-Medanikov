const API_URL = 'http://127.0.0.1:8000/api';
let token = localStorage.getItem('token');
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadMaterials();
});

function checkAuth() {
    if (token) {
        currentUser = JSON.parse(localStorage.getItem('user'));
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('username').textContent = currentUser.username;
    } else {
        document.getElementById('auth-buttons').style.display = 'flex';
        document.getElementById('user-info').style.display = 'none';
    }
}

async function register() {
    const username = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const password2 = document.getElementById('regPassword2').value;
    
    const response = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, password, password2, role: 'student'})
    });
    
    const data = await response.json();
    if (response.ok) {
        token = data.token;
        currentUser = data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(currentUser));
        checkAuth();
        closeModal('registerModal');
        loadMaterials();
    } else {
        alert('Ошибка: ' + JSON.stringify(data));
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });
    
    const data = await response.json();
    if (response.ok) {
        token = data.token;
        currentUser = data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(currentUser));
        checkAuth();
        closeModal('loginModal');
        loadMaterials();
    } else {
        alert('Ошибка входа');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token = null;
    currentUser = null;
    checkAuth();
    loadMaterials();
}

async function loadMaterials() {
    const response = await fetch(`${API_URL}/materials/`);
    const materials = await response.json();
    displayMaterials(materials);
}

function displayMaterials(materials) {
    const container = document.getElementById('materials-container');
    container.innerHTML = materials.map(m => `
        <div class="material-card">
            <h3>${m.title}</h3>
            <div>Автор: ${m.author}</div>
            <div>⭐ ${m.rating || 0}</div>
            <button onclick="downloadMaterial(${m.id})">📥 Скачать</button>
        </div>
    `).join('');
}

function downloadMaterial(id) {
    window.open(`${API_URL}/materials/${id}/download/`, '_blank');
}

function showModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function showLoginModal() { showModal('loginModal'); }
function showRegisterModal() { showModal('registerModal'); }

async function searchMaterials() {
    const query = document.getElementById('searchInput').value;
    const response = await fetch(`${API_URL}/materials/?search=${query}`);
    const materials = await response.json();
    displayMaterials(materials);
}