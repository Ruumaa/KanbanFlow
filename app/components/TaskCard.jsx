'use client';

import { useSortable } from '@dnd-kit/sortable';
import { useState } from 'react';
import { FaRegTrashCan } from 'react-icons/fa6';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, deleteTask, updateTask, loading }) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [savedValue, setSavedValue] = useState(task.content);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    // updateTask(task.id, savedValue);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-zinc-800/50 rounded-xl p-2.5 h-24 min-h-24 items-center flex text-left opacity-30 cursor-grab relative border-2 border-indigo-700"
      />
    );
  }

  // if (editMode) {
  //   updateTask(task.id, savedValue);
  //   return (
  //     <div
  //       ref={setNodeRef}
  //       style={style}
  //       {...attributes}
  //       {...listeners}
  //       className="bg-zinc-800/50 rounded-xl p-2.5 h-24 min-h-24 items-center flex text-left hover:ring-2 hover:ring-inset hover:ring-indigo-700 cursor-grab relative"
  //     >
  //       <textarea
  //         className="w-full h-[90%] resize-none bg-transparent rounded text-white border-none focus:outline-none"
  //         value={savedValue}
  //         autoFocus
  //         placeholder="Task content here"
  //         onBlur={toggleEditMode}
  //         onKeyDown={(e) => {
  //           if (e.key === 'Enter' && e.shiftKey) toggleEditMode();
  //         }}
  //         onChange={(e) => setSavedValue(e.target.value)}
  //       ></textarea>
  //     </div>
  //   );
  // }
  const handleBlur = () => {
    updateTask(task.id, savedValue);
    setEditMode(false);
    setMouseIsOver(false);
  };
  // console.log(editMode);
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // onClick={() => setEditMode(true)}
      className="bg-zinc-800/50 rounded-xl p-2.5 h-24 min-h-24 items-center flex text-left hover:ring-2 hover:ring-inset hover:ring-indigo-700 cursor-grab relative"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      {/* {loading?.updateTask ? (
        <textarea
  //         className="w-full h-[90%] resize-none bg-transparent rounded text-white border-none focus:outline-none"
  //         value={savedValue}
  //         autoFocus
  //         placeholder="Task content here"
  //         onBlur={toggleEditMode}
  //         onKeyDown={(e) => {
  //           if (e.key === 'Enter' && e.shiftKey) toggleEditMode();
  //         }}
  //         onChange={(e) => setSavedValue(e.target.value)}
  //       ></textarea>
      ) : ( */}

      {editMode ? (
        // <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <textarea
          className="w-full h-[90%] resize-none bg-transparent rounded text-white border-none focus:outline-none"
          value={savedValue}
          autoFocus
          placeholder="Task content here"
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey) handleBlur();
          }}
          onChange={(e) => setSavedValue(e.target.value)}
        ></textarea>
      ) : (
        // </div>
        <textarea
          defaultValue={savedValue}
          onClick={() => setEditMode(true)}
          // onBlur={toggleEditMode}
          className="w-full h-[90%] resize-none bg-transparent rounded text-white border-none focus:outline-none"
        ></textarea>
      )}

      {mouseIsOver && (
        <button
          className="btn btn-ghost btn-xs absolute hover:text-red-700 right-4"
          title="Delete Content"
          onClick={() => deleteTask(task.id)}
          // disabled={loading.deleteTask}
        >
          {/* {loading.deleteTask ? ( */}
          {/* <div className="flex items-center gap-3">
              <span className="loading loading-spinner loading-sm text-indigo-700"></span>
              Deleting
            </div>
          ) : ( */}
          <FaRegTrashCan className="text-red-600" size={15} />
          {/* )} */}
        </button>
      )}
    </div>
  );
};

export default TaskCard;
