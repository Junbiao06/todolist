

const arr = JSON.parse(localStorage.getItem('data')) || []


const info = document.querySelector('.info')

const task = document.querySelector('.info-task')
const tag = document.querySelector('.info-tag')
const deadline = document.querySelector('.info-deadline')

const btn_delete = document.querySelector('.item-delete')
const btn_add = document.querySelector('.info-add')
const article = document.querySelector('article')

function render() {

  const sectionArr = arr.map((ele, index) => {
    return `
    <section class="items">
    <div class="container-left">
    <input type="checkbox" data-IdCheckbox=${index} class="item-checkbox">
    <span class="item-number">No.${index + 1}</span>
    <span class="item-task">${ele.task}</span>
    <span class="item-tag">${ele.tag}</span>
    </div>
    <div class="container-right">
    <span class="item-createdAt">Created at: ${ele.createdAt}</span>
    <span class="item-deadline">Deadline: ${ele.deadline}</span>
    <button class="item-delete" data-IdDelete=${index}>delete</button>
    </div>
    </section>`})
  article.innerHTML = sectionArr.join('')
}
render()

info.addEventListener('submit', (event) => {
  event.preventDefault()

  if (!task.value || !tag.value || !deadline.value) {
    return alert(`Please fill out this field!`)
  }
  if (new Date(deadline.value).getTime() <= new Date().getTime())
    return alert('Error input of Deadline')

  const obj = {
    task: task.value,
    tag: tag.value,
    createdAt: new Date().toLocaleDateString(),
    deadline: deadline.value
  }
  arr.push(obj)
  render()
  info.reset()
  localStorage.setItem('data', JSON.stringify(arr))
})

info.addEventListener('click', (event) => {
  if (event.target.className === "info-deleteAll")
    if (prompt(`Do you really want to delete all?\nPlease input "YES" to confirm operation.`) === 'YES') {
      arr.length = 0
      localStorage.setItem('data', JSON.stringify(arr))
      render()
      info.reset()
    }
})


article.addEventListener('click', (event) => {
  if (event.target.tagName === "BUTTON") {
    arr.splice(event.target.dataset.idDelete, 1)
  }
  render()
  localStorage.setItem('data', JSON.stringify(arr))
})












// 加入下划线操作失败
// article.addEventListener('click', (event) => {
//   if (event.target.className.toLowerCase() === 'item-checkbox')
//     arr[event.target.dataset.idCheckbox].style.textDecoration = 'line-through'
//   render()
// })




