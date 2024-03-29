'use client';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CiCirclePlus } from 'react-icons/ci';
import { FaRegTrashCan } from 'react-icons/fa6';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import TaskCard from './TaskCard';

const ColumnContainer = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
  loading,
}) => {
  // console.log(column, '!!!!!');
  const [editMode, setEditMode] = useState(false);
  const [savedValue, setSavedValue] = useState(column.title);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column: column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  //   dragging state
  if (isDragging) {
    return (
      <div
        className="w-80 h-96 bg-slate-700 rounded-md flex flex-col opacity-40 border-indigo-700 border-2"
        ref={setNodeRef}
        style={style}
      ></div>
    );
  }

  return (
    <div
      className="w-80 h-96 bg-slate-700 rounded-md flex flex-col"
      ref={setNodeRef}
      style={style}
    >
      {/* column title */}
      <div
        {...attributes}
        {...listeners}
        className="text-md cursor-grab rounded-md bg-stone-800 h-14 p-3 font-bold border-slate-700 border-4 flex justify-between items-center z-10"
      >
        <div className="flex gap-3">
          <div className="flex justify-center items-center bg-slate-700 px-2 py-1 text-sm rounded-full">
            {tasks.length}
          </div>
          {editMode ? (
            <>
              {loading.updateColumn ? (
                <div className="flex items-center gap-3">
                  <span className="loading loading-spinner loading-sm text-indigo-700"></span>
                  Updating...
                </div>
              ) : (
                <input
                  value={savedValue}
                  onChange={(e) => setSavedValue(e.target.value)}
                  autoFocus
                  onBlur={() => {
                    updateColumn(column.id, savedValue);
                    setEditMode(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    updateColumn(column.id, savedValue);
                    setEditMode(false);
                  }}
                  className="input input-sm w-2/3 border-indigo-700 focus:border-indigo-700 focus:border-2"
                />
              )}
            </>
          ) : (
            <div onClick={() => setEditMode(true)} className="cursor-text">
              {column.title}
            </div>
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          disabled={loading.delete}
          className="btn btn-ghost btn-sm  text-red-600 cursor-pointer hover:text-red-700 z-30
           "
          title="Delete Column"
        >
          {loading.delete ? (
            <div className="flex items-center gap-3">
              <span className="loading loading-spinner loading-sm text-indigo-700"></span>
              Deleting
            </div>
          ) : (
            <FaRegTrashCan size={18} />
          )}
        </button>
      </div>
      {/* column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        {tasks?.map((task) => (
          <SortableContext items={tasksIds} key={task.id}>
            <TaskCard
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
              loading={loading}
            />
          </SortableContext>
        ))}
      </div>
      {/* column footer */}
      <button
        onClick={() => createTask(column.id)}
        disabled={loading.deleteTask}
        className="btn btn-ghost btn-sm group flex gap-2 items-center hover:ring-2 ring-indigo-700  hover:bg-stone-900"
      >
        {loading.newTask ? (
          <div className="flex items-center gap-3">
            <span className="loading loading-spinner loading-sm text-indigo-700"></span>
            Adding Task
          </div>
        ) : (
          <>
            <CiCirclePlus size={20} className="group-hover:text-indigo-700" />
            Add Task
          </>
        )}
      </button>
    </div>
  );
};

export default ColumnContainer;
