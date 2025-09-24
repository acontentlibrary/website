// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(245, 241, 235, 0.98)';
    } else {
        header.style.background = 'rgba(245, 241, 235, 0.95)';
    }
});

// Instagram Stories-style Video Player
document.addEventListener('DOMContentLoaded', function() {
    console.log('A Content Library website loaded successfully!');
    
    // Load random preview video for content showcase (SCA Health)
    if (document.getElementById('landscape-preview')) {
        // Check if mobile and create proper landscape section
        if (window.innerWidth < 768) {
            createMobileLandscapeSection();
            // Force load video thumbnails on mobile
            loadVideoThumbnails();
        } else {
            loadRandomPreviewVideo();
        }
        // Initialize randomized displays
        updateLandscapeDisplay();
        updateVerticalDisplay();
        updatePhotoDisplay();
    }
    
    // Load McDonald's photo grid
    if (document.querySelector('.mcdonalds-photo-grid')) {
        loadMcDonaldsPhotos();
    }
    
    // Load Hunter Douglas media library
    if (document.querySelector('.video-thumbnail-grid')) {
        initializeHunterDouglasMediaLibrary();
    }
    
    // Initialize Hunter Douglas auto-cycling videos for Section 1
    if (document.getElementById('section1-phone-mockup')) {
        initializeSection1AutoCycle();
    }
    
    // Force Section 2 & 3 video thumbnails to load
    initializeSectionThumbnails();
    
    // Initialize HBIC page functionality
    if (document.getElementById('hbic-section1-player')) {
        initializeHBICSection1();
    }
    
    if (document.getElementById('hbic-section2-player')) {
        initializeHBICSection2();
    }
    
    if (document.getElementById('hbic-section3-player1')) {
        initializeHBICSection3();
    }
    
    // Force mobile thumbnails for HBIC videos
    if (document.getElementById('hbic-section1-video')) {
        initializeHBICMobileThumbnails();
    }
    
    if (document.getElementById('youtube-grid')) {
        loadHBICYouTubeVideos();
    }
    
    const videos = [
        { src: 'https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/1_HomePage/Hunter%20Douglas_1.mov', username: 'Hunter Douglas' },
        { src: 'https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/1_HomePage/HBIC.mp4', username: 'Head Bartender in Charge' },
        { src: 'https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/1_HomePage/Hunter%20Douglas_2.mov', username: 'Hunter Douglas' }
    ];
    
    let currentVideoIndex = 0;
    const videoElement = document.getElementById('story-video');
    const usernameElement = document.getElementById('story-username');
    const progressBars = document.querySelectorAll('.progress-bar');
    
    function updateProgressBars() {
        progressBars.forEach((bar, index) => {
            bar.classList.remove('active', 'completed');
            // Remove any existing progress animation
            bar.style.animation = 'none';
            bar.style.width = '';
            
            if (index < currentVideoIndex) {
                bar.classList.add('completed');
                bar.style.width = '100%';
            } else if (index === currentVideoIndex) {
                bar.classList.add('active');
                bar.style.width = '0%';
            }
        });
    }
    
    function updateCurrentProgress(progress) {
        const currentBar = progressBars[currentVideoIndex];
        if (currentBar) {
            currentBar.style.width = `${progress}%`;
        }
    }
    
    function loadVideo(index) {
        if (videoElement && videos[index]) {
            console.log('Loading video:', videos[index].src, 'Username:', videos[index].username);
            
            // Update video source - need to update both source elements
            const sources = videoElement.querySelectorAll('source');
            sources.forEach(source => {
                source.src = videos[index].src;
            });
            
            // Alternative: set src directly on video element
            videoElement.src = videos[index].src;
            videoElement.load();
            
            // Update username
            if (usernameElement) {
                usernameElement.textContent = videos[index].username;
            }
            
            // Update progress bars
            updateProgressBars();
            
            // Play video
            videoElement.play().catch(e => console.log('Auto-play prevented:', e));
        }
    }
    
    function nextVideo() {
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        loadVideo(currentVideoIndex);
    }
    
    // Initialize first video
    loadVideo(0);
    
    // Auto-advance when video ends
    if (videoElement) {
        videoElement.addEventListener('ended', () => {
            console.log('Video ended, advancing to next');
            nextVideo();
        });
        
        // Update progress bar as video plays
        videoElement.addEventListener('timeupdate', () => {
            if (videoElement.duration) {
                const progress = (videoElement.currentTime / videoElement.duration) * 100;
                updateCurrentProgress(progress);
            }
        });
        
        // Also advance after a set duration (in case video doesn't fire 'ended' event)
        let videoTimer;
        
        videoElement.addEventListener('loadedmetadata', () => {
            // Clear any existing timer
            if (videoTimer) clearTimeout(videoTimer);
            
            // Set timer for video duration + 1 second buffer
            const duration = videoElement.duration || 15;
            videoTimer = setTimeout(() => {
                console.log('Timer triggered, advancing to next video');
                nextVideo();
            }, (duration + 1) * 1000);
        });
        
        // Additional fallback: advance every 15 seconds regardless
        setInterval(() => {
            console.log('15-second fallback check');
            if (videoElement.ended || videoElement.paused) {
                nextVideo();
            }
        }, 15000);
    }
});

// Add subtle animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-item, .feature-item, .team-member').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Toggle mute functionality for case study videos
function toggleMute(videoId, buttonId) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);
    const muteIcon = button.querySelector('.mute-icon');
    const unmuteIcon = button.querySelector('.unmute-icon');
    
    if (video && button) {
        if (video.muted) {
            // Unmute the video
            video.muted = false;
            muteIcon.style.display = 'block';
            unmuteIcon.style.display = 'none';
        } else {
            // Mute the video
            video.muted = true;
            muteIcon.style.display = 'none';
            unmuteIcon.style.display = 'block';
        }
    }
}

// Video play functionality for process section
function toggleVideoPlay(element) {
    // Find the video element - could be the element itself or within the container
    const video = element.tagName === 'VIDEO' ? element : element.closest('.landscape-video, .portrait-video, .career-journey-video, .flagship-video')?.querySelector('video');
    const playButton = element.closest('.landscape-video, .portrait-video, .career-journey-video, .flagship-video')?.querySelector('.media-play-btn');
    
    if (video) {
        // Pause all other videos first
        pauseAllOtherVideos(video);
        
        if (video.paused) {
            video.play();
            if (playButton) playButton.style.opacity = '0';
        } else {
            video.pause();
            if (playButton) playButton.style.opacity = '1';
        }
    }
}

