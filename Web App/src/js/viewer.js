// Viewer JavaScript

// Toggle viewer panel
function toggleViewerPanel() {
    const panel = document.getElementById('viewerPanel');
    panel.classList.toggle('open');
}

function closeViewerPanel() {
    const panel = document.getElementById('viewerPanel');
    panel.classList.remove('open');
}

// Switch between 2D and 3D views
function switchViewerMode(mode) {
    const canvas = document.getElementById('viewerCanvas');
    const backgroundImage = document.getElementById('backgroundImage');
    const btn2D = document.getElementById('btn2D');
    const btn3D = document.getElementById('btn3D');
    
    // Remove all mode classes
    canvas.classList.remove('mode-2d', 'mode-3d');
    
    // Add the selected mode class
    canvas.classList.add('mode-' + mode);
    
    // Update button states
    btn2D.classList.remove('active');
    btn3D.classList.remove('active');
    
    if (mode === '2d') {
        btn2D.classList.add('active');
        backgroundImage.src = '../imgs/viewer/2dbackground.png';
    } else {
        btn3D.classList.add('active');
        backgroundImage.src = '../imgs/viewer/3dbackground.png';
    }
}

// Toggle chat window
function toggleChat() {
    const chatWindow = document.getElementById('sigmaChat');
    chatWindow.classList.toggle('open');
}

// Export Modal
document.addEventListener('DOMContentLoaded', function() {
    const btnExport = document.getElementById('btn-export');
    const exportModal = document.getElementById('exportModal');
    const closeExport = document.getElementById('closeExport');
    const cancelExport = document.getElementById('cancelExport');

    if (btnExport) {
        btnExport.addEventListener('click', () => {
            exportModal.classList.remove('hidden');
        });
    }

    if (closeExport) {
        closeExport.addEventListener('click', () => {
            exportModal.classList.add('hidden');
        });
    }

    if (cancelExport) {
        cancelExport.addEventListener('click', () => {
            exportModal.classList.add('hidden');
        });
    }

    // Close modal when clicking outside
    if (exportModal) {
        exportModal.addEventListener('click', (e) => {
            if (e.target === exportModal) {
                exportModal.classList.add('hidden');
            }
        });
    }
});
