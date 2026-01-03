function switchView(mode) {
    const canvas = document.getElementById('mainCanvas');
    const is3D = mode === '3d';
    
    canvas.classList.toggle('mode-3d', is3D);
    canvas.classList.toggle('mode-2d', !is3D);
    document.getElementById('btn2D').classList.toggle('active', !is3D);
    document.getElementById('btn3D').classList.toggle('active', is3D);
}

function toggleChat() {
    document.getElementById('sigmaChat').classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('mainCanvas').classList.add('mode-2d');
});

// Data mapping giữa index của sidebar và ID của panel content
const panelMap = {
    0: { id: 'panel-search', title: 'Search' },
    1: { id: 'panel-build', title: 'Build' },
    2: { id: 'panel-furnish', title: 'Furnish' },
    3: { id: 'panel-outdoor', title: 'Outdoor' },
    4: { id: 'panel-user', title: 'My Items' }
};

document.addEventListener('DOMContentLoaded', () => {
    // Set 2D default (giữ nguyên code cũ)
    document.getElementById('mainCanvas').classList.add('mode-2d');

    // Setup Sidebar Click Events
    const tools = document.querySelectorAll('.editor-sidebar .tool-item');
    const sidePanel = document.getElementById('sidePanel');
    const panelTitle = document.getElementById('panelTitle');

    tools.forEach((tool, index) => {
        tool.addEventListener('click', () => {
            // 1. Toggle active class cho sidebar icon
            tools.forEach(t => t.classList.remove('active'));
            tool.classList.add('active');

            // 2. Mở panel container nếu đang đóng
            sidePanel.classList.add('open');

            // 3. Ẩn tất cả nội dung con, chỉ hiện nội dung tương ứng
            document.querySelectorAll('.panel-content').forEach(p => p.classList.add('hidden'));
            
            const mapData = panelMap[index];
            if (mapData) {
                const contentToShow = document.getElementById(mapData.id);
                if (contentToShow) contentToShow.classList.remove('hidden');
                panelTitle.innerText = mapData.title;
            }
        });
    });
});

function closePanel() {
    document.getElementById('sidePanel').classList.remove('open');
    // Bỏ active state ở sidebar (optional)
    document.querySelectorAll('.editor-sidebar .tool-item').forEach(t => t.classList.remove('active'));
}