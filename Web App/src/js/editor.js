// Utility Functions
const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);
const hide = (el) => el?.classList.add('hidden');
const show = (el) => el?.classList.remove('hidden');
const toggle = (el, className = 'hidden') => el?.classList.toggle(className);

// View switching
function switchView(mode) {
    const canvas = $('mainCanvas');
    const is3D = mode === '3d';
    
    canvas.classList.toggle('mode-3d', is3D);
    canvas.classList.toggle('mode-2d', !is3D);
    $('btn2D').classList.toggle('active', !is3D);
    $('btn3D').classList.toggle('active', is3D);
    
    // Handle 3D view logic
    if (is3D) {
        const canvasObjects = ['placed-object-2d', 'placed-room', 'placed-armchair', 'placed-grass'];
        const allPresent = canvasObjects.every(id => {
            const obj = $(id);
            return obj && !obj.classList.contains('hidden');
        });
        
        const view3DRoom = $('view-3d-room');
        
        if (allPresent) {
            // Show 3D room view
            show(view3DRoom);
            // Hide 2D objects
            canvasObjects.forEach(id => hide($(id)));
        } else {
            // Clear all objects if not all present
            clearAllCanvasObjects();
            hide(view3DRoom);
        }
    } else {
        // Hide 3D room when switching back to 2D
        hide($('view-3d-room'));
    }
}

function toggleChat() {
    toggle($('sigmaChat'), 'open');
}

// Panel management system
const panelMap = {
    0: { id: 'panel-search', title: 'Search' },
    1: { id: 'panel-build', title: 'Build' },
    2: { id: 'panel-furnish', title: 'Furnish' },
    3: { id: 'panel-outdoor', title: 'Outdoor' },
    4: { id: 'panel-user', title: 'My Items' }
};

function openPanel(index) {
    const tools = $$('.editor-sidebar .tool-item');
    const sidePanel = $('sidePanel');
    const mapData = panelMap[index];
    
    if (!mapData) return;
    
    // Update sidebar active state
    tools.forEach(t => t.classList.remove('active'));
    tools[index]?.classList.add('active');
    
    // Show panel
    sidePanel.classList.add('open');
    
    // Show correct content
    $$('.panel-content').forEach(p => hide(p));
    const contentToShow = $(mapData.id);
    if (contentToShow) {
        show(contentToShow);
        $('panelTitle').innerText = mapData.title;
    }
}

function closePanel() {
    $('sidePanel').classList.remove('open');
    $$('.editor-sidebar .tool-item').forEach(t => t.classList.remove('active'));
}

// Navigation helpers for sub-panels
const navigation = {
    build: {
        openRooms: () => {
            hide($('build-categories'));
            show($('build-room-shapes'));
        },
        back: () => {
            show($('build-categories'));
            hide($('build-room-shapes'));
        }
    },
    furnish: {
        openArmchairs: () => {
            hide($('furnish-categories'));
            show($('furnish-items-list'));
        },
        back: () => {
            show($('furnish-categories'));
            hide($('furnish-items-list'));
        }
    },
    outdoor: {
        openPaths: () => {
            hide($('outdoor-categories'));
            show($('outdoor-items-list'));
        },
        back: () => {
            show($('outdoor-categories'));
            hide($('outdoor-items-list'));
        }
    }
};

// Global navigation functions for HTML onclick
window.backToBuildCategories = navigation.build.back;
window.backToFurnishCategories = navigation.furnish.back;
window.backToOutdoorCategories = navigation.outdoor.back;
window.closePanel = closePanel;

// Canvas object placement
function placeObject(objectId) {
    const obj = $(objectId);
    if (obj) show(obj);
}

// Clear all canvas objects
function clearAllCanvasObjects() {
    const canvasObjects = ['placed-object-2d', 'placed-room', 'placed-armchair', 'placed-grass', 'view-3d-room'];
    canvasObjects.forEach(id => hide($(id)));
}

// Make clearAllCanvasObjects available globally
window.clearAllCanvasObjects = clearAllCanvasObjects;

