// State Management
let currentPage = 'home';
let selectedCreatorId = null;
let selectedSpecialty = 'All';
let searchQuery = '';
let likedCreators = new Set();
let currentLightboxIndex = 0;
let currentGalleryImages = [];
let bookingStep = 1;
let currentService = null;
let featuredCarouselIndex = 0;
let carouselAutoplayInterval = null;

// API Configuration
const API_BASE_URL = 'http://localhost:3601/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Ensure auth pages (sign in and sign up) are hidden on load
  const signinPage = document.getElementById('signinPage');
  const signupPage = document.getElementById('signupPage');
  if (signinPage) {
    signinPage.classList.remove('active');
  }
  if (signupPage) {
    signupPage.classList.remove('active');
  }
  
  renderFeaturedCreators();
  renderTrendingCreators();
  renderExploreCreators();
  renderSpecialtyFilters();
  renderFeatures();
  setupSearchInput();
  startCarouselAutoplay();
});

// Navigation
function navigateTo(page, creatorId = null) {
  currentPage = page;
  selectedCreatorId = creatorId;

  // Update active states
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Show correct page
  const pageElement = document.getElementById(`${page}Page`);
  if (pageElement) {
    pageElement.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Load creator profile if needed
  if (page === 'profile' && creatorId) {
    renderCreatorProfile(creatorId);
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('active');
}

// Creator Card Rendering
function createCreatorCard(creator, index) {
  const isLiked = likedCreators.has(creator.id);

  return `
    <div class="creator-card" style="animation-delay: ${index * 0.1}s" onclick="navigateTo('profile', '${creator.id}')">
      <div class="creator-card-cover">
        <img src="${creator.coverImage}" alt="${creator.name}" loading="lazy">
        <div class="creator-card-overlay"></div>
        ${creator.verified ? `
          <div class="verified-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Verified
          </div>
        ` : ''}
        <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike('${creator.id}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div class="creator-card-content">
        <div class="creator-info">
          <div class="creator-avatar">
            <img src="${creator.avatar}" alt="${creator.name}">
            <div class="online-indicator"></div>
          </div>
          <div class="creator-details">
            <h3 class="creator-name">${creator.name}</h3>
            <div class="creator-meta">
              <div class="rating">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>${creator.rating}</span>
                <span>(${creator.reviewCount})</span>
              </div>
              <div class="location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${creator.location}</span>
              </div>
            </div>
          </div>
        </div>
        <p class="creator-bio">${creator.bio}</p>
        <div class="creator-specialties">
          ${creator.specialties.slice(0, 3).map(s => `<span class="badge">${s}</span>`).join('')}
        </div>
        <button class="btn full-width" onclick="event.stopPropagation(); navigateTo('profile', '${creator.id}')">
          View Portfolio
        </button>
      </div>
    </div>
  `;
}

// Add spin animation to CSS if not already present
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Navigation
function navigateTo(page, creatorId = null) {
  currentPage = page;
  selectedCreatorId = creatorId;

  // Update active states
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Show correct page
  const pageElement = document.getElementById(`${page}Page`);
  if (pageElement) {
    pageElement.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Load creator profile if needed
  if (page === 'profile' && creatorId) {
    renderCreatorProfile(creatorId);
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('active');
}

// Creator Card Rendering
function createCreatorCard(creator, index) {
  const isLiked = likedCreators.has(creator.id);

  return `
    <div class="creator-card" style="animation-delay: ${index * 0.1}s" onclick="navigateTo('profile', '${creator.id}')">
      <div class="creator-card-cover">
        <img src="${creator.coverImage}" alt="${creator.name}" loading="lazy">
        <div class="creator-card-overlay"></div>
        ${creator.verified ? `
          <div class="verified-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Verified
          </div>
        ` : ''}
        <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike('${creator.id}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div class="creator-card-content">
        <div class="creator-info">
          <div class="creator-avatar">
            <img src="${creator.avatar}" alt="${creator.name}">
            <div class="online-indicator"></div>
          </div>
          <div class="creator-details">
            <h3 class="creator-name">${creator.name}</h3>
            <div class="creator-meta">
              <div class="rating">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>${creator.rating}</span>
                <span>(${creator.reviewCount})</span>
              </div>
              <div class="location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${creator.location}</span>
              </div>
            </div>
          </div>
        </div>
        <p class="creator-bio">${creator.bio}</p>
        <div class="creator-specialties">
          ${creator.specialties.slice(0, 3).map(s => `<span class="badge">${s}</span>`).join('')}
        </div>
        <button class="btn full-width" onclick="event.stopPropagation(); navigateTo('profile', '${creator.id}')">
          View Portfolio
        </button>
      </div>
    </div>
  `;
}

function renderFeaturedCreators() {
  const track = document.getElementById('featuredCarouselTrack');
  const indicatorsContainer = document.getElementById('featuredCarouselIndicators');
  const allCreators = creators.slice(0, 6); // Use 6 creators for carousel
  
  // Render all carousel items
  track.innerHTML = allCreators.map((creator, index) => `
    <div class="carousel-item">
      ${createCreatorCard(creator, index)}
    </div>
  `).join('');
  
  // Render indicators
  const totalSlides = window.innerWidth >= 1024 ? Math.ceil(allCreators.length / 3) : 
                       window.innerWidth >= 768 ? Math.ceil(allCreators.length / 2) : 
                       allCreators.length;
  
  indicatorsContainer.innerHTML = Array.from({ length: totalSlides }, (_, i) => `
    <button class="carousel-indicator ${i === featuredCarouselIndex ? 'active' : ''}" onclick="goToCarouselSlide(${i})"></button>
  `).join('');
  
  // Update transform
  updateCarouselPosition();
}

function updateCarouselPosition() {
  const track = document.getElementById('featuredCarouselTrack');
  const itemsPerSlide = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const offset = -(featuredCarouselIndex * (100 / itemsPerSlide));
  track.style.transform = `translateX(${offset}%)`;
}

function featuredCarouselNext() {
  const allCreators = creators.slice(0, 6);
  const itemsPerSlide = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const maxIndex = Math.ceil(allCreators.length / itemsPerSlide) - 1;
  
  if (featuredCarouselIndex < maxIndex) {
    featuredCarouselIndex++;
  } else {
    featuredCarouselIndex = 0; // Loop back
  }
  
  renderFeaturedCreators();
  resetCarouselAutoplay();
}

function featuredCarouselPrev() {
  const allCreators = creators.slice(0, 6);
  const itemsPerSlide = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const maxIndex = Math.ceil(allCreators.length / itemsPerSlide) - 1;
  
  if (featuredCarouselIndex > 0) {
    featuredCarouselIndex--;
  } else {
    featuredCarouselIndex = maxIndex; // Loop to end
  }
  
  renderFeaturedCreators();
  resetCarouselAutoplay();
}

function goToCarouselSlide(index) {
  featuredCarouselIndex = index;
  renderFeaturedCreators();
  resetCarouselAutoplay();
}

function resetCarouselAutoplay() {
  stopCarouselAutoplay();
  startCarouselAutoplay();
}

function renderTrendingCreators() {
  const container = document.getElementById('trendingCreators');
  const trending = creators.slice(3, 6);
  container.innerHTML = trending.map((creator, index) => createCreatorCard(creator, index)).join('');
}

function renderExploreCreators() {
  const container = document.getElementById('exploreCreators');
  const filtered = filterCreators();
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 5rem 1rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No creators found</h3>
        <p style="color: var(--muted-foreground); margin-bottom: 1.5rem;">Try adjusting your filters or search terms</p>
        <button class="btn" onclick="clearFilters()">Clear Filters</button>
      </div>
    `;
  } else {
    container.innerHTML = filtered.map((creator, index) => createCreatorCard(creator, index)).join('');
  }

  updateResultsCount(filtered.length);
}

function filterCreators() {
  return creators.filter(creator => {
    const matchesSpecialty = selectedSpecialty === 'All' || creator.specialties.includes(selectedSpecialty);
    const matchesSearch = searchQuery === '' ||
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });
}

function updateResultsCount(count) {
  const counter = document.getElementById('resultsCount');
  counter.textContent = `Showing ${count} creator${count !== 1 ? 's' : ''}`;
}

function clearFilters() {
  selectedSpecialty = 'All';
  searchQuery = '';
  document.getElementById('searchInput').value = '';
  renderSpecialtyFilters();
  renderExploreCreators();
}

// Specialty Filters
function renderSpecialtyFilters() {
  const container = document.getElementById('specialtyFilters');
  container.innerHTML = specialties.map((specialty, index) => `
    <button 
      class="specialty-pill ${selectedSpecialty === specialty ? 'active' : ''}" 
      onclick="selectSpecialty('${specialty}')"
      style="animation: fadeIn 0.3s ease ${0.3 + index * 0.05}s forwards; opacity: 0;"
    >
      ${specialty}
    </button>
  `).join('');
}

function selectSpecialty(specialty) {
  selectedSpecialty = specialty;
  renderSpecialtyFilters();
  renderExploreCreators();
}

// Toggle filters panel
function toggleFilters() {
  const filtersPanel = document.querySelector('.specialty-filters');
  if (filtersPanel) {
    filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
  }
}

function setupSearchInput() {
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderExploreCreators();
    });
  }
}

// Like Toggle
function toggleLike(creatorId) {
  if (likedCreators.has(creatorId)) {
    likedCreators.delete(creatorId);
  } else {
    likedCreators.add(creatorId);
  }
  renderFeaturedCreators();
  renderTrendingCreators();
  renderExploreCreators();
}

// Creator Profile
function renderCreatorProfile(creatorId) {
    const creator = creators.find(c => c.id === creatorId);
    if (!creator) return;
  
    const creatorServices = services[creatorId] || [];
    const creatorPortfolio = portfolioItems[creatorId] || [];
  
    const profileHTML = `
      <div class="profile-hero">
        <img src="${creator.coverImage}" alt="${creator.name}">
        <div class="profile-hero-overlay"></div>
        <button class="back-btn" onclick="navigateTo('explore')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>
        <div class="profile-info">
          <div class="profile-header">
            <div class="profile-avatar">
              <img src="${creator.avatar}" alt="${creator.name}">
              <div class="online-indicator"></div>
            </div>
            <div class="profile-header-info">
              <div class="profile-name-row">
                <h1 class="profile-name">${creator.name}</h1>
                ${creator.verified ? `
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ` : ''}
              </div>
              <div class="profile-stats">
                <div class="rating">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span style="font-size: 1.125rem;">${creator.rating}</span>
                  <span style="font-size: 0.875rem;">(${creator.reviewCount} reviews)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.25rem;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>${creator.location}</span>
                </div>
              </div>
              <div class="profile-specialties">
                ${creator.specialties.map(s => `<span class="badge">${s}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="profile-content">
        <div class="profile-grid">
          <div class="profile-main">
            <!-- About -->
            <div class="card">
              <h2 style="margin-bottom: 1rem;">About</h2>
              <p style="color: var(--muted-foreground); line-height: 1.6; margin-bottom: 1.5rem;">${creator.bio}</p>
              <div class="stats-grid">
                <div class="stat-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="8" r="6"></circle>
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                  </svg>
                  <div class="stat-value">${creator.yearsExperience}</div>
                  <div class="stat-label">Years Experience</div>
                </div>
                <div class="stat-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <div class="stat-value">${creator.rating}</div>
                  <div class="stat-label">Rating</div>
                </div>
                <div class="stat-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                  <div class="stat-value">${creator.languages.length}</div>
                  <div class="stat-label">Languages</div>
                </div>
                <div class="stat-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  <div style="font-size: 0.875rem; margin-bottom: 0.25rem;">${creator.travelAvailable ? 'Yes' : 'Local'}</div>
                  <div class="stat-label">Travel Available</div>
                </div>
              </div>
            </div>
  
            <!-- Portfolio -->
            <div class="card">
              <div class="tabs">
                <div class="tabs-list">
                  <button class="tab active">All Work</button>
                </div>
              </div>
              <div class="gallery">
                ${creatorPortfolio.map((item, index) => `
                  <div class="gallery-item" onclick="openLightbox(${index}, '${creatorId}')">
                    <img src="${item.thumbnail}" alt="${item.title || 'Portfolio item'}" loading="lazy">
                    <div class="gallery-overlay">
                      <div class="gallery-info">
                        ${item.title ? `<div class="gallery-title">${item.title}</div>` : ''}
                        <div class="gallery-category">${item.category}</div>
                      </div>
                      <div class="gallery-likes">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        ${item.likes}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
  
          <!-- Sidebar -->
          <div>
            <div class="card" style="position: sticky; top: 6rem;">
              <h3 style="margin-bottom: 1rem;">Services & Pricing</h3>
              ${creatorServices.map(service => `
                <div class="service-card" onclick="openBookingModal('${service.id}', '${creatorId}')">
                  <h4 class="service-name">${service.name}</h4>
                  <p class="service-description">${service.description}</p>
                  <div class="service-footer">
                    <span class="service-duration">${service.duration}</span>
                    <span class="service-price">${service.priceType === 'starting' ? 'from ' : ''}$${service.price}</span>
                  </div>
                  <button class="btn btn-sm full-width">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Book Now
                  </button>
                </div>
              `).join('')}
              
              ${creator.website || creator.instagram ? `
                <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                  ${creator.website ? `
                    <a href="https://${creator.website}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem; color: var(--muted-foreground); text-decoration: none; font-size: 0.875rem; margin-bottom: 0.75rem; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--muted-foreground)'">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      ${creator.website}
                    </a>
                  ` : ''}
                  ${creator.instagram ? `
                    <a href="https://instagram.com/${creator.instagram.replace('@', '')}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem; color: var(--muted-foreground); text-decoration: none; font-size: 0.875rem; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--muted-foreground)'">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                      ${creator.instagram}
                    </a>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

  document.getElementById('profileContent').innerHTML = profileHTML;
}

// Lightbox
function openLightbox(index, creatorId) {
  currentLightboxIndex = index;
  currentGalleryImages = portfolioItems[creatorId] || [];
  
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightboxImage');
  const counter = document.getElementById('lightboxCounter');
  
  image.src = currentGalleryImages[index].url;
  counter.textContent = `${index + 1} / ${currentGalleryImages.length}`;
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
  
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function lightboxPrev() {
  if (currentLightboxIndex > 0) {
    currentLightboxIndex--;
    updateLightbox();
  }
}

function lightboxNext() {
  if (currentLightboxIndex < currentGalleryImages.length - 1) {
    currentLightboxIndex++;
    updateLightbox();
  }
}

function updateLightbox() {
  const image = document.getElementById('lightboxImage');
  const counter = document.getElementById('lightboxCounter');
  
  image.src = currentGalleryImages[currentLightboxIndex].url;
  counter.textContent = `${currentLightboxIndex + 1} / ${currentGalleryImages.length}`;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (lightbox.classList.contains('active')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
  }
});

// Booking Modal
function openBookingModal(serviceId, creatorId) {
    const creator = creators.find(c => c.id === creatorId);
    const creatorServices = services[creatorId] || [];
    const service = creatorServices.find(s => s.id === serviceId);
    
    if (!service || !creator) return;
    
    currentService = service;
    bookingStep = 1;
    
    document.getElementById('bookingServiceName').textContent = `Book ${service.name}`;
    document.getElementById('bookingCreatorName').textContent = `with ${creator.name}`;
    
    // Render service details
    document.getElementById('serviceDetails').innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem; background: var(--accent); border-radius: var(--radius); margin-bottom: 1rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="margin-top: 0.125rem;">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <div>
          <div style="font-weight: 500; margin-bottom: 0.25rem;">Duration</div>
          <div style="color: var(--muted-foreground); font-size: 0.875rem;">${service.duration}</div>
        </div>
      </div>
      <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem; background: var(--accent); border-radius: var(--radius); margin-bottom: 1.5rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="margin-top: 0.125rem;">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        <div>
          <div style="font-weight: 500; margin-bottom: 0.25rem;">Price</div>
          <div style="color: var(--muted-foreground); font-size: 0.875rem;">${service.priceType === 'starting' ? 'Starting at ' : ''}$${service.price}</div>
        </div>
      </div>
      <h4 style="margin-bottom: 0.75rem;">What's Included</h4>
      <ul style="list-style: none;">
        ${service.included.map(item => `
          <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.875rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${item}</span>
          </li>
        `).join('')}
      </ul>
    `;
    
    updateBookingStep();
    
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  bookingStep = 1;
}

function updateBookingStep() {
  document.querySelectorAll('.booking-step').forEach(step => step.classList.remove('active'));
  document.getElementById(`bookingStep${bookingStep}`).classList.add('active');
  
  const backBtn = document.getElementById('bookingBackBtn');
  const nextBtn = document.getElementById('bookingNextBtn');
  
  if (bookingStep === 1) {
    backBtn.style.display = 'none';
    nextBtn.textContent = 'Continue';
  } else if (bookingStep < 3) {
    backBtn.style.display = 'block';
    nextBtn.textContent = 'Continue';
  } else if (bookingStep === 3) {
    backBtn.style.display = 'block';
    nextBtn.textContent = 'Send Booking Request';
  } else {
    backBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
}

function bookingNext() {
  if (bookingStep < 3) {
    bookingStep++;
    updateBookingStep();
  } else if (bookingStep === 3) {
    bookingStep = 4;
    updateBookingStep();
    setTimeout(() => {
      closeBookingModal();
    }, 3000);
  }
}

function bookingPrev() {
  if (bookingStep > 1) {
    bookingStep--;
    updateBookingStep();
  }
}

// Features
function renderFeatures() {
    const icons = {
      camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>',
      users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
      'trending-up': '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>',
      heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
      zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>'
    };
  
    const container = document.getElementById('featuresGrid');
    container.innerHTML = features.map((feature, index) => `
      <div class="feature-card" style="animation: fadeInUp 0.5s ease ${index * 0.1}s forwards; opacity: 0;">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${icons[feature.icon]}
          </svg>
        </div>
        <h3 class="feature-title">${feature.title}</h3>
        <p class="feature-description">${feature.description}</p>
      </div>
  `).join('');
}

// Close modals on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
  if (e.target.id === 'bookingModal') closeBookingModal();
});

// Carousel Autoplay
function startCarouselAutoplay() {
  carouselAutoplayInterval = setInterval(() => {
    const allCreators = creators.slice(0, 6);
    const itemsPerSlide = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const maxIndex = Math.ceil(allCreators.length / itemsPerSlide) - 1;
    featuredCarouselIndex = (featuredCarouselIndex + 1) % (maxIndex + 1);
    renderFeaturedCreators();
  }, 5000);
}

function stopCarouselAutoplay() {
  clearInterval(carouselAutoplayInterval);
}

// Auth Functions
let currentUserType = 'creator';

function toggleUserType(type) {
  currentUserType = type;
  
  // Update button states
  document.querySelectorAll('.user-type-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });
  
  // Show/hide specialty field
  const specialtyGroup = document.getElementById('specialtyGroup');
  const specialtySelect = document.getElementById('signupSpecialty');
  
  if (specialtyGroup) {
    if (type === 'creator') {
      specialtyGroup.style.display = 'block';
      specialtySelect.required = true;
    } else {
      specialtyGroup.style.display = 'none';
      specialtySelect.required = false;
    }
  }
  
  // Update subtitle and features
  const subtitle = document.getElementById('signupSubtitle');
  const feature1 = document.getElementById('signupFeature1');
  const feature2 = document.getElementById('signupFeature2');
  const feature3 = document.getElementById('signupFeature3');
  
  if (type === 'creator') {
    subtitle.textContent = 'Showcase your portfolio and get booked by clients worldwide';
    feature1.textContent = 'Build your professional portfolio';
    feature2.textContent = 'Get discovered by clients';
    feature3.textContent = 'Manage bookings seamlessly';
  } else {
    subtitle.textContent = 'Discover and book talented photographers and videographers';
    feature1.textContent = 'Browse verified creators';
    feature2.textContent = 'View portfolios & reviews';
    feature3.textContent = 'Book with confidence';
  }
}

// Password visibility toggle
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

// Sign Up
async function handleSignup(event) {
  event.preventDefault();
  
  const fullName = document.getElementById('signupFullName').value;
  const email = document.getElementById('signupEmail').value;
  const specialty = document.getElementById('signupSpecialty').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  
  // Clear previous errors
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  
  // Validation
  let hasErrors = false;
  
  if (!fullName.trim()) {
    document.getElementById('signupFullNameError').textContent = 'Full name is required';
    hasErrors = true;
  }
  
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('signupEmailError').textContent = 'Please enter a valid email';
    hasErrors = true;
  }
  
  if (currentUserType === 'creator' && !specialty) {
    document.getElementById('signupSpecialtyError').textContent = 'Please select a specialty';
    hasErrors = true;
  }
  
  if (!password || password.length < 8) {
    document.getElementById('signupPasswordError').textContent = 'Password must be at least 8 characters';
    hasErrors = true;
  }
  
  if (password !== confirmPassword) {
    document.getElementById('signupConfirmPasswordError').textContent = 'Passwords do not match';
    hasErrors = true;
  }
  
  if (hasErrors) return;
  
  // Show loading state
  const submitBtn = document.getElementById('signupSubmitBtn');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div style=\"width: 20px; height: 20px; border: 2px solid #00000033; border-top-color: #000; border-radius: 50%; animation: spin 1s linear infinite;\"></div> Creating account...';
  
  // Make API call to backend
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fullName,
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle error response
      if (response.status === 500 && data.message) {
        if (data.message.includes('duplicate key') || data.message.includes('E11000')) {
          document.getElementById('signupEmailError').textContent = 'Email already exists. Please use a different email.';
        } else {
          document.getElementById('signupEmailError').textContent = data.message;
        }
      } else {
        document.getElementById('signupEmailError').textContent = data.message || 'An error occurred during signup';
      }
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      return;
    }

    // Success - account created
    alert(`Account created successfully for ${currentUserType}!`);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
    
    // Reset form
    document.getElementById('signupForm').reset();
    navigateTo('home');
  } catch (error) {
    console.error('Signup error:', error);
    document.getElementById('signupEmailError').textContent = 'Failed to connect to server. Please try again.';
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// Sign In
async function handleSignin(event) {
  event.preventDefault();
  
  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;
  
  // Clear previous errors
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  
  // Validation
  let hasErrors = false;
  
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('signinEmailError').textContent = 'Please enter a valid email';
    hasErrors = true;
  }
  
  if (!password) {
    document.getElementById('signinPasswordError').textContent = 'Password is required';
    hasErrors = true;
  }
  
  if (hasErrors) return;
  
  // Show loading state
  const submitBtn = document.getElementById('signinSubmitBtn');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div style=\"width: 20px; height: 20px; border: 2px solid #00000033; border-top-color: #000; border-radius: 50%; animation: spin 1s linear infinite;\"></div> Signing in...';
  
  // Make API call to backend
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle error response
      if (response.status === 400) {
        document.getElementById('signinPasswordError').textContent = data.message || 'Invalid email or password';
      } else {
        document.getElementById('signinEmailError').textContent = data.message || 'An error occurred during sign in';
      }
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      return;
    }

    // Success - user logged in
    alert(`Welcome back, ${data.user.name}!`);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
    
    // Reset form
    document.getElementById('signinForm').reset();
    navigateTo('home');
  } catch (error) {
    console.error('Signin error:', error);
    document.getElementById('signinPasswordError').textContent = 'Failed to connect to server. Please try again.';
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  renderFeaturedCreators();
});

const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
  carouselContainer.addEventListener('mouseenter', stopCarouselAutoplay);
  carouselContainer.addEventListener('mouseleave', startCarouselAutoplay);

// Navigation
function navigateTo(page, creatorId = null) {
  currentPage = page;
  selectedCreatorId = creatorId;

  // Update active states
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Show correct page
  const pageElement = document.getElementById(`${page}Page`);
  if (pageElement) {
    pageElement.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Load creator profile if needed
  if (page === 'profile' && creatorId) {
    renderCreatorProfile(creatorId);
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('active');
}

// Creator Card Rendering
function createCreatorCard(creator, index) {
  const isLiked = likedCreators.has(creator.id);

  return `
    <div class="creator-card" style="animation-delay: ${index * 0.1}s" onclick="navigateTo('profile', '${creator.id}')">
      <div class="creator-card-cover">
        <img src="${creator.coverImage}" alt="${creator.name}" loading="lazy">
        <div class="creator-card-overlay"></div>
        ${creator.verified ? `
          <div class="verified-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Verified
          </div>
        ` : ''}
        <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike('${creator.id}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div class="creator-card-content">
        <div class="creator-info">
          <div class="creator-avatar">
            <img src="${creator.avatar}" alt="${creator.name}">
            <div class="online-indicator"></div>
          </div>
          <div class="creator-details">
            <h3 class="creator-name">${creator.name}</h3>
            <div class="creator-meta">
              <div class="rating">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>${creator.rating}</span>
                <span>(${creator.reviewCount})</span>
              </div>
              <div class="location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${creator.location}</span>
              </div>
            </div>
          </div>
        </div>
        <p class="creator-bio">${creator.bio}</p>
        <div class="creator-specialties">
          ${creator.specialties.slice(0, 3).map(s => `<span class="badge">${s}</span>`).join('')}
        </div>
        <button class="btn full-width" onclick="event.stopPropagation(); navigateTo('profile', '${creator.id}')">
          View Portfolio
        </button>
      </div>
    </div>
  `;
}

function renderFeaturedCreators() {
  const track = document.getElementById('featuredCarouselTrack');
  const indicatorsContainer = document.getElementById('featuredCarouselIndicators');
  const allCreators = creators.slice(0, 6); // Use 6 creators for carousel
  
  // Render all carousel items
  track.innerHTML = allCreators.map((creator, index) => `
    <div class="carousel-item">
      ${createCreatorCard(creator, index)}
    </div>
  `).join('');
  
  // Render indicators
  const totalSlides = window.innerWidth >= 1024 ? Math.ceil(allCreators.length / 3) : 
                       window.innerWidth >= 768 ? Math.ceil(allCreators.length / 2) : 
                       allCreators.length;
  
  indicatorsContainer.innerHTML = Array.from({ length: totalSlides }, (_, i) => `
    <button class="carousel-indicator ${i === featuredCarouselIndex ? 'active' : ''}" onclick="goToCarouselSlide(${i})"></button>
  `).join('');
  
  // Update transform
  updateCarouselPosition();
}

function updateCarouselPosition() {
  const track = document.getElementById('featuredCarouselTrack');
  const itemsPerSlide = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const offset = -(featuredCarouselIndex * (100 / itemsPerSlide));
  track.style.transform = `translateX(${offset}%)`;
}

function featuredCarouselNext() {
  const allCreators = creators.slice(0, 6);
  const itemsPerSlide = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const maxIndex = Math.ceil(allCreators.length / itemsPerSlide) - 1;
  
  if (featuredCarouselIndex < maxIndex) {
    featuredCarouselIndex++;
  } else {
    featuredCarouselIndex = 0; // Loop back
  }
  
  renderFeaturedCreators();
  resetCarouselAutoplay();
}

function featuredCarouselPrev() {
  const allCreators = creators.slice(0, 6);
  const itemsPerSlide = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const maxIndex = Math.ceil(allCreators.length / itemsPerSlide) - 1;
  
  if (featuredCarouselIndex > 0) {
    featuredCarouselIndex--;
  } else {
    featuredCarouselIndex = maxIndex; // Loop to end
  }
  
  renderFeaturedCreators();
  resetCarouselAutoplay();
}

function goToCarouselSlide(index) {
  featuredCarouselIndex = index;
  renderFeaturedCreators();
  resetCarouselAutoplay();
}

function resetCarouselAutoplay() {
  stopCarouselAutoplay();
  startCarouselAutoplay();
}

function renderTrendingCreators() {
  const container = document.getElementById('trendingCreators');
  const trending = creators.slice(3, 6);
  container.innerHTML = trending.map((creator, index) => createCreatorCard(creator, index)).join('');
}

function renderExploreCreators() {
  const container = document.getElementById('exploreCreators');
  const filtered = filterCreators();
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 5rem 1rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No creators found</h3>
        <p style="color: var(--muted-foreground); margin-bottom: 1.5rem;">Try adjusting your filters or search terms</p>
        <button class="btn" onclick="clearFilters()">Clear Filters</button>
      </div>
    `;
  } else {
    container.innerHTML = filtered.map((creator, index) => createCreatorCard(creator, index)).join('');
  }

  updateResultsCount(filtered.length);
}

function filterCreators() {
  return creators.filter(creator => {
    const matchesSpecialty = selectedSpecialty === 'All' || creator.specialties.includes(selectedSpecialty);
    const matchesSearch = searchQuery === '' ||
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });
}

function updateResultsCount(count) {
  const counter = document.getElementById('resultsCount');
  counter.textContent = `Showing ${count} creator${count !== 1 ? 's' : ''}`;
}

function clearFilters() {
  selectedSpecialty = 'All';
  searchQuery = '';
  document.getElementById('searchInput').value = '';
  renderSpecialtyFilters();
  renderExploreCreators();
}

// Specialty Filters
function renderSpecialtyFilters() {
  const container = document.getElementById('specialtyFilters');
  container.innerHTML = specialties.map((specialty, index) => `
    <button 
      class="specialty-pill ${selectedSpecialty === specialty ? 'active' : ''}" 
      onclick="selectSpecialty('${specialty}')"
      style="animation: fadeIn 0.3s ease ${0.3 + index * 0.05}s forwards; opacity: 0;"
    >
      ${specialty}
    </button>
  `).join('');
}

function selectSpecialty(specialty) {
  selectedSpecialty = specialty;
  renderSpecialtyFilters();
  renderExploreCreators();
}

// Toggle filters panel
function toggleFilters() {
  const filtersPanel = document.querySelector('.specialty-filters');
  if (filtersPanel) {
    filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
  }
}

function setupSearchInput() {
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderExploreCreators();
    });
  }
}

// Like Toggle
function toggleLike(creatorId) {
  if (likedCreators.has(creatorId)) {
    likedCreators.delete(creatorId);
  } else {
    likedCreators.add(creatorId);
  }
  renderFeaturedCreators();
  renderTrendingCreators();
  renderExploreCreators();
}

// Creator Profile
function renderCreatorProfile(creatorId) {
  const creator = creators.find(c => c.id === creatorId);
  if (!creator) return;

  const creatorServices = services[creatorId] || [];
  const creatorPortfolio = portfolioItems[creatorId] || [];

  const profileHTML = `
    <div class="profile-hero">
      <img src="${creator.coverImage}" alt="${creator.name}">
      <div class="profile-hero-overlay"></div>
      <button class="back-btn" onclick="navigateTo('explore')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </button>
      <div class="profile-info">
        <div class="profile-header">
          <div class="profile-avatar">
            <img src="${creator.avatar}" alt="${creator.name}">
            <div class="online-indicator"></div>
          </div>
          <div class="profile-header-info">
            <div class="profile-name-row">
              <h1 class="profile-name">${creator.name}</h1>
              ${creator.verified ? `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ` : ''}
            </div>
            <div class="profile-stats">
              <div class="rating">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span style="font-size: 1.125rem;">${creator.rating}</span>
                <span style="font-size: 0.875rem;">(${creator.reviewCount} reviews)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.25rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${creator.location}</span>
              </div>
            </div>
            <div class="profile-specialties">
              ${creator.specialties.map(s => `<span class="badge">${s}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-grid">
        <div class="profile-main">
          <!-- About -->
          <div class="card">
            <h2 style="margin-bottom: 1rem;">About</h2>
            <p style="color: var(--muted-foreground); line-height: 1.6; margin-bottom: 1.5rem;">${creator.bio}</p>
            <div class="stats-grid">
              <div class="stat-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="8" r="6"></circle>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                </svg>
                <div class="stat-value">${creator.yearsExperience}</div>
                <div class="stat-label">Years Experience</div>
              </div>
              <div class="stat-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <div class="stat-value">${creator.rating}</div>
                <div class="stat-label">Rating</div>
              </div>
              <div class="stat-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
                <div class="stat-value">${creator.languages.length}</div>
                <div class="stat-label">Languages</div>
              </div>
              <div class="stat-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <div style="font-size: 0.875rem; margin-bottom: 0.25rem;">${creator.travelAvailable ? 'Yes' : 'Local'}</div>
                <div class="stat-label">Travel Available</div>
              </div>
            </div>
          </div>

          <!-- Portfolio -->
          <div class="card">
            <div class="tabs">
              <div class="tabs-list">
                <button class="tab active">All Work</button>
              </div>
            </div>
            <div class="gallery">
              ${creatorPortfolio.map((item, index) => `
                <div class="gallery-item" onclick="openLightbox(${index}, '${creatorId}')">
                  <img src="${item.thumbnail}" alt="${item.title || 'Portfolio item'}" loading="lazy">
                  <div class="gallery-overlay">
                    <div class="gallery-info">
                      ${item.title ? `<div class="gallery-title">${item.title}</div>` : ''}
                      <div class="gallery-category">${item.category}</div>
                    </div>
                    <div class="gallery-likes">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      ${item.likes}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <div class="card" style="position: sticky; top: 6rem;">
            <h3 style="margin-bottom: 1rem;">Services & Pricing</h3>
            ${creatorServices.map(service => `
              <div class="service-card" onclick="openBookingModal('${service.id}', '${creatorId}')">
                <h4 class="service-name">${service.name}</h4>
                <p class="service-description">${service.description}</p>
                <div class="service-footer">
                  <span class="service-duration">${service.duration}</span>
                  <span class="service-price">${service.priceType === 'starting' ? 'from ' : ''}$${service.price}</span>
                </div>
                <button class="btn btn-sm full-width">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Book Now
                </button>
              </div>
            `).join('')}
            
            ${creator.website || creator.instagram ? `
              <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                ${creator.website ? `
                  <a href="https://${creator.website}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem; color: var(--muted-foreground); text-decoration: none; font-size: 0.875rem; margin-bottom: 0.75rem; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--muted-foreground)'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    ${creator.website}
                  </a>
                ` : ''} 
                ${creator.instagram ? `
                  <a href="https://instagram.com/${creator.instagram.replace('@', '')}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem; color: var(--muted-foreground); text-decoration: none; font-size: 0.875rem; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--muted-foreground)'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    ${creator.instagram}
                  </a>
                ` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('profileContent').innerHTML = profileHTML;
}}