// Function to pause all videos except the current one
function pauseAllOtherVideos(currentVideo) {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(video => {
        if (video !== currentVideo && !video.paused) {
            video.pause();
            // Show the play button for paused videos
            const container = video.closest('.landscape-video, .portrait-video, .career-journey-video, .flagship-video');
            const playButton = container?.querySelector('.media-play-btn');
            if (playButton) playButton.style.opacity = '1';
        }
    });
}

// Photo expansion functionality
function expandPhoto(img) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'photo-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    // Create expanded image
    const expandedImg = document.createElement('img');
    expandedImg.src = img.src;
    expandedImg.alt = img.alt;
    expandedImg.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
    `;
    
    overlay.appendChild(expandedImg);
    document.body.appendChild(overlay);
    
    // Close on click
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Content Showcase Carousel Functionality
let currentLandscapeIndex = 0;
let currentVerticalIndex = 0;
let currentPhotoIndex = 0;

// Shuffle function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Original landscape video data (8 total videos)
const originalLandscapeVideos = [
    'landscape-01.mp4', 'landscape-02.mp4', 'landscape-03.mp4', 'landscape-04.mp4',
    'landscape-05.mp4', 'landscape-06.mp4', 'landscape-07.mp4', 'landscape-08.mp4'
];

// Original vertical video data (10 total videos)
const originalVerticalVideos = [
    'vertical-01.mp4', 'vertical-02.mp4', 'vertical-03.mp4', 'vertical-04.mp4',
    'vertical-05.mp4', 'vertical-06.mp4', 'vertical-07.mp4', 'vertical-08.mp4',
    'vertical-09.mp4', 'vertical-10.mp4'
];

// Original photo data (103 total photos) - matching your actual files
const originalPhotos = [];
for (let i = 1; i <= 54; i++) {
    originalPhotos.push(`photo-${i.toString().padStart(3, '0')}.JPG`);
}
originalPhotos.push('photo-055.jpeg'); // Special case
for (let i = 56; i <= 89; i++) {
    originalPhotos.push(`photo-${i.toString().padStart(3, '0')}.JPG`);
}
for (let i = 90; i <= 103; i++) {
    originalPhotos.push(`photo-${i.toString().padStart(3, '0')}.jpeg`);
}

// Shuffled arrays (randomized on page load)
let landscapeVideos = shuffleArray(originalLandscapeVideos);
let verticalVideos = shuffleArray(originalVerticalVideos);
let photos = shuffleArray(originalPhotos);

// Scroll landscape videos
function scrollLandscapeVideos(direction) {
    if (direction === 'left') {
        currentLandscapeIndex = (currentLandscapeIndex - 3 + landscapeVideos.length) % landscapeVideos.length;
    } else {
        currentLandscapeIndex = (currentLandscapeIndex + 3) % landscapeVideos.length;
    }
    updateLandscapeDisplay();
}

// Scroll vertical videos
function scrollVerticalVideos(direction) {
    if (direction === 'left') {
        currentVerticalIndex = (currentVerticalIndex - 3 + verticalVideos.length) % verticalVideos.length;
    } else {
        currentVerticalIndex = (currentVerticalIndex + 3) % verticalVideos.length;
    }
    updateVerticalDisplay();
}

// Scroll photos
function scrollPhotos(direction) {
    console.log('scrollPhotos called with direction:', direction);
    console.log('window width:', window.innerWidth);
    
    // Check if mobile - use direct DOM scrolling
    if (window.innerWidth < 768) {
        const photosGrid = document.querySelector('.photos-grid');
        console.log('photosGrid element:', photosGrid);
        
        if (photosGrid) {
            const scrollAmount = 300; // pixels to scroll
            console.log('Current scrollLeft:', photosGrid.scrollLeft);
            console.log('ScrollWidth:', photosGrid.scrollWidth);
            console.log('ClientWidth:', photosGrid.clientWidth);
            
            if (direction === 'left') {
                photosGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                console.log('Scrolling left by', -scrollAmount);
            } else {
                photosGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                console.log('Scrolling right by', scrollAmount);
            }
            
            // Check scroll position after
            setTimeout(() => {
                console.log('New scrollLeft after scroll:', photosGrid.scrollLeft);
            }, 100);
        } else {
            console.error('photosGrid element not found!');
        }
        return;
    }
    
    // Desktop - original behavior
    if (direction === 'left') {
        currentPhotoIndex -= 16;
        if (currentPhotoIndex < 0) {
            // Calculate the last complete set of 16 photos
            const lastCompleteSet = Math.floor((photos.length - 1) / 16) * 16;
            currentPhotoIndex = lastCompleteSet;
        }
    } else {
        currentPhotoIndex += 16;
        if (currentPhotoIndex >= photos.length) {
            currentPhotoIndex = 0;
        }
    }
    updatePhotoDisplay();
}

// Update landscape video display
function updateLandscapeDisplay() {
    const container = document.getElementById('landscape-thumbnails');
    if (container) {
        const thumbs = container.querySelectorAll('.video-thumb');
        for (let i = 0; i < 3; i++) {
            const videoIndex = (currentLandscapeIndex + i) % landscapeVideos.length;
            if (thumbs[i] && landscapeVideos[videoIndex]) {
                const video = thumbs[i].querySelector('video');
                const source = video?.querySelector('source');
                if (source && video) {
                    const newSrc = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/2_SCA-Health/Content-Library-Showcase/Landscape-Videos/${landscapeVideos[videoIndex]}`;
                    if (source.src !== newSrc) {
                        source.src = newSrc;
                        video.load();
                    }
                }
                thumbs[i].setAttribute('data-video', videoIndex + 1);
            }
        }
    }
}

