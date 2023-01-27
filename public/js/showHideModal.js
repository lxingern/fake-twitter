const editButton = document.querySelector('.edit')
const modalBg = document.querySelector('#modal-bg')
const modal = document.querySelector('#modal')
const editTweetForm = document.querySelector('#edit-tweet-form')
const closeModalBtn = document.querySelector('#close-modal-btn')

console.dir(editButton)

editButton.addEventListener('click', (e) => {
    // display modal
    modal.classList.remove('hidden')
    modalBg.classList.remove('hidden')
    // get id and text and insert into form in modal
    const tweetId = e.target.id
    const tweetText = e.target.parentElement.parentElement.previousElementSibling.innerText
    editTweetForm.action = `/tweets/${tweetId}?_method=PATCH`
    editTweetForm.children[0].defaultValue = tweetText
})

closeModalBtn.addEventListener('click', (e) => {
    modal.classList.add('hidden')
    modalBg.classList.add('hidden')
})

