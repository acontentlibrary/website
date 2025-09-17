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