// Update vertical video display
function updateVerticalDisplay() {
    const container = document.getElementById('vertical-thumbnails');
    if (container) {
        const thumbs = container.querySelectorAll('.video-thumb');
        for (let i = 0; i < 3; i++) {
            const videoIndex = (currentVerticalIndex + i) % verticalVideos.length;
            if (thumbs[i] && verticalVideos[videoIndex]) {
                const video = thumbs[i].querySelector('video source');
                if (video) {
                    video.src = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/2_SCA-Health/Content-Library-Showcase/Vertical-Videos/${verticalVideos[videoIndex]}`;
                    thumbs[i].querySelector('video').load();
                }
                thumbs[i].setAttribute('data-video', videoIndex + 1);
            }
        }
    }
}

// Update photo display
function updatePhotoDisplay() {
    const photoRows = document.querySelectorAll('.photo-row');
    
    // Check if mobile (screen width < 768px)
    if (window.innerWidth < 768) {
        // Mobile: Use existing first row but populate with all photos
        const topRow = document.querySelector('.photo-row.top-row');
        if (topRow) {
            // Clear existing photos and add all 103 photos
            topRow.innerHTML = '';
            
            // Add all photos to the single row
            photos.forEach((photo, index) => {
                const img = document.createElement('img');
                img.src = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/2_SCA-Health/Content-Library-Showcase/Photos/${photo}`;
                img.alt = `Photo ${index + 1}`;
                img.className = 'photo-thumb';
                img.setAttribute('data-photo', index + 1);
                img.onclick = () => expandPhoto(img);
                img.loading = 'lazy';
                topRow.appendChild(img);
            });
            
            console.log(`Created ${photos.length} photos in mobile horizontal row`);
        }
        return;
    }
    
    // Desktop: Original 3-row layout
    let photoPosition = 0;
    
    // Top row: 5 photos
    const topRow = photoRows[0];
    if (topRow) {
        const images = topRow.querySelectorAll('img');
        for (let i = 0; i < 5; i++) {
            const photoIndex = currentPhotoIndex + photoPosition;
            if (images[i] && photos[photoIndex]) {
                images[i].src = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/2_SCA-Health/Content-Library-Showcase/Photos/${photos[photoIndex]}`;
                images[i].setAttribute('data-photo', photoPosition + 1);
            }
            photoPosition++;
        }
    }
    
    // Middle row: 6 photos
    const middleRow = photoRows[1];
    if (middleRow) {
        const images = middleRow.querySelectorAll('img');
        for (let i = 0; i < 6; i++) {
            const photoIndex = currentPhotoIndex + photoPosition;
            if (images[i] && photos[photoIndex]) {
                images[i].src = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/2_SCA-Health/Content-Library-Showcase/Photos/${photos[photoIndex]}`;
                images[i].setAttribute('data-photo', photoPosition + 1);
            }
            photoPosition++;
        }
    }
    
    // Bottom row: 5 photos
    const bottomRow = photoRows[2];
    if (bottomRow) {
        const images = bottomRow.querySelectorAll('img');
        for (let i = 0; i < 5; i++) {
            const photoIndex = currentPhotoIndex + photoPosition;
            if (images[i] && photos[photoIndex]) {
                images[i].src = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/2_SCA-Health/Content-Library-Showcase/Photos/${photos[photoIndex]}`;
                images[i].setAttribute('data-photo', photoPosition + 1);
            }
            photoPosition++;
        }
    }
}

// Load random preview video on page load
function loadRandomPreviewVideo() {
    const randomIndex = Math.floor(Math.random() * landscapeVideos.length);
    const previewArea = document.getElementById('landscape-preview');
    if (previewArea && landscapeVideos[randomIndex]) {
        previewArea.innerHTML = `
            <video id="preview-video" muted loop style="width: 100%; height: 100%; object-fit: cover;">
                <source src="https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/2_SCA-Health/Content-Library-Showcase/Landscape-Videos/${landscapeVideos[randomIndex]}" type="video/mp4">
            </video>
            <button class="media-play-btn" onclick="togglePreviewVideo()">
                <div class="play-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5v14l11-7z" fill="currentColor"/>
                    </svg>
                </div>
            </button>
            <button class="unmute-button" id="preview-unmute-btn" onclick="toggleMute('preview-video', 'preview-unmute-btn')">
                <svg class="mute-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: none;">
                    <path d="M3 9v6h4l5 5V4L7 9H3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17.66 6.34a9 9 0 0 1 0 11.32" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg class="unmute-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                    <path d="M3 9v6h4l5 5V4L7 9H3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
    }
}

// Landscape video selection - mobile-friendly full-screen
function selectLandscapeVideo(videoNumber) {
    const actualIndex = (currentLandscapeIndex + (videoNumber - 1)) % landscapeVideos.length;
    const previewArea = document.getElementById('landscape-preview');
    
    // Check if mobile (screen width < 768px) - open in full screen modal
    if (window.innerWidth < 768) {
        openVideoModal(landscapeVideos[actualIndex]);
        return;
    }
    
    // Desktop behavior - use preview area
    if (previewArea && landscapeVideos[actualIndex]) {
        // Pause all other videos first
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(video => {
            if (!video.paused) {
                video.pause();
                video.muted = true;
            }
        });
        
        previewArea.innerHTML = `
            <video id="preview-video" muted loop style="width: 100%; height: 100%; object-fit: cover;">
                <source src="https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/2_SCA-Health/Content-Library-Showcase/Landscape-Videos/${landscapeVideos[actualIndex]}" type="video/mp4">
            </video>
            <button class="media-play-btn" onclick="togglePreviewVideo()">
                <div class="play-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5v14l11-7z" fill="currentColor"/>
                    </svg>
                </div>
            </button>
            <button class="unmute-button" id="preview-unmute-btn" onclick="toggleMute('preview-video', 'preview-unmute-btn')">
                <svg class="mute-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: none;">
                    <path d="M3 9v6h4l5 5V4L7 9H3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17.66 6.34a9 9 0 0 1 0 11.32" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg class="unmute-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                    <path d="M3 9v6h4l5 5V4L7 9H3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
        
        // Auto-play the selected video
        setTimeout(() => {
            const previewVideo = document.getElementById('preview-video');
            const playButton = document.querySelector('.landscape-preview .media-play-btn');
            if (previewVideo && playButton) {
                previewVideo.play();
                previewVideo.muted = false; // Auto-unmute when playing
                playButton.style.opacity = '0'; // Hide play button since video is playing
            }
        }, 100);
    }
}

// Toggle preview video play/pause
function togglePreviewVideo() {
    const video = document.getElementById('preview-video');
    const playButton = document.querySelector('.landscape-preview .media-play-btn');
    
    if (video && playButton) {
        // Pause all other videos first
        pauseAllOtherVideos(video);
        
        if (video.paused) {
            video.play();
            video.muted = false; // Auto-unmute when playing
            playButton.style.opacity = '0';
        } else {
            video.pause();
            video.muted = true; // Auto-mute when paused
            playButton.style.opacity = '1';
        }
    }
}

// Vertical video in-place playback
function playVerticalVideo(videoNumber) {
    const thumbs = document.querySelectorAll('.video-thumb.vertical');
    const targetThumb = thumbs[videoNumber - 1];
    if (targetThumb) {
        const video = targetThumb.querySelector('video');
        if (video) {
            if (video.paused) {
                // Pause all other videos first
                pauseAllOtherVideos(video);
                video.play();
                video.muted = false; // Auto-unmute when playing
                targetThumb.querySelector('.play-overlay').style.opacity = '0';
            } else {
                video.pause();
                video.muted = true; // Auto-mute when paused
                targetThumb.querySelector('.play-overlay').style.opacity = '1';
            }
        }
    }
}


// Load video thumbnails - hero video loads immediately, others load on scroll (mobile)
function loadVideoThumbnails() {
    console.log('Loading video thumbnails with mobile optimization...');
    
    // Hero video - always load immediately
    const heroVideo = document.getElementById('sca-hero-video');
    if (heroVideo) {
        console.log('Loading hero video immediately...');
        heroVideo.setAttribute('playsinline', 'true');
        heroVideo.setAttribute('muted', 'true');
        heroVideo.setAttribute('webkit-playsinline', 'true');
        heroVideo.preload = 'metadata';
        
        heroVideo.addEventListener('loadedmetadata', () => {
            console.log('Hero video metadata loaded, seeking to first frame...');
            heroVideo.currentTime = 0.1;
            setTimeout(() => {
                heroVideo.currentTime = 0;
                console.log('Hero video thumbnail ready');
            }, 50);
        }, { once: true });
        
        heroVideo.load();
    }
    
    // Process section videos - optimize based on device
    const processVideos = document.querySelectorAll('.landscape-video video, .portrait-video video, .career-journey-video video, .flagship-video video');
    
    processVideos.forEach((video, index) => {
        console.log(`Loading process video ${index + 1}:`, video);
        
        // Enhanced mobile optimizations
        video.setAttribute('playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        
        // Different strategy for mobile vs desktop
        if (window.innerWidth < 768) {
            // Mobile: Lazy load process videos
            video.preload = 'none';
            video.style.backgroundColor = '#f0f0f0';
            
            const loadVideoThumbnail = () => {
                video.preload = 'metadata';
                video.load();
                
                video.addEventListener('loadeddata', () => {
                    console.log(`Mobile process video ${index + 1} data loaded`);
                    video.currentTime = 0.1;
                    setTimeout(() => {
                        video.currentTime = 0;
                        console.log(`Mobile process video ${index + 1} thumbnail ready`);
                    }, 50);
                }, { once: true });
            };
            
            // Use intersection observer for process videos on mobile
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadVideoThumbnail();
                        observer.unobserve(video);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(video);
            
        } else {
            // Desktop: Load all videos immediately
            video.preload = 'metadata';
            
            video.addEventListener('loadedmetadata', () => {
                console.log(`Desktop process video ${index + 1} metadata loaded, seeking to first frame...`);
                video.currentTime = 0.1;
                
                setTimeout(() => {
                    video.currentTime = 0;
                    console.log(`Desktop process video ${index + 1} thumbnail ready`);
                }, 100);
            }, { once: true });
            
            video.load();
        }
        
        // Handle loading errors
        video.addEventListener('error', (e) => {
            console.error(`Process video ${index + 1} failed to load:`, e);
        });
    });
}

// Create mobile landscape section that mirrors vertical video structure
function createMobileLandscapeSection() {
    const contentGrid = document.querySelector('.content-grid');
    if (contentGrid) {
        // Create landscape section HTML that mirrors vertical videos
        const landscapeSection = document.createElement('div');
        landscapeSection.className = 'mobile-landscape-video-section';
        landscapeSection.innerHTML = `
            <button class="scroll-arrow left" onclick="scrollMobileLandscapeVideos('left')">‹</button>
            <div class="mobile-landscape-thumbnails">
                <div class="video-thumb landscape mobile-landscape" data-video="1" onclick="openVideoModal('landscape-01.mp4')">
                    <video muted preload="metadata">
                        <source src="https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/2_SCA-Health/Content-Library-Showcase/Landscape-Videos/landscape-01.mp4" type="video/mp4">
                    </video>
                    <div class="play-overlay">▶</div>
                </div>
            </div>
            <button class="scroll-arrow right" onclick="scrollMobileLandscapeVideos('right')">›</button>
        `;
        
        // Add CSS styling to match vertical videos
        landscapeSection.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0 20px;
            margin-bottom: 30px;
            gap: 20px;
            box-sizing: border-box;
        `;
        
        // Insert at the beginning of content-grid
        contentGrid.insertBefore(landscapeSection, contentGrid.firstChild);
        
        // Force load thumbnail for the first video immediately
        setTimeout(() => {
            const firstVideo = landscapeSection.querySelector('video');
            if (firstVideo) {
                console.log('Loading first landscape video thumbnail...');
                firstVideo.preload = 'metadata';
                firstVideo.addEventListener('loadedmetadata', () => {
                    firstVideo.currentTime = 0.1;
                    setTimeout(() => {
                        firstVideo.currentTime = 0;
                        console.log('First landscape video thumbnail loaded');
                    }, 100);
                }, { once: true });
                firstVideo.load();
            }
        }, 100);
    }
}

let mobileLandscapeIndex = 0;

// Scroll mobile landscape videos
function scrollMobileLandscapeVideos(direction) {
    console.log('Mobile landscape scroll called:', direction);
    console.log('Current index before:', mobileLandscapeIndex);
    
    if (direction === 'left') {
        mobileLandscapeIndex = (mobileLandscapeIndex - 1 + landscapeVideos.length) % landscapeVideos.length;
    } else {
        mobileLandscapeIndex = (mobileLandscapeIndex + 1) % landscapeVideos.length;
    }
    
    console.log('New index after:', mobileLandscapeIndex);
    console.log('New video should be:', landscapeVideos[mobileLandscapeIndex]);
    
    // Update the displayed video
    const videoThumb = document.querySelector('.mobile-landscape-video-section .video-thumb');
    console.log('Found video thumb:', videoThumb);
    
    if (videoThumb) {
        const video = videoThumb.querySelector('video');
        const source = video?.querySelector('source');
        
        if (source && video) {
            const newVideo = landscapeVideos[mobileLandscapeIndex];
            const newSrc = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/2_SCA-Health/Content-Library-Showcase/Landscape-Videos/${newVideo}`;
            
            console.log('Updating video src to:', newSrc);
            source.src = newSrc;
            video.load();
            videoThumb.setAttribute('onclick', `openVideoModal('${newVideo}')`);
            console.log('Video updated successfully');
        } else {
            console.error('Could not find video or source element');
        }
    } else {
        console.error('Could not find video thumb element');
    }
}

// Mobile full-screen video modal
function openVideoModal(videoFileName) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        box-sizing: border-box;
    `;
    
    // Create video container
    const videoContainer = document.createElement('div');
    videoContainer.style.cssText = `
        position: relative;
        width: 100%;
        max-width: 100%;
        aspect-ratio: 16/9;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
    `;
    
    // Create video element
    const video = document.createElement('video');
    video.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
    `;
    video.controls = true;
    video.autoplay = true;
    video.muted = false;
    
    const source = document.createElement('source');
    source.src = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/2_SCA-Health/Content-Library-Showcase/Landscape-Videos/${videoFileName}`;
    source.type = 'video/mp4';
    
    video.appendChild(source);
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        border: none;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        font-size: 24px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    
    // Add elements to container
    videoContainer.appendChild(video);
    videoContainer.appendChild(closeButton);
    modal.appendChild(videoContainer);
    document.body.appendChild(modal);
    
    // Close modal function
    const closeModal = () => {
        video.pause();
        document.body.removeChild(modal);
    };
    
    // Event listeners
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Randomize McDonald's photos in sections 1-3
function randomizeMcDonaldsPhotos() {
    console.log('Randomizing McDonald\'s section photos...');
    
    // Available photo range (adjust based on what actually exists)
    const availablePhotos = [];
    for (let i = 1; i <= 78; i++) {
        availablePhotos.push(i.toString().padStart(2, '0'));
    }
    
    // Shuffle the array
    const shuffledPhotos = [...availablePhotos].sort(() => Math.random() - 0.5);
    
    // Find all random photo placeholders
    const randomPhotos = document.querySelectorAll('.random-mcdonalds-photo');
    
    randomPhotos.forEach((img, index) => {
        if (shuffledPhotos[index]) {
            const photoNumber = shuffledPhotos[index];
            img.src = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/3_McDonalds/Featured%20Media/McDonalds-${photoNumber}.jpg`;
            img.alt = `McDonald's Photo ${photoNumber}`;
            
            // Add error handling
            img.onerror = () => {
                console.error(`Failed to load random photo: McDonalds-${photoNumber}.jpg`);
                // Try next photo in the shuffled array
                const nextIndex = index + randomPhotos.length;
                if (shuffledPhotos[nextIndex]) {
                    const nextPhoto = shuffledPhotos[nextIndex];
                    img.src = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/3_McDonalds/Featured%20Media/McDonalds-${nextPhoto}.jpg`;
                }
            };
            
            img.onload = () => {
                console.log(`Successfully loaded random photo: McDonalds-${photoNumber}.jpg`);
            };
        }
    });
}

// Load McDonald's photo grid - masonry style with mixed order and sizes
function loadMcDonaldsPhotos() {
    console.log('Loading McDonald\'s masonry photo grid...');
    
    const photoGrid = document.querySelector('.mcdonalds-photo-grid');
    if (photoGrid) {
        // Create array of all 78 photos
        const allPhotos = [];
        for (let i = 1; i <= 78; i++) {
            allPhotos.push(i.toString().padStart(3, '0'));
        }
        
        // Shuffle the array for random order
        const shuffledPhotos = allPhotos.sort(() => Math.random() - 0.5);
        
        // Size variations for visual interest
        const sizeClasses = ['size-small', 'size-medium', 'size-large', ''];
        
        shuffledPhotos.forEach((photoNumber, index) => {
            const photoItem = document.createElement('div');
            
            // Randomly assign size variation
            const randomSize = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
            photoItem.className = `mcdonalds-photo-item ${randomSize}`;
            
            const img = document.createElement('img');
            img.src = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/3_McDonalds/Featured%20Media/McDonalds-${photoNumber}.jpg`;
            img.alt = `McDonald's Photo ${photoNumber}`;
            img.loading = 'lazy';
            img.onclick = () => expandPhoto(img);
            
            // Add error handling
            img.onerror = () => {
                console.error(`Failed to load: McDonalds-${photoNumber}.jpg`);
                photoItem.style.display = 'none';
            };
            
            img.onload = () => {
                console.log(`Successfully loaded: McDonalds-${photoNumber}.jpg`);
            };
            
            photoItem.appendChild(img);
            photoGrid.appendChild(photoItem);
        });
        
        console.log('Loaded masonry grid with 78 randomized McDonald\'s photos');
    }
}

// Enhanced toggle video play with auto-mute/unmute
function toggleVideoPlay(element) {
    // Find the video element - could be the element itself or within the container
    const video = element.tagName === 'VIDEO' ? element : element.closest('.landscape-video, .portrait-video, .career-journey-video, .flagship-video')?.querySelector('video');
    const playButton = element.closest('.landscape-video, .portrait-video, .career-journey-video, .flagship-video')?.querySelector('.media-play-btn');
    
    if (video) {
        // Pause all other videos first
        pauseAllOtherVideos(video);
        
        if (video.paused) {
            video.play();
            video.muted = false; // Auto-unmute when playing
            if (playButton) playButton.style.opacity = '0';
        } else {
            video.pause();
            video.muted = true; // Auto-mute when paused
            if (playButton) playButton.style.opacity = '1';
        }
    }
}

// Initialize Hunter Douglas Media Library with main player and thumbnail grid
function initializeHunterDouglasMediaLibrary() {
    console.log('Initializing Hunter Douglas Media Library...');
    
    const mainVideoPlayer = document.getElementById('gallery-main-video');
    const thumbnailGrid = document.getElementById('video-thumbnail-grid');
    
    if (!mainVideoPlayer || !thumbnailGrid) {
        console.error('Media library elements not found');
        return;
    }
    
    // All 27 Hunter Douglas videos
    const hdVideos = [
        'HD_Aria_1.mov',
        'HD_At Home_1.mov',
        'HD_At Home_2.mov',
        'HD_At Home_3.mov',
        'HD_MI_1.MOV',
        'HD_MI_2.MOV',
        'HD_SM_1.mov',
        'HD_SM_2.mp4',
        'HD_SM_3.MOV',
        'HD_SM_4.MOV',
        'HD_SM_5.MOV',
        'HD_SM_6.mp4',
        'HD_SM_7.mp4',
        'HD_SM_8.mp4',
        'HD_SM_9.mp4',
        'HD_SM_10.MOV',
        'HD_SM_11.mp4',
        'HD_SM_12.mp4',
        'HD_Solar_1.mov',
        'HD_Summer_1.mov',
        'HD_Summer_2.mov',
        'HD_Summer_3.mov',
        'HD_Summer_4.mov',
        'HD_Summer_5.mov',
        'HD_Summer_6.mov',
        'HD_Summer_7.mov',
        'HD_Summer_9.mov'
    ];
    
    let currentActiveIndex = 0;
    
    // Load first video into main player
    function loadVideoIntoPlayer(videoFilename, index) {
        const videoUrl = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/4_Hunter%20Douglas/Featured%20Media/${encodeURIComponent(videoFilename)}`;
        
        // Update main player
        const source = mainVideoPlayer.querySelector('source') || document.createElement('source');
        source.src = videoUrl;
        source.type = 'video/mp4';
        
        if (!mainVideoPlayer.querySelector('source')) {
            mainVideoPlayer.appendChild(source);
        }
        
        mainVideoPlayer.load();
        mainVideoPlayer.play().catch(e => console.log('Auto-play prevented:', e));
        
        // Update active thumbnail
        document.querySelectorAll('.video-thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        currentActiveIndex = index;
        console.log(`Loaded video ${index + 1}: ${videoFilename}`);
    }
    
    // Create thumbnails
    hdVideos.forEach((videoFilename, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'video-thumbnail';
        if (index === 0) thumbnail.classList.add('active'); // First thumbnail starts active
        
        const video = document.createElement('video');
        video.muted = true;
        video.preload = 'metadata';
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        
        const videoUrl = `https://pub-205f64340132450ea6c89c949f8a8d5b.r2.dev/Media/4_Hunter%20Douglas/Featured%20Media/${encodeURIComponent(videoFilename)}`;
        
        const source = document.createElement('source');
        source.src = videoUrl;
        source.type = 'video/mp4';
        
        video.appendChild(source);
        video.src = videoUrl; // Set src directly as fallback
        
        const playOverlay = document.createElement('div');
        playOverlay.className = 'thumb-play-overlay';
        playOverlay.innerHTML = '▶';
        
        // Click handler to load video into main player
        thumbnail.addEventListener('click', () => {
            loadVideoIntoPlayer(videoFilename, index);
        });
        
        // Add loading and error handling
        video.onloadedmetadata = () => {
            console.log(`Thumbnail metadata loaded: ${videoFilename}`);
            // Seek to 0.5 seconds to get a good thumbnail frame
            video.currentTime = 0.5;
        };
        
        video.onloadeddata = () => {
            console.log(`Thumbnail data loaded: ${videoFilename}`);
        };
        
        video.onseeked = () => {
            // Force display of the seeked frame
            video.style.opacity = '1';
        };
        
        video.onerror = () => {
            console.error(`Failed to load thumbnail: ${videoFilename}`);
            // Show placeholder instead of hiding
            thumbnail.innerHTML = `
                <div style="width: 100%; height: 100%; background: #333; display: flex; align-items: center; justify-content: center; color: #666; font-size: 10px; text-align: center;">
                    Video<br>Unavailable
                </div>
            `;
        };
        
        thumbnail.appendChild(video);
        thumbnail.appendChild(playOverlay);
        thumbnailGrid.appendChild(thumbnail);
    });
    
    // Auto-load first video
    loadVideoIntoPlayer(hdVideos[0], 0);
    
    console.log(`Media library initialized with ${hdVideos.length} videos`);
}

// Initialize Section 1 auto-cycling videos with controls
function initializeSection1AutoCycle() {
    console.log('Initializing Section 1 auto-cycling videos...');
    
    const videos = [
        document.getElementById('hd-section1-video1'),
        document.getElementById('hd-section1-video2'),
        document.getElementById('hd-section1-video3')
    ];
    
    const playPauseBtn = document.getElementById('section1-play-pause');
    const muteBtn = document.getElementById('section1-mute');
    const progressBar = document.getElementById('section1-progress');
    
    if (!videos[0] || !videos[1] || !videos[2]) {
        console.error('Section 1 videos not found');
        return;
    }
    
    let currentVideoIndex = 0;
    let isTransitioning = false;
    let isPaused = false;
    let isMuted = true;
    
    // Start with first video - with mobile handling
    videos[0].classList.add('active');
    videos[0].currentTime = 0;
    
    // Try to play - if prevented, wait for user interaction
    videos[0].play().then(() => {
        console.log('Auto-play succeeded');
    }).catch(e => {
        console.log('Auto-play prevented, waiting for user interaction:', e);
        // On mobile, wait for touch on Section 1 specifically
        const section1Container = document.getElementById('section1-phone-mockup');
        if (section1Container) {
            section1Container.addEventListener('touchstart', function startOnTouch() {
                videos[0].play().catch(e => console.log('Touch play failed:', e));
                section1Container.removeEventListener('touchstart', startOnTouch);
            }, { once: true });
        }
    });
    
    function switchToNextVideo() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        const currentVideo = videos[currentVideoIndex];
        const nextIndex = (currentVideoIndex + 1) % videos.length;
        const nextVideo = videos[nextIndex];
        
        // Fade out current video
        currentVideo.classList.remove('active');
        currentVideo.pause();
        currentVideo.currentTime = 0;
        
        // Wait for fade transition, then fade in next video
        setTimeout(() => {
            currentVideoIndex = nextIndex;
            nextVideo.classList.add('active');
            nextVideo.currentTime = 0;
            nextVideo.muted = isMuted;
            if (!isPaused) {
                nextVideo.play().then(() => {
                    console.log('Video switch succeeded');
                }).catch(e => {
                    console.log('Video switch auto-play prevented:', e);
                    // Show the video frame even if can't autoplay
                    nextVideo.currentTime = 0.1;
                });
            }
            isTransitioning = false;
        }, 500); // Match CSS transition duration
    }
    
    function getCurrentVideo() {
        return videos[currentVideoIndex];
    }
    
    function updateProgressBar() {
        const currentVideo = getCurrentVideo();
        if (currentVideo && currentVideo.duration > 0) {
            const progress = (currentVideo.currentTime / currentVideo.duration) * 100;
            progressBar.style.width = progress + '%';
        }
    }
    
    // Play/Pause button functionality
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentVideo = getCurrentVideo();
            const playIcon = playPauseBtn.querySelector('.play-icon');
            const pauseIcon = playPauseBtn.querySelector('.pause-icon');
            
            if (isPaused) {
                currentVideo.play().catch(e => console.log('Play prevented:', e));
                isPaused = false;
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                currentVideo.pause();
                isPaused = true;
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        });
    }
    
    // Mute/Unmute button functionality
    if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentVideo = getCurrentVideo();
            const volumeOn = muteBtn.querySelector('.volume-on');
            const volumeOff = muteBtn.querySelector('.volume-off');
            
            if (isMuted) {
                currentVideo.muted = false;
                isMuted = false;
                volumeOn.style.display = 'block';
                volumeOff.style.display = 'none';
            } else {
                currentVideo.muted = true;
                isMuted = true;
                volumeOn.style.display = 'none';
                volumeOff.style.display = 'block';
            }
        });
    }
    
    // Listen for video events
    videos.forEach((video, index) => {
        video.addEventListener('ended', () => {
            if (index === currentVideoIndex && !isTransitioning && !isPaused) {
                switchToNextVideo();
            }
        });
        
        video.addEventListener('timeupdate', () => {
            if (index === currentVideoIndex) {
                updateProgressBar();
            }
        });
        
        video.addEventListener('play', () => {
            if (index === currentVideoIndex) {
                isPaused = false;
                const playIcon = playPauseBtn?.querySelector('.play-icon');
                const pauseIcon = playPauseBtn?.querySelector('.pause-icon');
                if (playIcon && pauseIcon) {
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                }
            }
        });
        
        video.addEventListener('pause', () => {
            if (index === currentVideoIndex) {
                const playIcon = playPauseBtn?.querySelector('.play-icon');
                const pauseIcon = playPauseBtn?.querySelector('.pause-icon');
                if (playIcon && pauseIcon) {
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                }
            }
        });
        
        video.addEventListener('error', () => {
            console.error(`Error loading video ${index + 1}`);
            if (index === currentVideoIndex && !isTransitioning) {
                switchToNextVideo();
            }
        });
        
        video.addEventListener('loadedmetadata', () => {
            console.log(`Section 1 video ${index + 1} loaded successfully`);
        });
    });
    
    console.log('Section 1 auto-cycling with controls initialized');
}

