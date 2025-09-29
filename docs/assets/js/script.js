let array = JSON.parse(localStorage.getItem('data')) || []
let matchedArr = []

const nav = document.querySelector('nav')
const underline = document.querySelector('.nav-underline')
const infoForm = document.querySelector('.info')
const searchForm = document.querySelector('.search')

const task = document.querySelector('.info-task')
const tag = document.querySelector('.info-tag')
const deadline = document.querySelector('.info-deadline')
const article = document.querySelector('article')

const search_task = document.querySelector('.search-task')
const search_tag = document.querySelector('.search-tag')
const search_deadline = document.querySelector('.search-deadline')

//只在刷新页面的时候执行
function removeExpiredTasks() {
  array = array.filter(element => new Date(element.deadline).getTime() >= new Date().setHours(0, 0, 0, 0));
  localStorage.setItem('data', JSON.stringify(array));
  renderTasks(array);
}

function renderTasks(array) {
  const sectionArr = array.map((ele, index) => {
    return `
    <section class="items ${ele.done ? 'done' : ''}">
    <div class="container-left">
    <input type="checkbox" data-id=${ele.id} class="item-checkbox" ${ele.done ? 'checked' : ''}>
    <span class="item-number">No.${index + 1}</span>
    <span class="item-task">${ele.task}</span>
    </div>
    <div class="container-right">
    <span class="item-tag">${ele.tag}</span>
    <span class="item-createdAt">创建日期<br>${ele.createdAt}</span>
    <span class="item-deadline">截止日期<br>${ele.deadline}</span>
    <button class="item-delete" data-id=${ele.id}>删除</button>
    </div>
    </section>`})
  article.innerHTML = sectionArr.join('')
}

function initUnderline() {
  underline.style.width = `${document.querySelector('nav a.active').offsetWidth}px`
  underline.style.transform = `translateX(${document.querySelector('nav a.active').getBoundingClientRect().left - nav.getBoundingClientRect().left}px)`
}

function updateNav(event) {
  if (event.target.tagName === "A") {
    document.querySelector('nav a.active').classList.remove('active')
    event.target.classList.add('active')
    underline.style.width = `${event.target.offsetWidth}px` // 项目中没有效果
    underline.style.transform = `translateX(${event.target.getBoundingClientRect().left - nav.getBoundingClientRect().left}px)`
    if (event.target.classList.contains('info-a')) {
      infoForm.style.display = "flex"
      searchForm.style.display = "none"
      matchedArr = []
      renderTasks(array)
    }
    else {
      infoForm.style.display = "none"
      searchForm.style.display = "flex"
      renderTasks(matchedArr)
    }
  }
}

function submitModule(event) {
  event.preventDefault()

  if (!task.value || !tag.value || !deadline.value) {
    return alert(`请完整填写代办！`)
  }

  if (new Date(deadline.value).getTime() < new Date().setHours(0, 0, 0, 0)) // 修改截止日期是今天的bug
    return alert('截止日期不能早于今天！')

  const obj = {
    id: new Date().getTime(), // 加入查找模块不能使用splice和index得到的No进行删除，用时间戳和filter
    task: task.value.trim(),
    tag: tag.value,
    createdAt: new Date().toLocaleDateString(),
    deadline: deadline.value,
    done: false
  }
  array.push(obj)
  renderTasks(array)
  localStorage.setItem('data', JSON.stringify(array))
  infoForm.reset()
}

function searchModule(event) {
  event.preventDefault()
  if (!search_task.value && !search_tag.value && !search_deadline.value) {
    return alert(`搜索不能为空！`)
  }
  if (new Date(search_deadline.value).getTime() < new Date().setHours(0, 0, 0, 0)) // 修改了截止日期是今天的bug
    return alert('截止日期不能早于今天！')
  matchedArr = array.filter(element => {
    const matchedTask = search_task.value ? element.task.toLowerCase().includes(search_task.value.toLowerCase()) : true

    const matchedTag = search_tag.value ? element.tag.toLowerCase().includes(search_tag.value.toLowerCase()) : true

    const matchedDeadline = search_deadline.value ? element.deadline.includes(search_deadline.value) : true

    return matchedTask && matchedTag && matchedDeadline;
  })
  renderTasks(matchedArr)
  if (matchedArr.length === 0)
    alert('没有结果！')
  searchForm.reset()
}

function deleteTask(event) {
  if (event.target.classList.contains('item-delete')) {
    array = array.filter(element => element.id !== Number(event.target.dataset.id))
    localStorage.setItem('data', JSON.stringify(array))
    if (document.querySelector('nav a.active').classList.contains('info-a'))
      renderTasks(array)
    else {
      matchedArr = matchedArr.filter(element => element.id !== Number(event.target.dataset.id))
      renderTasks(matchedArr)
    }
  }
}

function handleCheckboxChange(event) {
  if (event.target.classList.contains('item-checkbox')) {
    const item = array.find(element => element.id === Number(event.target.dataset.id))
    if (item) {
      item.done = event.target.checked
    }
    if (event.target.checked) {
      event.target.parentNode.parentNode.classList.add('done')
    } else {
      event.target.parentNode.parentNode.classList.remove('done')
    }
    localStorage.setItem('data', JSON.stringify(array))
  }
}

function deleteAll() {
  if (array.length === 0) {
    return alert('没有元素可以删除！')
  }
  const confirm = prompt(`你确认要删除所有代办吗？\n此操作无法撤销！\n请输入“确认删除”以确认此操作。`)
  if (confirm === '确认删除') {
    array.length = 0
    renderTasks(array)
    localStorage.setItem('data', JSON.stringify(array))
    infoForm.reset?.()
  }
}


initUnderline()
removeExpiredTasks()
renderTasks(array)

nav.addEventListener('click', updateNav)
infoForm.addEventListener('submit', submitModule)
searchForm.addEventListener('submit', searchModule)
article.addEventListener('click', deleteTask)
article.addEventListener('change', handleCheckboxChange)
document.querySelector('.deleteAll').addEventListener('click', deleteAll)