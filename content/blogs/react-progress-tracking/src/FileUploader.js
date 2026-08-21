
// Step 1: Define component state
import React, { useState, useRef } from 'react';

function FileUploader() {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle');

    const xhrRef = useRef(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setProgress(0);
        setStatus('idle');
    };

    // Step 2: Create the upload function

    const handleUpload = () => {
        if (!file) return;

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        const formData = new FormData();
        formData.append('file', file);

        xhr.open('POST', 'http://localhost:5000/upload');

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setProgress(percent);
                setStatus('uploading');
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                setStatus('success');
            }
            else {
                setStatus('error');
            }
        };

        xhr.onerror = () => {
            setStatus('error');
        };

        xhr.send(formData);
    };

    // Step 3: Add cancel support
    const handleCancel = () => {
        if (xhrRef.current) {
            xhrRef.current.abort();
            setStatus('idle');
            setProgress(0);
        }
    };

    // Step 4: Render basic UI
    return (
        <div>
            <input type="file" onChange={handleFileChange} />

            {file && <p>File: {file.name}</p>}

            <div style={{ marginTop: '10px' }}>
                <button onClick={handleUpload} disabled={!file || status === 'uploading'}>
                    Upload
                </button>

                <button onClick={handleCancel} disabled={status !== 'uploading'}>
                    Cancel
                </button>
            </div>

            <div style={{ marginTop: '10px', width: '300px' }}>
                <div style={{ background: '#eee', height: '10px', borderRadius: '5px' }}>
                    <div
                    style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: progress === 100 ? 'green' : 'blue',
                    borderRadius: '5px',
                    transition: 'width 0.3s ease'
                    }}
                    />
                </div>
            </div>

            {status === 'idle' && <p>Select a file to upload</p>}
            {status === 'uploading' && <p>Uploading... {progress}%</p>}
            {status === 'success' && <p>Upload complete!</p>}
            {status === 'error' && <p>Upload failed. Try again.</p>}
        </div>
    );
}

export default FileUploader;