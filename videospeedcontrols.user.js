// ==UserScript==
// @name         HTML5 Video Speed Controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simple keyboard controls for HTML5 video speed and frame-stepping
// @author       lunagus
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const SPEED_STEP = 0.1;
    let activeVideo = null;

    // UI tooltip system (from original script style)
    let tooltipElement = null;
    let tooltipTimer = null;

    function showTooltip(message) {
        if (!tooltipElement) {
            tooltipElement = document.createElement('div');
            tooltipElement.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                padding: 8px 16px;
                border-radius: 4px;
                font-family: Arial, sans-serif;
                font-size: 16px;
                z-index: 2147483647;
                pointer-events: none;
                transition: opacity 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            `;
            document.body.appendChild(tooltipElement);
        }

        tooltipElement.textContent = message;
        tooltipElement.style.opacity = '1';
        tooltipElement.style.display = 'block';

        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(() => {
            tooltipElement.style.opacity = '0';
            setTimeout(() => {
                tooltipElement.style.display = 'none';
            }, 300);
        }, 1500);
    }

    // Smart video detection - prioritizes playing, visible, and largest videos
    function findBestVideo() {
        const videos = Array.from(document.querySelectorAll('video'));
        if (videos.length === 0) return null;
        if (videos.length === 1) return videos[0];

        // Prioritize currently playing video
        const playing = videos.find(v => !v.paused);
        if (playing) return playing;

        // Find largest visible video
        return videos.reduce((best, current) => {
            const rect = current.getBoundingClientRect();
            const area = rect.width * rect.height;
            const bestRect = best.getBoundingClientRect();
            const bestArea = bestRect.width * bestRect.height;
            return area > bestArea ? current : best;
        });
    }

    // Dynamic FPS calculation (from provided script - more accurate)
    function estimateFPS(video) {
        let fps = 30; // default
        try {
            const quality = video.getVideoPlaybackQuality();
            if (quality && video.currentTime > 0 && quality.totalVideoFrames > 0) {
                fps = quality.totalVideoFrames / video.currentTime;
            }
        } catch (err) {
            // getVideoPlaybackQuality not supported, use default
        }
        return fps;
    }

    // Frame stepping
    function stepFrame(video, direction) {
        if (!video || !video.duration) return;
        
        video.pause();
        const fps = estimateFPS(video);
        const frameDuration = 1 / fps;
        
        if (direction < 0) {
            video.currentTime = Math.max(0, video.currentTime - frameDuration);
        } else {
            video.currentTime = Math.min(video.duration, video.currentTime + frameDuration);
        }
    }

    // Update active video reference
    function updateActiveVideo() {
        const newVideo = findBestVideo();
        if (newVideo) {
            activeVideo = newVideo;
        }
    }

    // Keyboard event handler
    function handleKeyPress(e) {
        // Ignore if typing in input fields
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || 
                       target.tagName === 'TEXTAREA' || 
                       target.isContentEditable)) {
            return;
        }

        // Update active video if needed
        if (!activeVideo || !activeVideo.isConnected) {
            updateActiveVideo();
        }
        
        if (!activeVideo) return;

        let handled = false;
        let message = '';

        switch(e.key.toLowerCase()) {
            case 'x':
                // Decrease speed
                activeVideo.playbackRate = Math.max(0.1, activeVideo.playbackRate - SPEED_STEP);
                message = `Speed: ${activeVideo.playbackRate.toFixed(1)}x`;
                handled = true;
                break;

            case 'c':
                // Increase speed
                activeVideo.playbackRate = Math.min(16, activeVideo.playbackRate + SPEED_STEP);
                message = `Speed: ${activeVideo.playbackRate.toFixed(1)}x`;
                handled = true;
                break;

            case 'z':
                // Reset speed
                activeVideo.playbackRate = 1.0;
                message = 'Speed: 1.0x (Reset)';
                handled = true;
                break;

            case 'q':
                // Previous frame
                stepFrame(activeVideo, -1);
                message = '◄ Previous Frame';
                handled = true;
                break;

            case 'e':
                // Next frame
                stepFrame(activeVideo, 1);
                message = 'Next Frame ►';
                handled = true;
                break;
        }

        if (handled) {
            showTooltip(message);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // Initialize
    function init() {
        // Initial video detection
        updateActiveVideo();

        // Listen for keyboard events (capture phase)
        document.addEventListener('keydown', handleKeyPress, true);

        // Update active video when videos play
        document.addEventListener('play', (e) => {
            if (e.target instanceof HTMLVideoElement) {
                activeVideo = e.target;
            }
        }, true);

        // Observe for dynamically added videos
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof Element)) continue;
                    
                    if (node.tagName === 'VIDEO') {
                        updateActiveVideo();
                    } else {
                        // Check for nested videos
                        const videos = node.querySelectorAll?.('video');
                        if (videos && videos.length > 0) {
                            updateActiveVideo();
                        }
                    }
                }
            }
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Wait for body to be available
    if (document.body) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();