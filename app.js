/* Create by Mukesh Mandal */

document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chat-messages');
    const recordButton = document.getElementById('record-button');
    const stopButton = document.getElementById('stop-button');
    const deleteButton = document.getElementById('delete-button');
    const deleteLastButton = document.getElementById('delete-last-button');

    let mediaRecorder;
    let audioChunksList = [];

    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    deleteButton.addEventListener('click', deleteRecordings);
    deleteLastButton.addEventListener('click', deleteLastRecording);

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                let audioChunks = [];

                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    audioChunksList.push(audioBlob);

                    const audioElement = createAudioElement(audioBlob);
                    chatMessages.appendChild(audioElement);

                    deleteButton.disabled = false;
                    deleteLastButton.disabled = false;
                };

                recordButton.disabled = true;
                stopButton.disabled = false;
                deleteButton.disabled = true;
                deleteLastButton.disabled = true;

                mediaRecorder.start();
            })
            .catch(error => console.error('Error accessing microphone:', error));
    }

    function stopRecording() {
        mediaRecorder.stop();
        recordButton.disabled = false;
        stopButton.disabled = true;
    }

    function deleteRecordings() {
        audioChunksList = [];
        chatMessages.innerHTML = '';
        deleteButton.disabled = true;
        deleteLastButton.disabled = true;
    }

    function deleteLastRecording() {
        if (audioChunksList.length > 0) {
            const lastRecording = audioChunksList.pop();
            chatMessages.lastChild.remove();
        }

        if (audioChunksList.length === 0) {
            deleteButton.disabled = true;
            deleteLastButton.disabled = true;
        }
    }

    function createAudioElement(blob) {
        const audioUrl = URL.createObjectURL(blob);
        const audioElement = document.createElement('audio');
        audioElement.src = audioUrl;
        audioElement.controls = true;

        return audioElement;
    }
});