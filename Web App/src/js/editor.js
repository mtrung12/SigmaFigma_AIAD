// ========== UTILITY FUNCTIONS ==========
const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);
const hide = (el) => el?.classList.add('hidden');
const show = (el) => el?.classList.remove('hidden');
const toggle = (el, className = 'hidden') => el?.classList.toggle(className);

// ========== VIEW MANAGEMENT ==========
const CANVAS_OBJECTS = ['placed-object-2d', 'placed-room', 'placed-armchair', 'placed-grass'];

function switchView(mode) {
    const canvas = $('mainCanvas');
    const is3D = mode === '3d';
    
    canvas.classList.toggle('mode-3d', is3D);
    canvas.classList.toggle('mode-2d', !is3D);
    $('btn2D').classList.toggle('active', !is3D);
    $('btn3D').classList.toggle('active', is3D);
    
    if (is3D) {
        const allPresent = CANVAS_OBJECTS.every(id => {
            const obj = $(id);
            return obj && !obj.classList.contains('hidden');
        });
        
        const view3DRoom = $('view-3d-room');
        
        if (allPresent) {
            show(view3DRoom);
            CANVAS_OBJECTS.forEach(id => hide($(id)));
        } else {
            clearAllCanvasObjects();
            hide(view3DRoom);
        }
    } else {
        hide($('view-3d-room'));
    }
}

function toggleChat() {
    toggle($('sigmaChat'), 'open');
}

function clearAllCanvasObjects() {
    [...CANVAS_OBJECTS, 'view-3d-room'].forEach(id => hide($(id)));
}

// ========== PANEL MANAGEMENT ==========
const PANEL_MAP = {
    0: { id: 'panel-search', title: 'Search' },
    1: { id: 'panel-build', title: 'Build' },
    2: { id: 'panel-furnish', title: 'Furnish' },
    3: { id: 'panel-outdoor', title: 'Outdoor' },
    4: { id: 'panel-user', title: 'My Items' }
};

function openPanel(index) {
    const mapData = PANEL_MAP[index];
    if (!mapData) return;
    
    const tools = $$('.editor-sidebar .tool-item');
    const sidePanel = $('sidePanel');
    const contentToShow = $(mapData.id);
    
    if (!contentToShow) return;
    
    tools.forEach(t => t.classList.remove('active'));
    tools[index]?.classList.add('active');
    
    sidePanel.classList.add('open');
    $$('.panel-content').forEach(p => hide(p));
    show(contentToShow);
    $('panelTitle').innerText = mapData.title;
}

function closePanel() {
    $('sidePanel').classList.remove('open');
    $$('.editor-sidebar .tool-item').forEach(t => t.classList.remove('active'));
}

// ========== NAVIGATION ==========
const toggleSubPanel = (hideId, showId) => {
    hide($(hideId));
    show($(showId));
};

const navigation = {
    build: {
        openRooms: () => toggleSubPanel('build-categories', 'build-room-shapes'),
        back: () => toggleSubPanel('build-room-shapes', 'build-categories')
    },
    furnish: {
        openArmchairs: () => toggleSubPanel('furnish-categories', 'furnish-items-list'),
        back: () => toggleSubPanel('furnish-items-list', 'furnish-categories')
    },
    outdoor: {
        openPaths: () => toggleSubPanel('outdoor-categories', 'outdoor-items-list'),
        back: () => toggleSubPanel('outdoor-items-list', 'outdoor-categories')
    }
};

// Global functions for HTML onclick
window.backToBuildCategories = navigation.build.back;
window.backToFurnishCategories = navigation.furnish.back;
window.backToOutdoorCategories = navigation.outdoor.back;
window.closePanel = closePanel;
window.clearAllCanvasObjects = clearAllCanvasObjects;
window.switchView = switchView;
window.toggleChat = toggleChat;

// ========== CANVAS OBJECTS ==========
const placeObject = (objectId) => show($(objectId));

// ========== EVENT HELPERS ==========
const bindClick = (elementId, handler) => {
    const el = $(elementId);
    if (el) el.addEventListener('click', handler);
};

// ========== INITIALIZATION ==========
const initSearchFlow = () => {
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
};

const initPanelFlows = () => {
    // Build flow
    bindClick('btn-open-rooms', navigation.build.openRooms);
    bindClick('target-room-shape', () => placeObject('placed-room'));

    // Furnish flow
    bindClick('btn-open-armchairs', navigation.furnish.openArmchairs);
    bindClick('target-armchair', () => placeObject('placed-armchair'));

    // Outdoor flow
    bindClick('btn-open-paths', navigation.outdoor.openPaths);
    bindClick('target-grass', () => placeObject('placed-grass'));

    // My Items
    ['grass', 'room', 'door', 'armchair'].forEach(item => {
        bindClick(`btn-my-${item}`, () => placeObject(`placed-${item === 'door' ? 'object-2d' : item}`));
    });
};

const initExportModal = () => {
    const btnExport = $('btn-export');
    const exportModal = $('exportModal');
    const closeExport = $('closeExport');
    const cancelExport = $('cancelExport');

    if (!btnExport || !exportModal) return;

    const closeModalFn = () => exportModal.classList.add('hidden');
    
    btnExport.addEventListener('click', (e) => {
        e.preventDefault();
        exportModal.classList.remove('hidden');
    });

    closeExport?.addEventListener('click', closeModalFn);
    cancelExport?.addEventListener('click', closeModalFn);
    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) closeModalFn();
    });
};

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    $('mainCanvas').classList.add('mode-2d');

    $$('.editor-sidebar .tool-item').forEach((tool, index) => {
        tool.addEventListener('click', () => openPanel(index));
    });

    initSearchFlow();
    initPanelFlows();
    initExportModal();
});