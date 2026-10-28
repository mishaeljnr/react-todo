import { useState, useEffect } from "react"
import "./App.css"

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos")
    return saved ? JSON.parse(saved) : []
  })
  const [text, setText] = useState("")
  const [date, setDate] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addOrUpdate = () => {
    if (!text.trim()) return
    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const dateString = now.toLocaleDateString()

    if (editingId) {
      setTodos(todos.map(t => t.id === editingId ? { ...t, text, dueDate: date, editedAt: `${dateString} ${timeString}` } : t))
      setEditingId(null)
    } else {
      setTodos([{ 
        id: Date.now(), 
        text, 
        dueDate: date, 
        createdAt: `${dateString} ${timeString}`,
        completed: false 
      }, ...todos])
    }
    setText("")
    setDate("")
  }

  const deleteTodo = (id) => setTodos(todos.filter(t => t.id !== id))
  const editTodo = (todo) => {
    setText(todo.text)
    setDate(todo.dueDate || "")
    setEditingId(todo.id)
  }
  const toggle = (id) => setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))

  const filtered = todos.filter(t => t.text.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="app">
      <div className="todo-box">
        <h1>📝 My Todo List</h1>
        <p className="sub">{todos.length} tasks total</p>

        <div className="search-wrap">
          <input className="search" placeholder="🔍 Search tasks..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>

        <div className="input-row">
          <input className="main-input" placeholder="What do you want to do?" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addOrUpdate()} />
          <input type="date" className="date-input" value={date} onChange={e=>setDate(e.target.value)} />
          <button className="add-btn" onClick={addOrUpdate}>{editingId ? "Update" : "Add"}</button>
        </div>

        <div className="list">
          {filtered.length === 0 && <p className="empty">No tasks found. Add one!</p>}
          {filtered.map(todo => (
            <div key={todo.id} className={`item ${todo.completed ? "done" : ""}`}>
              <input type="checkbox" checked={todo.completed} onChange={()=>toggle(todo.id)} />
              <div className="item-info">
                <p className="item-text">{todo.text}</p>
                <div className="meta">
                  <span>📅 Created: {todo.createdAt}</span>
                  {todo.dueDate && <span>🎯 Due: {todo.dueDate}</span>}
                  {todo.editedAt && <span>✏️ Edited: {todo.editedAt}</span>}
                </div>
              </div>
              <div className="actions">
                <button className="edit" onClick={()=>editTodo(todo)}>Edit</button>
                <button className="del" onClick={()=>deleteTodo(todo.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}