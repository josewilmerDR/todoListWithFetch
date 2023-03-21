import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/todos.css";

export const ToDo = () => {//Esta es la versión con estados centralizados, la razón de usar estados centralizados es poder comunicar estados entre componentes
  const { store, actions } = useContext(Context);
  const [refresh, setRefresh] = useState(false) //estado del compoenente para controlar su reenderizado
  const [todoList, setTodoList] = useState([]);
  const [inputValue, setInputValue] = useState("")


  useEffect(() => {
    setTodoList(store.todoList);
  }, [store.todoList]);

  useEffect(() => {
    //ejecutamos una función asíncrona que traerá la información de la lista de To Do
    const cargaDatos = async () => {
      actions.getToDoList()
    }
    cargaDatos()
    let limpiar = document.querySelector("#tarea")
    limpiar.value = ""
  }, [store.user, refresh]) // , el antarior código estaba en la matris de efectos. El componente se renderizará la primera vez y cada vez que el estado user o refresh cambien

  useEffect(() => { console.log(store.todoList) }, [store.todoList])
  const limpiarInput = () => {
    setInputValue("")
  }
  return (
    <div className="container">
      <h1 className="text-center title-todo mt-5">todos</h1>
      <div className="container-todo">
        <div className="container-input" >
          <input placeholder="What needs to be done" id="tarea"
            type="text"
            onChange={(e) => { setInputValue(e.target.value) }}
            value={inputValue}
            onKeyUp={async (e) => {
              if (e.key == "Enter") {
                let resultado = await actions.agregarToDo(e.target.value)
                if (resultado.ok) {
                  setRefresh(!refresh)
                  e.target.value = "" //restauro el valor a vacío
                }
                limpiarInput()
              }

            }}>
          </input>

          <br />
        </div>
        {store.todoList && store.todoList.length > 0 ? //Verifico el estado
          <ul className="list-group text-center">
            {store.todoList.map((item, index) => { //Hago un map del estado y muestro los to do si existen
              return <li className="list-group-item"
                key={index}>
                {item.label}
                <i className="fa-solid fa-trash hiden-trash" onClick={() => {
                  actions.eliminarToDo(index)	//este botón ejecuta esta acción y le pasamos el índice
                }}></i>

              </li>
            })}</ul>
          :
          <div className="text-center thereAreNotTaks"><p>There are not tasks, add a new task</p></div>
        }
        <div className="numberOfTasks">{store.todoList.length} {store.todoList.length === 1 ? 'Task' : 'Tasks'}</div> {/*El pimer todos.length muestra la cantidad de tareas, despues valida si es 1 coloca task de lo contrario coloca tasks */}
      </div>
      <div className="container-todo-shadow">
        <div className="container-todo-shadow1"></div>
        <div className="container-todo-shadow2"></div>
      </div>
    </div>
  );
};
