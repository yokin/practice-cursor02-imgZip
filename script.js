document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const controlPanel = document.getElementById('controlPanel');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;

    // 处理拖放上传
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5E5';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5E5';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    });

    // 处理点击上传
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // 处理图片文件
    function handleFile(file) {
        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            originalSize.textContent = formatFileSize(file.size);
            previewContainer.hidden = false;
            controlPanel.hidden = false;
            compressImage(e.target.result, qualitySlider.value / 100);
        };

        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(dataUrl, quality) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            compressedImage.src = compressedDataUrl;
            
            // 计算压缩后的大小
            const compressedSize = Math.round((compressedDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
            document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
        };
        img.src = dataUrl;
    }

    // 质量滑块事件
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        if (currentFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                compressImage(e.target.result, qualitySlider.value / 100);
            };
            reader.readAsDataURL(currentFile);
        }
    });

    // 下载按钮事件
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'compressed_image.jpg';
        link.href = compressedImage.src;
        link.click();
    });

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 