// Force Section 2 & 3 video thumbnails to load
function initializeSectionThumbnails() {
    console.log('Initializing Section 2 & 3 thumbnails...');
    
    // Find all videos in Sections 2 & 3
    const section2Videos = document.querySelectorAll('#step-opportunities .vertical-video-item video');
    const section3Videos = document.querySelectorAll('#step-refine .vertical-video-item video');
    
    [...section2Videos, ...section3Videos].forEach((video, index) => {
        video.addEventListener('loadedmetadata', () => {
            console.log(`Section thumbnail ${index + 1} metadata loaded`);
            // Seek to 1 second to get a good frame
            video.currentTime = 1;
        });
        
        video.addEventListener('seeked', () => {
            console.log(`Section thumbnail ${index + 1} seeked to frame`);
            // Ensure the frame is visible
            video.style.opacity = '1';
        });
        
        video.addEventListener('loadeddata', () => {
            console.log(`Section thumbnail ${index + 1} data loaded`);
            // Force load first frame
            video.currentTime = 0.5;
        });
        
        video.addEventListener('error', (e) => {
            console.error(`Section thumbnail ${index + 1} failed to load:`, e);
            // Show placeholder
            video.parentElement.style.background = '#333';
            video.parentElement.innerHTML = `
                <div style="width: 100%; height: 100%; background: #333; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px;">
                    Video ${index + 1}
                </div>
            `;
        });
        
        // Force load
        video.load();
    });
    
    console.log(`Initialized ${section2Videos.length + section3Videos.length} section thumbnails`);
}

