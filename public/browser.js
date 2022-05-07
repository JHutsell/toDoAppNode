document.addEventListener("click", (e) => {
  // delete feature
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Delete item permanently?")) {
      axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(() => {
        e.target.parentElement.parentElement.remove() 
      }).catch(() => {
        alert("Please try again later")
      })
    }
  }
  
  // update feature
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt("Enter your desired new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
    if (userInput) {
      axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(() => {
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput 
    }).catch(() => {
      alert("Please try again later")
    })
    }
  }
})