const avatar = document.querySelector('#avatar')
const avatarModal = document.querySelector('#avatar-modal')
const closeAvatarModalBtn = document.querySelector('#close-avatar-modal-btn')
const input = document.getElementById('inputTag');
const imageName = document.getElementById('imageName')

avatar.addEventListener('click', () => {
    avatarModal.classList.remove('hidden')
    modalBg.classList.remove('hidden')
})

closeAvatarModalBtn.addEventListener('click', (e) => {
    avatarModal.classList.add('hidden')
    modalBg.classList.add('hidden')
})

input.addEventListener('change', () => {
    const inputImage = document.querySelector('input[type=file]').files[0];
    imageName.innerText = inputImage.name;
})