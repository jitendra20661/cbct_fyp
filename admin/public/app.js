const API_URL = 'http://localhost:3001/api';

// Tab switching
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'categories') {
        loadCategories();
    } else if (tabName === 'doctors') {
        loadDoctors();
        loadCategoriesDropdown();
    }
}

// Show message
function showMessage(message, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message ${type} show`;
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

// Category Form
document.getElementById('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;
    
    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        });
        
        if (response.ok) {
            showMessage('Category added successfully!');
            e.target.reset();
            loadCategories();
            loadCategoriesDropdown();
        } else {
            const error = await response.json();
            showMessage(error.message || 'Error adding category', 'error');
        }
    } catch (error) {
        showMessage('Error connecting to server', 'error');
    }
});

// Load categories
async function loadCategories() {
    const listEl = document.getElementById('categories-list');
    listEl.innerHTML = '<p class="loading">Loading categories...</p>';
    
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        
        if (categories.length === 0) {
            listEl.innerHTML = '<p class="loading">No categories yet. Add one above!</p>';
            return;
        }
        
        listEl.innerHTML = categories.map(cat => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">${cat.name}</div>
                    <div class="list-item-details">
                        ${cat.description || 'No description'}
                    </div>
                </div>
                <button class="btn btn-danger" onclick="deleteCategory('${cat._id}')">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        listEl.innerHTML = '<p class="loading">Error loading categories</p>';
    }
}

// Delete category
async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('Category deleted successfully!');
            loadCategories();
            loadCategoriesDropdown();
        } else {
            showMessage('Error deleting category', 'error');
        }
    } catch (error) {
        showMessage('Error connecting to server', 'error');
    }
}

// Load categories dropdown
async function loadCategoriesDropdown() {
    const selectEl = document.getElementById('doctor-category');
    
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        
        selectEl.innerHTML = '<option value="">Select Category</option>' + 
            categories.map(cat => `<option value="${cat._id}">${cat.name}</option>`).join('');
    } catch (error) {
        console.error('Error loading categories dropdown:', error);
    }
}

// Doctor Form
document.getElementById('doctor-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('doctor-name').value);
    formData.append('specialization', document.getElementById('doctor-specialization').value);
    formData.append('category', document.getElementById('doctor-category').value);
    formData.append('experience', document.getElementById('doctor-experience').value);
    formData.append('qualification', document.getElementById('doctor-qualification').value);
    formData.append('email', document.getElementById('doctor-email').value);
    formData.append('phone', document.getElementById('doctor-phone').value);
    formData.append('availability', document.getElementById('doctor-availability').value);
    
    const imageFile = document.getElementById('doctor-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    try {
        const response = await fetch(`${API_URL}/doctors`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showMessage('Doctor added successfully!');
            e.target.reset();
            loadDoctors();
        } else {
            const error = await response.json();
            showMessage(error.message || 'Error adding doctor', 'error');
        }
    } catch (error) {
        showMessage('Error connecting to server', 'error');
    }
});

// Load doctors
async function loadDoctors() {
    const listEl = document.getElementById('doctors-list');
    listEl.innerHTML = '<p class="loading">Loading doctors...</p>';
    
    try {
        const response = await fetch(`${API_URL}/doctors`);
        const doctors = await response.json();
        
        if (doctors.length === 0) {
            listEl.innerHTML = '<p class="loading">No doctors yet. Add one above!</p>';
            return;
        }
        
        listEl.innerHTML = doctors.map(doc => `
            <div class="list-item">
                <div class="doctor-card">
                    ${doc.image ? `<img src="${doc.image}" alt="${doc.name}" class="doctor-image">` :
                        '<div class="doctor-image" aria-label="No image available"></div>'}
                    <div class="list-item-content">
                        <div class="list-item-title">${doc.name}</div>
                        <div class="list-item-details">
                            <span><strong>Specialization:</strong> ${doc.specialization}</span>
                            <span><strong>Category:</strong> ${doc.category?.name || doc.categoryName || 'N/A'}</span>
                            <br>
                            <span><strong>Experience:</strong> ${doc.experience} years</span>
                            ${doc.qualification ? `<span><strong>Qualification:</strong> ${doc.qualification}</span>` : ''}
                            <br>
                            ${doc.email ? `<span><strong>Email:</strong> ${doc.email}</span>` : ''}
                            ${doc.phone ? `<span><strong>Phone:</strong> ${doc.phone}</span>` : ''}
                            <br>
                            ${doc.availability && doc.availability.length > 0 ?
                                `<div style="margin-top: 6px;">
                                    ${doc.availability.map(day => `<span class="badge">${day}</span>`).join('')}
                                </div>` : ''}
                        </div>
                    </div>
                </div>
                <button class="btn btn-danger" onclick="deleteDoctor('${doc._id}')">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        listEl.innerHTML = '<p class="loading">Error loading doctors</p>';
    }
}

// Delete doctor
async function deleteDoctor(id) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    
    try {
        const response = await fetch(`${API_URL}/doctors/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('Doctor deleted successfully!');
            loadDoctors();
        } else {
            showMessage('Error deleting doctor', 'error');
        }
    } catch (error) {
        showMessage('Error connecting to server', 'error');
    }
}

// Initial load
loadCategories();
