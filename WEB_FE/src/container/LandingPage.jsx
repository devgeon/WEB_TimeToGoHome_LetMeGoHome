import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Calendar from "react-calendar";
import "../calendar.css";
import dayjs from "dayjs";
import axios from "../utils/axios.util";

import { Modal, FormModal } from "../component/Modal";
import {
  TextInput,
  DateInput,
  TimeInput,
  FileInput,
} from "../component/ModalInput";

import AddTodoBtnImg from "../images/AddList.png";
import EditTodoBtnImg from "../images/edit.png";
import AddTaskBtnImg from "../images/Add_1.png";
import EditTaskBtnImg from "../images/Edit_fill.png";
import ModalAddBtnImg from "../images/Add_2.png";
import TrashBtnImg from "../images/Trash_1.png";
import CheckBtnImg from "../images/Verified.png";
import ShareBtnImg from "../images/share.png";

function LandingPage(props) {
  const { user, Logout } = props;
  const [todoList, setTodolist] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [todo, setTodo] = useState({
    id: null,
    goal: "",
    start: "",
    end: "",
  });
  const [task, setTask] = useState({
    id: null,
    todoId: null,
    content: "",
    datetime: "",
    isDone: false,
  });
  const [shareTodo, setShareTodo] = useState({
    id: null,
    title: "",
    desc: "",
    shareImage: null,
    hashtag: "",
  });
  const [selTodoIdx, setSelTodoIdx] = useState(null);
  const [selDate, setSelDate] = useState(new Date());

  useEffect(() => {
    axios.get("/api/todo/me").then((response) => {
      setTodolist(response.data.payload);
      if (response.data.payload) {
        setSelTodoIdx(0);
      }
    });
  }, []);

  useEffect(() => {
    if (selTodoIdx === null) {
      return;
    }
    axios
      .get("/api/todo/task", {
        params: {
          todoId: todoList[selTodoIdx].id,
          date: dayjs(selDate).format("YYYY-MM-DD"),
        },
      })
      .then((response) => {
        setTaskList(response.data.payload);
      });
  }, [todoList, selTodoIdx, selDate]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!todo.goal) {
      alert("목표를 입력해주세요!");
      return;
    }
    if (!todo.start) {
      alert("시작일을 입력해주세요!");
      return;
    }
    if (!todo.end) {
      alert("종료일을 입력해주세요!");
      return;
    }
    axios
      .post("/api/todo/create", todo)
      .then((response) => {
        setTodolist([...todoList, response.data.payload]);
      })
      .finally(() => {
        setTodo({ id: null, goal: "", start: "", end: "" });
        document.getElementById("input_goal").value = "";
        document.getElementById("input_start_time").value = "";
        document.getElementById("input_end_time").value = "";
        document.getElementById("addTodoModal").style.display = "none";
      });
  };

  const handleDelTodo = (e, id) => {
    e.preventDefault();
    axios
      .post("/api/todo/delete", { id })
      .then((response) => {
        const newTodoList = todoList.filter((todoItem) => todoItem.id !== id);
        setTodolist(newTodoList);
        setSelTodoIdx(newTodoList.length > 0 ? 0 : null);
      })
      .finally(() => {
        document.getElementById("delTodoModal").style.display = "none";
      });
  };

  const handleShareTodo = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("todoId", String(todoList[selTodoIdx].id));
    Object.keys(shareTodo).forEach((key) =>
      formData.append(key, shareTodo[key])
    );
    axios
      .post("/api/todo/share", formData)
      .then((response) => {
        alert("공유가 완료되었습니다.");
      })
      .catch((error) => {
        alert("공유에 실패했습니다.");
      })
      .finally(() => {
        document.getElementById("shareTodoModal").style.display = "none";
      });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!task.content) {
      alert("할 일을 입력해주세요!");
      return;
    }
    if (!task.datetime) {
      alert("시간을 입력해주세요!");
      return;
    }
    const isTaskInList = taskList.some(
      (taskItem) =>
        taskItem.content.toLowerCase().replace(/\s/g, "") ===
        task.content.toLowerCase().replace(/\s/g, "")
    );
    if (isTaskInList) {
      alert("이미 추가된 할 일입니다!");
      return;
    }
    const nextTask = { ...task, todoId: todoList[selTodoIdx].id };
    axios
      .post("/api/todo/task/create", nextTask)
      .then((response) => {
        setTaskList([...taskList, response.data.payload]);
      })
      .finally(() => {
        setTask({
          id: null,
          todoId: null,
          content: "",
          datetime: "",
        });
        document.getElementById("input_task").value = "";
        document.getElementById("input_time").value = "";
        document.getElementById("inputTaskModal").style.display = "none";
      });
  };

  const handleEditTask = (e) => {
    e.preventDefault();
    if (!task.content) {
      alert("수정할 내용을 입력해주세요!");
      return;
    }
    const nextTask = { ...task, todoId: todoList[selTodoIdx].id };
    axios
      .post("/api/todo/task/update", nextTask)
      .then((response) => {
        const nextTaskList = taskList.map((taskItem) => {
          const nextTaskItem = { ...taskItem };
          if (taskItem.id === task.id) {
            nextTaskItem.content = task.content;
            if (task.time) {
              nextTaskItem.datetime = task.datetime;
            }
          }
          return nextTaskItem;
        });
        setTaskList(nextTaskList);
      })
      .finally(() => {
        document.getElementById("editTaskModal").style.display = "none";
      });
  };

  const handleToggleTaskDone = (e, nextTask) => {
    e.preventDefault();
    axios.post("/api/todo/task/update", nextTask).then((response) => {
      const nextTaskList = taskList.map((taskItem) => {
        if (taskItem.id === nextTask.id) {
          return nextTask;
        }
        return taskItem;
      });
      setTaskList(nextTaskList);
    });
  };

  const handleDeleteTask = (e, id) => {
    e.preventDefault();
    axios.post("/api/todo/task/delete", { id }).then((response) => {
      const nextTaskList = taskList.filter((taskItem) => taskItem.id !== id);
      setTaskList(nextTaskList);
      alert("삭제되었습니다.");
    });
  };

  return (
    <div>
      <nav className="bg-primary h-20 flex items-center justify-between">
        <h1 className="font-StrongAFBold text-4xl ml-[45px] text-white">
          <a href="./">이젠 돌아갈 때</a>
        </h1>
        <button
          type="button"
          className="order-last mr-6 border-2 p-3 rounded-md"
          onClick={Logout}
        >
          <span className="text-white font-StrongAF">Logout</span>
        </button>
      </nav>
      <div className="flex flex-row">
        <div className="flex flex-col items-center justify-center h-[91.5vh] w-[17%] bg-white">
          <h1 className="xl:text-3xl md:text-2xl sd:text-xl text-base font-StrongAF mt-6">
            {user.armyType} {user.armyRank}
          </h1>
          <h1 className="xl:text-4xl md:text-3xl sd:text-xl text-base font-StrongAF">
            {user.name}
          </h1>
          <img src={user.image} alt="profile" />
          <div className="grow flex flex-col justify-center w-full">
            {todoList.map((todoItem, idx) => (
              <button
                className={`flex flex-row items-center justify-center w-full mt-3 py-2 ${
                  todoList[selTodoIdx] !== undefined &&
                  todoItem.id === todoList[selTodoIdx].id
                    ? "border-b-2 bg-primary text-white"
                    : ""
                }`}
                key={todoItem.id}
                type="button"
                id={todoItem.id}
                onClick={() => {
                  setSelTodoIdx(idx);
                }}
              >
                <label
                  className="xl:text-2xl md:text-xl text-base font-StrongAF focus:border-slate-500 hover:border-b-2 hover:border-slate-800 cursor-pointer"
                  htmlFor={todoItem.id}
                >
                  {todoItem.goal}
                </label>
              </button>
            ))}
          </div>
          <div className="mt-5">
            <div
              id="todoCtrlButton"
              className="flex flex-row justify-between basis-1/6"
            >
              <button
                id="addTodoBtn"
                type="button"
                className="flex flex-row items-center justify-center w-[80%] h-[50px] bg-white rounded-md mt-2"
                onClick={() => {
                  document.getElementById("addTodoModal").style.display =
                    "block";
                }}
              >
                <img
                  src={AddTodoBtnImg}
                  alt="add todolist"
                  className="w-8 h-8 mr-2 mb-8"
                />
              </button>
              <button
                id="editTodoBtn"
                type="button"
                className="flex flex-row items-center justify-center w-[80%] h-[50px] bg-white rounded-md mt-2"
                onClick={() => {
                  document.getElementById("editTodoModal").style.display =
                    "block";
                }}
              >
                <img
                  src={EditTodoBtnImg}
                  alt="edit todolist"
                  className="w-8 h-8 mr-2 mb-8"
                />
              </button>
              <button
                id="delTodoBtn"
                type="button"
                className="flex flex-row items-center justify-center w-[80%] h-[50px] bg-white rounded-md mt-2"
                onClick={() => {
                  document.getElementById("delTodoModal").style.display =
                    "block";
                }}
              >
                <img
                  src={TrashBtnImg}
                  alt="del todolist"
                  className="w-8 h-8 mr-2 mb-8"
                />
              </button>
              <button
                id="shareTodoBtn"
                type="button"
                onClick={(e) => {
                  document.getElementById("shareTodoModal").style.display =
                    "block";
                }}
                className="flex flex-row items-center justify-center w-[80%] h-[50px] bg-white rounded-md mt-2"
              >
                <img
                  src={ShareBtnImg}
                  alt="share todolist"
                  className="w-8 h-8 mr-2 mb-8"
                />
              </button>
            </div>
            <a
              className="font-StrongAF hover:border-slate-800 hover:border-b-2"
              href="./share"
            >
              다른 TODOLIST
            </a>
          </div>
        </div>

        <div className="dashboard flex flex-row bg-gray-200 w-screen">
          <div className="relative taskList bg-white w-5/12 ml-14 rounded-2xl flex flex-col mt-8 mb-8 content-between">
            <nav className="bg-primary h-[3rem] rounded-t-2xl flex items-center justify-center">
              <h1 className="xl:text-xl md:text-lg text-base text-white font-StrongAFBold">
                {dayjs(selDate).format("MM월 DD일")}
              </h1>
            </nav>
            <div
              id="tasklist"
              className="flex flex-col justify-center shrink-0 overflow-y-auto grow-0"
            >
              {taskList.map((taskItem) => (
                <div
                  key={taskItem.id}
                  className="form-check hover:bg-slate-200"
                >
                  <input
                    className="form-check-input peer ml-3 h-6 w-6 border border-gray-300 rounded-sm focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox"
                    value=""
                    checked={taskItem.isDone}
                    id={`task${taskItem.id}`}
                    onChange={(e) => {
                      handleToggleTaskDone(e, {
                        ...taskItem,
                        isDone: !taskItem.isDone,
                      });
                    }}
                  />
                  <label
                    className="form-check-label inline-block text-gray-800 xl:text-2xl text-xl font-StrongAF peer-checked:line-through peer-checked:text-gray-400"
                    htmlFor={`task${taskItem.id}`}
                  >
                    {taskItem.content}
                  </label>
                  <div className="ml-3 peer-checked:text-gray-400">
                    <label
                      className="font-StrongAF"
                      htmlFor={`task${taskItem.id}`}
                    >
                      {dayjs(taskItem.datetime).format("YYYY-MM-DD HH:mm")}
                    </label>
                    <button
                      type="button"
                      className="float-right mr-3"
                      onClick={(e) => handleDeleteTask(e, taskItem.id)}
                    >
                      <img
                        src={TrashBtnImg}
                        alt="trash task"
                        className="w-6 h-6 mt-auto"
                      />
                    </button>
                    <button
                      type="button"
                      className="float-right mr-3"
                      onClick={() => {
                        document.getElementById("editTaskModal").style.display =
                          "block";
                        setTask({
                          ...task,
                          id: taskItem.id,
                          content: taskItem.content,
                          datetime: taskItem.datetime,
                        });
                        document.getElementById("input_task_edit").value =
                          taskItem.content;
                        document.getElementById("edit_time").value = dayjs(
                          taskItem.datetime
                        ).format("HH:mm");
                      }}
                    >
                      <img
                        src={EditTaskBtnImg}
                        alt="edit task"
                        className="w-6 h-6 mt-auto"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute createButton flex justify-end order-last top-[calc(100%-70px)] right-[10px] w-full">
              <button
                type="button"
                className=""
                onClick={(e) => {
                  document.getElementById("inputTaskModal").style.display =
                    "block";
                }}
              >
                <img src={AddTaskBtnImg} alt="AddTask" />
              </button>
            </div>

            {/* Todo 추가 모달창 */}
            <Modal
              modalId="addTodoModal"
              title="TODOLIST 추가"
              message="TODOLIST를 추가하세요!"
              btnId="addTodoBtn"
              btnClick={handleAddTodo}
              btnImg={ModalAddBtnImg}
            >
              <TextInput
                id="input_goal"
                placeholder="ex) 3대 500 달성하기"
                onChange={(e) => {
                  setTodo({ ...todo, goal: e.target.value });
                }}
              />
              <DateInput
                id="input_start_time"
                placeholder="시작 날짜를 정해주세요!"
                onChange={(e) => {
                  setTodo({ ...todo, start: e.target.value });
                }}
              />
              <DateInput
                id="input_end_time"
                placeholder="끝나는 날짜를 정해주세요!"
                onChange={(e) => {
                  setTodo({ ...todo, end: e.target.value });
                }}
              />
            </Modal>

            {/* Todo 삭제 모달창 */}
            <Modal
              modalId="delTodoModal"
              title="TODOLIST 삭제"
              message="정말로 TODOLIST를 삭제하시겠습니까?"
              btnId="delTodoBtn"
              btnClick={(e) => handleDelTodo(e, todoList[selTodoIdx].id)}
              btnImg={ModalAddBtnImg}
            />

            {/* Todo 공유 모달창 */}
            <Modal
              modalId="shareTodoModal"
              title="TODOLIST 공유"
              message="당신의 TODOLIST를 공유하세요!"
              btnId="shareTodoBtn"
              btnClick={handleShareTodo}
              btnImg={ModalAddBtnImg}
            >
              <TextInput
                id="input_title"
                placeholder="제목을 적어주세요"
                onChange={(e) => {
                  setShareTodo({ ...shareTodo, title: e.target.value });
                }}
              />
              <TextInput
                id="input_desc"
                placeholder="설명을 적어주세요"
                onChange={(e) => {
                  setShareTodo({ ...shareTodo, desc: e.target.value });
                }}
              />
              <FileInput
                id="share-image-input"
                name="profile-image"
                placeholder="대표사진을 올려주세요"
                onChange={(e) => {
                  setShareTodo({ ...shareTodo, shareImage: e.target.files[0] });
                }}
                file={shareTodo.shareImage}
                fileType="image/*"
              />
              <TextInput
                id="input_hashtag"
                placeholder="태그를 적어주세요"
                onChange={(e) => {
                  setShareTodo({ ...shareTodo, hashtag: e.target.value });
                }}
              />
            </Modal>

            {/* Task 추가 모달창 */}
            <Modal
              modalId="inputTaskModal"
              title="Task 추가"
              message="당신의 할 일을 추가하세요!"
              btnId="addTaskBtn"
              btnClick={handleAddTask}
              btnImg={ModalAddBtnImg}
            >
              <TextInput
                id="input_task"
                placeholder="ex) 운동하기"
                onChange={(e) => {
                  setTask({ ...task, content: e.target.value });
                }}
              />
              <TimeInput
                id="input_time"
                placeholder="시간을 정해주세요"
                onChange={(e) => {
                  setTask({
                    ...task,
                    datetime: `${dayjs(selDate).format(
                      "YYYY-MM-DD"
                    )}T${e.target.value.replace("-", ":")}:00.000Z`,
                  });
                }}
              />
            </Modal>

            {/* Task 수정 모달창 */}
            <Modal
              modalId="editTaskModal"
              title="Task 수정"
              message="당신의 할 일을 수정하세요!"
              btnId="editTaskBtn"
              btnClick={handleEditTask}
              btnImg={CheckBtnImg}
            >
              <TextInput
                id="input_task_edit"
                placeholder="ex) 운동하기"
                onChange={(e) => {
                  setTask({ ...task, content: e.target.value });
                }}
              />
              <TimeInput
                id="edit_time"
                placeholder="시간을 정해주세요!"
                onChange={(e) => {
                  setTask({
                    ...task,
                    datetime: `${dayjs(selDate).format(
                      "YYYY-MM-DD"
                    )}T${e.target.value.replace("-", ":")}:00.000Z`,
                  });
                }}
              />
            </Modal>
          </div>

          <div
            id="calendar"
            className="bg-white w-6/12 ml-14 rounded-t-2xl rounded-2xl mt-8 mb-8 mr-8"
          >
            <Calendar
              className="border-0"
              onChange={(date) => {
                setSelDate(date);
              }}
              value={selDate}
              formatDay={(locale, date) => date.getDate()} // remove '일' from day
              formatMonth={(locale, date) => date.getMonth() + 1} // remove '월' from month
            />
          </div>
        </div>
      </div>
    </div>
  );
}

LandingPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    armyType: PropTypes.string.isRequired,
    armyRank: PropTypes.string.isRequired,
    enlistment: PropTypes.string.isRequired,
    discharge: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  Logout: PropTypes.func.isRequired,
};

export default LandingPage;
