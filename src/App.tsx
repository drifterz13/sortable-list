import React from "react";

interface ITask {
  _id: string;
  title: string;
}

interface IList {
  _id: string;
  title: string;
  tasks: ITask[];
}

const data: Record<IList["_id"], IList> = {
  list1: {
    _id: "list1",
    title: "List 1",
    tasks: [
      {
        _id: "task1",
        title: "Task 1",
      },
      {
        _id: "task2",
        title: "Task 2",
      },
    ],
  },
  list2: {
    _id: "list2",
    title: "List 2",
    tasks: [
      {
        _id: "task3",
        title: "Task 3",
      },
      {
        _id: "task4",
        title: "Task 4",
      },
      {
        _id: "task5",
        title: "Task 5",
      },
      {
        _id: "task6",
        title: "Task 6",
      },
    ],
  },
};

function App() {
  return <ListContainer />;
}

function ListContainer() {
  return (
    <div className="h-screen bg-slate-200 p-5 flex flex-row gap-10">
      {Object.values(data).map((list) => (
        <List key={list._id} list={list} />
      ))}
    </div>
  );
}

function List(props: { list: IList }) {
  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();

    const dragTaskId = e.dataTransfer.getData("text");
    const dragTaskEl = document.querySelector(
      `[data-task-id="${dragTaskId}"]`
    ) as HTMLElement;

    e.currentTarget.appendChild(dragTaskEl);
  };

  return (
    <section
      data-list-id={props.list._id}
      className="drop-src w-[300px] flex flex-col gap-2 bg-transparent h-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="px-4 py-2 rounded-md box-border bg-gray-900 text-gray-50 items-center h-10">
        {props.list.title}
      </div>
      <div className="flex flex-col gap-2">
        {props.list.tasks.map((task, idx) => (
          <TaskCard key={task._id} task={task} position={idx} />
        ))}
      </div>
    </section>
  );
}

function TaskCard(props: { task: ITask; position: number }) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = "0.5";
    e.currentTarget.style.background = "#a7f3d0";
    e.currentTarget.setAttribute("data-dragging", "true");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "text/plain",
      e.currentTarget.getAttribute("data-task-id")!
    );
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.background = "white";
    e.currentTarget.removeAttribute("data-dragging");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!!e.currentTarget.getAttribute("dragging")) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const middle = rect.y + rect.height / 2;

    const dragTaskId = e.dataTransfer.getData("text");
    const dragTaskEl = document.querySelector(
      `[data-task-id="${dragTaskId}"]`
    ) as HTMLElement;
    if (e.clientY <= middle) {
      e.currentTarget.insertAdjacentElement("beforebegin", dragTaskEl);
    } else {
      e.currentTarget.insertAdjacentElement("afterend", dragTaskEl);
    }
  };

  return (
    <div
      draggable
      data-task-pos={props.position}
      data-task-id={props.task._id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      className="h-auto px-4 py-2 rounded-md box-border bg-white text-gray-900 cursor-grab shadow-md"
    >
      {props.task.title}
    </div>
  );
}

export default App;

function isOverlapping(el1: HTMLElement, el2: HTMLElement) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  const overlap =
    (rect1.right > rect2.left || rect1.left < rect2.right) &&
    rect1.top < rect2.bottom;

  return overlap;
}
