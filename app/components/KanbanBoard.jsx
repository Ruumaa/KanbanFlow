'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import ColumnContainer from './ColumnContainer';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import TaskCard from './TaskCard';
import {
  createColumns,
  fetchCreateTask,
  fetchDeleteColumn,
  fetchDeleteTask,
  fetchGetTasks,
  fetchPatchTask,
  fetchUpdateColumn,
  getColumns,
} from '@/lib/fetch';
import { generateId } from '@/lib/generateId';

const KanbanBoard = ({ user }) => {
  const [loading, setLoading] = useState({
    general: false,
    newColumn: false,
    delete: false,
    update: false,
  });
  const [columns, setColumns] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    const getColumnData = async () => {
      try {
        const response = await fetch('/api/column', { cache: 'no-store' });
        const result = await response.json();
        setColumns(result.data);
      } catch (error) {
        console.error('Error when getColumnData', error);
      }
    };

    const getTasksData = async () => {
      try {
        const response = await fetchGetTasks();
        // console.log(response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('Error when getTasks');
      }
    };

    // setMounted(true);
    console.log('Column updated');
    getColumnData();
    getTasksData();
    setUpdateFlag(false);
  }, [updateFlag]);

  // create column
  const createNewColumn = async () => {
    try {
      setLoading((prevLoading) => ({ ...prevLoading, newColumn: true }));
      const columnToAdd = {
        title: `Column ${columns.length + 1}`,
        userId: user.id,
      };
      await createColumns(columnToAdd);
    } catch (error) {
      console.error('Something wrong in createNewColumn', error);
    } finally {
      setUpdateFlag(true);
      setLoading(false);
    }
    // const updatedColumns = [...columns, createdColumn];
    // setColumns(updatedColumns);
  };

  const deleteColumn = async (id) => {
    try {
      setLoading((prevLoading) => ({ ...prevLoading, delete: true }));
      await fetchDeleteColumn(id);
    } catch (error) {
      console.error('Something wrong in deleteColumn', error);
    } finally {
      setUpdateFlag(true);
      setLoading(false);
    }
    // filtering columns with the except id that chosen

    // const filteredColumns = columns.filter((col) => col.id !== id);
    // setColumns(filteredColumns);
    // router.refresh()

    // const newTasks = tasks.filter((t) => t.columnId !== id);
    // setTasks(newTasks);
  };

  // update column
  const updateColumn = async (id, title) => {
    try {
      setLoading((prevLoading) => ({ ...prevLoading, update: true }));
      await fetchUpdateColumn(id, title);
    } catch (error) {
      console.error('Error when updateColumn', error);
    } finally {
      setLoading(false);
      setUpdateFlag(true);
    }

    // const newColumn = columns.map((col) => {
    //   if (col.id !== id) return col;
    //   return { ...col, title };
    // });
    // setColumns(newColumn);
  };

  // handle drag
  const onDragStart = (event) => {
    if (event.active.data.current.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumn === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (!isActiveTask) return;

    // dropping task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === 'Column';
    // dropping task over another column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  // sensors for activing
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, //3px
      },
    })
  );

  // create task
  const createTask = async (columnId) => {
    try {
      const newTask = {
        columnId: columnId,
        content: `Task ${tasks.length + 1}`,
      };
      await fetchCreateTask(newTask);
      setUpdateFlag(true);
    } catch (error) {
      console.error('Something wrong in createNewColumn', error);
    }

    // const newTask = {
    //   id: generateId(),
    //   columnId,
    //   content: `Task ${tasks.length + 1}`,
    // };
    // setTasks([...tasks, newTask]);
  };

  // delete task
  const deleteTask = async (id) => {
    try {
      await fetchDeleteTask(id);
      setUpdateFlag(true);
    } catch (error) {
      console.error('Error when deleteTask', error);
    }

    // const newTask = tasks.filter((task) => task.id !== id);
    // setTasks(newTask);
  };

  // update task
  const updateTask = async (id, content) => {
    try {
      await fetchPatchTask(id, content);
      setUpdateFlag(true);
    } catch (error) {
      console.error('Error when updateTask', error);
    }
    // const updatedTask = tasks.map((task) => {
    //   if (task.id !== id) return task;
    //   return { ...task, content };
    // });
    // setTasks(updatedTask);
  };

  return (
    <>
      <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
        {/* wrapper */}
        <DndContext
          id={user.id}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          sensors={sensors}
        >
          <div className="m-auto flex gap-4">
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
                {columns.map((column) => (
                  <ColumnContainer
                    key={column.id}
                    column={column}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    tasks={tasks.filter((task) => task.columnId === column.id)}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    loading={loading}
                  />
                ))}
              </SortableContext>
            </div>
            <button
              className="btn group bg-stone-800 hover:ring-2 ring-indigo-700  hover:bg-stone-900"
              onClick={() => createNewColumn()}
            >
              <CiCirclePlus size={20} className="group-hover:text-indigo-700" />
              {loading.newColumn ? (
                <div className="flex items-center gap-3">
                  <span className="loading loading-spinner loading-sm text-indigo-700"></span>
                  Creating
                </div>
              ) : (
                'Add Column'
              )}
            </button>
          </div>

          {mounted
            ? createPortal(
                <DragOverlay>
                  {activeColumn && (
                    <ColumnContainer
                      column={activeColumn}
                      deleteColumn={deleteColumn}
                      updateColumn={updateColumn}
                      createTask={createTask}
                      deleteTask={deleteTask}
                      updateTask={updateTask}
                      loading={loading}
                      handleOnChange={handleOnChange}
                      tasks={tasks.filter(
                        (task) => task.columnId === activeColumn.id
                      )}
                    />
                  )}
                  {activeTask && (
                    <TaskCard
                      task={activeTask}
                      deleteTask={deleteTask}
                      updateTask={updateTask}
                    />
                  )}
                </DragOverlay>,
                document.body
              )
            : ''}
        </DndContext>
      </div>
    </>
  );
};

export default KanbanBoard;