// Expand video to fullscreen overlay
function expandVideo(videoContainer) {
    const video = videoContainer.querySelector('video');
    if (!video) return;
    
    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.className = 'video-fullscreen-overlay';
    overlay.innerHTML = `
        <div class="fullscreen-video-container">
            <video autoplay muted loop controls>
                <source src="${video.querySelector('source').src}" type="video/mp4">
            </video>
            <button class="close-fullscreen" onclick="closeVideoFullscreen(this)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add click-off functionality
    overlay.addEventListener('click', (e) => {
        // Only close if clicking on the overlay itself, not the video
        if (e.target === overlay) {
            closeVideoFullscreen(overlay.querySelector('.close-fullscreen'));
        }
    });
    
    // Animate in
    setTimeout(() => overlay.classList.add('active'), 10);
}

// Close fullscreen video
function closeVideoFullscreen(closeBtn) {
    const overlay = closeBtn.closest('.video-fullscreen-overlay');
    
    // Animate out
    overlay.classList.remove('active');
    
    // Remove overlay after animation
    setTimeout(() => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
    }, 300);
}

// Initialize HBIC Section 1 video player
function initializeHBICSection1() {
    console.log('Initializing HBIC Section 1 video player...');
    
    const video = document.getElementById('hbic-section1-video');
    const playPauseBtn = document.getElementById('hbic-section1-play');
    const muteBtn = document.getElementById('hbic-section1-mute');
    
    if (!video || !playPauseBtn || !muteBtn) {
        console.error('HBIC Section 1 elements not found');
        return;
    }
    
    let isPaused = true;
    let isMuted = true;
    
    // Add event listeners for external pause/play events
    video.addEventListener('pause', () => {
        isPaused = true;
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });
    
    video.addEventListener('play', () => {
        isPaused = false;
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    });
    
    // Play/Pause functionality
    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        
        if (isPaused) {
            pauseAllHBICVideos(video);
            video.play().catch(e => console.log('Play prevented:', e));
            isPaused = false;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            video.pause();
            isPaused = true;
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });
    
    // Mute/Unmute functionality
    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const volumeOn = muteBtn.querySelector('.volume-on');
        const volumeOff = muteBtn.querySelector('.volume-off');
        
        if (isMuted) {
            video.muted = false;
            isMuted = false;
            volumeOn.style.display = 'block';
            volumeOff.style.display = 'none';
        } else {
            video.muted = true;
            isMuted = true;
            volumeOn.style.display = 'none';
            volumeOff.style.display = 'block';
        }
    });
    
    console.log('HBIC Section 1 initialized');
}

// Helper function to pause all HBIC videos except the current one
function pauseAllHBICVideos(exceptVideo) {
    const allHBICVideos = [
        document.getElementById('hbic-section1-video'),
        document.getElementById('hbic-section2-video'),
        document.getElementById('hbic-section3-video1'),
        document.getElementById('hbic-section3-video2')
    ];
    
    allHBICVideos.forEach(video => {
        if (video && video !== exceptVideo && !video.paused) {
            video.pause();
            console.log('Paused other HBIC video');
        }
    });
}

// Initialize HBIC Section 2 video player (same as Section 1)
function initializeHBICSection2() {
    console.log('Initializing HBIC Section 2 video player...');
    
    const video = document.getElementById('hbic-section2-video');
    const playPauseBtn = document.getElementById('hbic-section2-play');
    const muteBtn = document.getElementById('hbic-section2-mute');
    
    if (!video || !playPauseBtn || !muteBtn) {
        console.error('HBIC Section 2 elements not found');
        return;
    }
    
    let isPaused = true;
    let isMuted = true;
    
    // Add event listeners for external pause/play events
    video.addEventListener('pause', () => {
        isPaused = true;
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });
    
    video.addEventListener('play', () => {
        isPaused = false;
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    });
    
    // Play/Pause functionality
    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        
        if (isPaused) {
            pauseAllHBICVideos(video);
            video.play().catch(e => console.log('Play prevented:', e));
            isPaused = false;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            video.pause();
            isPaused = true;
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });
    
    // Mute/Unmute functionality
    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const volumeOn = muteBtn.querySelector('.volume-on');
        const volumeOff = muteBtn.querySelector('.volume-off');
        
        if (isMuted) {
            video.muted = false;
            isMuted = false;
            volumeOn.style.display = 'block';
            volumeOff.style.display = 'none';
        } else {
            video.muted = true;
            isMuted = true;
            volumeOn.style.display = 'none';
            volumeOff.style.display = 'block';
        }
    });
    
    console.log('HBIC Section 2 initialized');
}

// Force mobile thumbnails for HBIC videos
function initializeHBICMobileThumbnails() {
    const hbicVideos = [
        document.getElementById('hbic-section1-video'),
        document.getElementById('hbic-section2-video'),
        document.getElementById('hbic-section3-video1'),
        document.getElementById('hbic-section3-video2')
    ];
    
    hbicVideos.forEach(video => {
        if (video) {
            // Force load first frame for mobile thumbnails
            video.addEventListener('loadedmetadata', () => {
                video.currentTime = 0.1; // Seek to first frame
            });
            
            video.addEventListener('seeked', () => {
                video.style.opacity = '1'; // Ensure visibility
            });
            
            // Trigger load
            video.load();
        }
    });
}

// Initialize HBIC Section 3 video players (both videos)
function initializeHBICSection3() {
    console.log('Initializing HBIC Section 3 video players...');
    
    // Initialize first video
    const video1 = document.getElementById('hbic-section3-video1');
    const playPauseBtn1 = document.getElementById('hbic-section3-play1');
    const muteBtn1 = document.getElementById('hbic-section3-mute1');
    
    // Initialize second video
    const video2 = document.getElementById('hbic-section3-video2');
    const playPauseBtn2 = document.getElementById('hbic-section3-play2');
    const muteBtn2 = document.getElementById('hbic-section3-mute2');
    
    // Helper function to initialize a video player
    function initializePlayer(video, playPauseBtn, muteBtn, playerName) {
        if (!video || !playPauseBtn || !muteBtn) {
            console.error(`HBIC ${playerName} elements not found`);
            return;
        }
        
        let isPaused = true;
        let isMuted = true;
        
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const playIcon = playPauseBtn.querySelector('.play-icon');
            const pauseIcon = playPauseBtn.querySelector('.pause-icon');
            
            if (isPaused) {
                pauseAllHBICVideos(video);
                video.play().catch(e => console.log('Play prevented:', e));
                isPaused = false;
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                video.pause();
                isPaused = true;
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        });
        
        // Mute/Unmute functionality
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const volumeOn = muteBtn.querySelector('.volume-on');
            const volumeOff = muteBtn.querySelector('.volume-off');
            
            if (isMuted) {
                video.muted = false;
                isMuted = false;
                volumeOn.style.display = 'block';
                volumeOff.style.display = 'none';
            } else {
                video.muted = true;
                isMuted = true;
                volumeOn.style.display = 'none';
                volumeOff.style.display = 'block';
            }
        });
        
        // Listen for external pause events to update button states
        video.addEventListener('pause', () => {
            isPaused = true;
            const playIcon = playPauseBtn.querySelector('.play-icon');
            const pauseIcon = playPauseBtn.querySelector('.pause-icon');
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        });
        
        video.addEventListener('play', () => {
            isPaused = false;
            const playIcon = playPauseBtn.querySelector('.play-icon');
            const pauseIcon = playPauseBtn.querySelector('.pause-icon');
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        });
        
        console.log(`HBIC ${playerName} initialized`);
    }
    
    // Initialize both players
    initializePlayer(video1, playPauseBtn1, muteBtn1, 'Section 3 Player 1');
    initializePlayer(video2, playPauseBtn2, muteBtn2, 'Section 3 Player 2');
}

// Load HBIC YouTube videos into grid
function loadHBICYouTubeVideos() {
    console.log('Loading HBIC YouTube video gallery...');
    
    const youtubeGrid = document.getElementById('youtube-grid');
    if (!youtubeGrid) {
        console.error('YouTube grid not found');
        return;
    }
    
    // YouTube video IDs from the iframes you provided
    const youtubeVideos = [
        '7-uqwWeN9gk',
        'juSRCR72DWQ', 
        '1Lc2SXLUKjQ',
        'rcINajYabxI',
        'UVsr3eR1kZw',
        '0vZph7SfhA8',
        '7-uqwWeN9gk', // Duplicate as provided
        'KSM95233MUs',
        'xgca_UJOq84',
        'p0QluCN5qVY',
        'GGzzbJcunhE',
        '1iyAZDEfZgA'
    ];
    
    youtubeVideos.forEach((videoId, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'youtube-video-item';
        
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?si=${Math.random().toString(36).substr(2, 16)}`;
        iframe.title = `HBIC Tutorial Video ${index + 1}`;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        
        videoItem.appendChild(iframe);
        youtubeGrid.appendChild(videoItem);
    });
    
    console.log(`Loaded ${youtubeVideos.length} HBIC YouTube videos`);
}
