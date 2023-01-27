const editButton = document.querySelector('.edit')
const modalBg = document.querySelector('#modal-bg')
const tweetModal = document.querySelector('#edit-tweet-modal')
const editTweetForm = document.querySelector('#edit-tweet-form')
const closeTweetModalBtn = document.querySelector('#close-tweet-modal-btn')

editButton.addEventListener('click', (e) => {
    // display modal
    tweetModal.classList.remove('hidden')
    modalBg.classList.remove('hidden')
    // get id and text and insert into form in modal
    const tweetId = e.target.id
    const tweetText = e.target.parentElement.parentElement.previousElementSibling.innerText
    editTweetForm.action = `/tweets/${tweetId}?_method=PATCH`
    editTweetForm.children[0].defaultValue = tweetText
})

closeTweetModalBtn.addEventListener('click', (e) => {
    tweetModal.classList.add('hidden')
    modalBg.classList.add('hidden')
})

