const ellipsisButton = document.querySelector('#ellipsis-button')
const popUpMenu = document.querySelector('#pop-up-menu')

ellipsisButton.addEventListener('click', () => {
    popUpMenu.classList.toggle('hidden')
})