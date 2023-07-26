import axios from "axios";
import "./App.css";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "./components/loader/Loader";
function App() {
  const API = "http://localhost:4000/todos";

  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState("");

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [idx, setIdx] = useState(null);
  
  const [fil, setFil] = useState("All");
  const [search, setSearch] = useState("");



  function handleModal(element){
    setModal(true)
    setIdx(element.id)
    setUser(element.title)
  }

  const getTodos = async () => {
    setLoader(true);
    try {
      let { data } = await axios.get(API);
      setTodos(data);
      setLoader(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };
  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = async () => {
    if (text.trim().length == "") {
      return alert("Please write a description!!!");
    }
    setLoader(true);
    try {
      let { data } = await axios.post(API, { title: text });
      getTodos();
      setText("");
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    setLoader(true);
    try {
      let { data } = await axios.delete(`${API}/${id}`);
      setLoader(false);
      getTodos();
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const completeTodo = async (id) => {
    setLoader(true);
    try {
      let { data } = await axios.patch(`${API}/${id}`, {
        completed: !todos.find((todos) => todos.id == id).completed,
      });
      getTodos();
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const editTodo = async (event) => {
    event.preventDefault()
    setLoader(true);
    try {
      let obj = {
        title: event.target["user"].value,
        complete:false         
      };
      let { data } = await axios.put(`${API}/${idx}`, obj);
      setLoader(false);
      getTodos();
    }
    catch (error) {
      setLoader(false);
      console.error(error);
    }
  }

  const searchTodo = async ()=>{
    setLoader(true);
    try {
      let { data } = await axios.get(`${API}?title=${search}`);
      setTodos(data);
      setLoader(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  }


  return (
    <>
  <div className="text-center my-10">
    <h1 className="font-bold text-white text-3xl">Todolist with Async</h1>
    <div className="flex justify-around">
      <div>
        <input
          type="text"
          value={text}
          className="border-2 border-black px-2 py-1 rounded-lg"
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <button className="bg-green-600 text-white px-4 py-1 ml-2 rounded-lg" onClick={() => addTodo(text)}>Add</button>
      </div>
      <div>
        <input onClick={searchTodo}
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search"
          className="border-2 border-gray-500 px-2 py-1 rounded-lg"
        />
      </div>
    </div>
    <select
      value={fil}
      className="border-2 my-6 p-4 rounded-lg text-center border-black"
      onChange={(ev) => setFil(ev.target.value)}
    >
      <option value="All">All</option>
      <option value="Complete">Complete</option>
      <option value="Uncomplete">Uncomplete</option>
    </select>
  </div>

  <table className=" w-[90%] m-auto border-[2px] text-[#FFFF] border-black">
    <thead>
      <tr className="border h-10 border-black">
        <th className="w-5 text-center">id</th>
        <th className="w-40">title</th>
        <th className="w-40">Actives</th>
      </tr>
    </thead>
    <tbody>
      {todos
        .filter((e) => {
          if (fil === "All") {
            return e;
          } else if (fil === "Complete") {
            return e.completed;
          } else if (fil === "Uncomplete") {
            return !e.completed;
          }
        })
        .map((todo) => (
          <tr key={todo.id} className="h-20 items-center border border-black">
            <td className="border text-center border-black">{todo.id}</td>
            <td
              className={
                todo.completed
                  ? "text-red-500 text-center line-through"
                  : "text-center"
              }
            >
              {todo.title}
            </td>
            <td className="flex justify-between w-40 pt-[30px] mx-auto">
              <button className="bg-red-600 text-white px-2 py-1 rounded-lg" onClick={() => deleteTodo(todo.id)}>delete</button>
              <button className="bg-green-600 text-white px-2 py-1 rounded-lg" onClick={() => completeTodo(todo.id)}>
                Completed
              </button>
              <button className="bg-blue-600 text-white px-2 py-1 rounded-lg" onClick={()=>handleModal(todo)} >Edit</button>
            </td>
          </tr>
        ))}
    </tbody>
  </table>

  <div className="fixed top-0 left-0 h-screen w-screen bg-gray-500 bg-opacity-50 flex justify-center items-center" style={{ display: modal ? 'flex' : 'none' }}>
    <form onSubmit={editTodo} className="bg-white p-8 rounded-lg shadow-xl">
      <input
        type="text"
        value={user}
        name='user'
        className="border-2 border-black px-2 py-1 rounded-lg"
        onChange={(e) => {
          setUser(e.target.value);
        }}
      />
      <span className="cursor-pointer" onClick={()=>setModal(false)}>&times;</span>
      <button className="bg-blue-600 text-white px-4 py-1 ml-2 rounded-lg">Submit</button>
    </form>
  </div>

  {loader ? <Loader /> : null}
</>

  );
}

export default App;
