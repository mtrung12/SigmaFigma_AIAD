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