// Event binding helper
function bindClick(elementId, handler) {
    const el = $(elementId);
    if (el) el.addEventListener('click', handler);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default mode
    $('mainCanvas').classList.add('mode-2d');

    // Setup sidebar tool clicks
    const tools = $$('.editor-sidebar .tool-item');
    tools.forEach((tool, index) => {
        tool.addEventListener('click', () => openPanel(index));
    });

    // Search flow
    const searchInput = $('.panel-search input');
    const woodTags = $$('.specific-tag-wood');
    
    woodTags.forEach(tag => {
        tag.addEventListener('click', () => {
            hide($('search-suggestions'));
            show($('search-results'));
            searchInput.value = 'Wood door';
        });
    });
    
    searchInput?.addEventListener('click', () => {
        if (searchInput.value === 'Wood door') {
            searchInput.value = '';
            show($('search-suggestions'));
            hide($('search-results'));
            hide($('placed-object-2d'));
        }
    });
    
    bindClick('target-door-item', () => {
        placeObject('placed-object-2d');
        closePanel();
    });

    // Build flow
    bindClick('btn-open-rooms', navigation.build.openRooms);
    bindClick('target-room-shape', () => placeObject('placed-room'));

    // Furnish flow
    bindClick('btn-open-armchairs', navigation.furnish.openArmchairs);
    bindClick('target-armchair', () => placeObject('placed-armchair'));

    // Outdoor flow
    bindClick('btn-open-paths', navigation.outdoor.openPaths);
    bindClick('target-grass', () => placeObject('placed-grass'));

    // My Items reuse
    bindClick('btn-my-grass', () => placeObject('placed-grass'));
    bindClick('btn-my-room', () => placeObject('placed-room'));
    bindClick('btn-my-door', () => placeObject('placed-object-2d'));
    bindClick('btn-my-armchair', () => placeObject('placed-armchair'));

    // --- LOGIC CHO IMPORT MODAL ---
    
    const btnImport = document.getElementById('btn-import');
    const importModal = document.getElementById('importModal');
    const closeImport = document.getElementById('closeImport');
    const cancelImport = document.getElementById('cancelImport');
    const fileInput = document.getElementById('fileInput');
    const btnBrowseFiles = document.getElementById('btnBrowseFiles');
    const uploadDropzone = document.getElementById('uploadDropzone');
    const importFilesList = document.getElementById('importFilesList');
    const filesContainer = document.getElementById('filesContainer');
    const btnUpload = document.getElementById('btnUpload');
    let selectedFiles = [];

    // Open import modal
    if (btnImport) {
        btnImport.addEventListener('click', (e) => {
            e.preventDefault();
            importModal.classList.remove('hidden');
            resetImportModal();
        });
    }

    // Browse files button
    if (btnBrowseFiles) {
        btnBrowseFiles.addEventListener('click', () => {
            fileInput.click();
        });
    }

    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }

    // Drag and drop
    if (uploadDropzone) {
        uploadDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadDropzone.classList.add('dragover');
        });

        uploadDropzone.addEventListener('dragleave', () => {
            uploadDropzone.classList.remove('dragover');
        });

        uploadDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadDropzone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });
    }

    // Handle selected files
    function handleFiles(files) {
        selectedFiles = Array.from(files);
        if (selectedFiles.length > 0) {
            displaySelectedFiles();
            btnUpload.disabled = false;
        }
    }

    // Display selected files
    function displaySelectedFiles() {
        filesContainer.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <i class="fa-solid fa-file"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
                <button class="remove-file" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
            `;
            filesContainer.appendChild(fileItem);
        });
        
        importFilesList.classList.remove('hidden');

        // Add remove file listeners
        document.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                selectedFiles.splice(index, 1);
                if (selectedFiles.length > 0) {
                    displaySelectedFiles();
                } else {
                    resetImportModal();
                }
            });
        });
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Reset import modal
    function resetImportModal() {
        selectedFiles = [];
        filesContainer.innerHTML = '';
        importFilesList.classList.add('hidden');
        fileInput.value = '';
        btnUpload.disabled = true;
    }

    // Upload files
    if (btnUpload) {
        btnUpload.addEventListener('click', () => {
            // Here you would implement the actual upload logic
            console.log('Uploading files:', selectedFiles);
            // Simulate upload success
            alert(`Successfully uploaded ${selectedFiles.length} file(s)!`);
            importModal.classList.add('hidden');
            resetImportModal();
        });
    }

    // Close import modal
    if (closeImport) {
        closeImport.addEventListener('click', () => {
            importModal.classList.add('hidden');
        });
    }

    if (cancelImport) {
        cancelImport.addEventListener('click', () => {
            importModal.classList.add('hidden');
        });
    }

    // Close modal when clicking outside
    if (importModal) {
        importModal.addEventListener('click', (e) => {
            if (e.target === importModal) {
                importModal.classList.add('hidden');
            }
        });
    }

    // --- LOGIC CHO EXPORT MODAL ---
    
    const btnExport = document.getElementById('btn-export');
    const exportModal = document.getElementById('exportModal');
    const closeExport = document.getElementById('closeExport');
    const cancelExport = document.getElementById('cancelExport');

    // Mở modal khi nhấn Export
    if (btnExport) {
        btnExport.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn hành vi mặc định của thẻ a/button
            exportModal.classList.remove('hidden');
        });
    }

    // Đóng modal khi nhấn X
    if (closeExport) {
        closeExport.addEventListener('click', () => {
            exportModal.classList.add('hidden');
        });
    }

    // Đóng modal khi nhấn Cancel
    if (cancelExport) {
        cancelExport.addEventListener('click', () => {
            exportModal.classList.add('hidden');
        });
    }

    // Đóng modal khi click ra ngoài vùng trắng (vào nền tối)
    if (exportModal) {
        exportModal.addEventListener('click', (e) => {
            if (e.target === exportModal) {
                exportModal.classList.add('hidden');
            }
        });
    }
});