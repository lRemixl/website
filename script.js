let startX;
let scrollLeft;
let isDragging = false;
const container = document.querySelector('.container');
const slider = document.createElement('div');
slider.style.position = 'fixed';
slider.style.bottom = '20px';
slider.style.left = '50%';
slider.style.transform = 'translateX(-50%)';
slider.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
slider.style.width = '100px';
slider.style.height = '20px';
slider.style.borderRadius = '10px';
document.body.appendChild(slider);
	
container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollLeft = container.scrollLeft;
    slider.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
});

container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.pageX;
    const scrollDistance = (x - startX);
    container.scrollLeft = scrollLeft - scrollDistance;
});

container.addEventListener('mouseup', () => {
    isDragging = false;
    slider.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
});

container.addEventListener('mouseleave', () => {
    isDragging = false;
    slider.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
});
