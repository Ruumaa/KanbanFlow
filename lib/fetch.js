import { BASE_URL } from './base_url';

export const getColumns = async () => {
  try {
    const columns = await fetch(`${BASE_URL}/api/column`, {
      cache: 'no-store',
    });
    return await columns.json();
  } catch (error) {
    return console.error('Something Wrong when fetching getColumn', error);
  }
};

export const createColumns = async (values) => {
  try {
    const columns = await getColumns();
    const column = await fetch(`${BASE_URL}/api/column/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: values.title,
        userId: values.userId,
        columnIndex: columns.data.length - 1,
      }),
    });
    return await column.json();
  } catch (error) {
    return console.error('Something Wrong when fetching createColumn', error);
  }
};

export const fetchUpdateColumn = async ({ id, title, columnIndex }) => {
  try {
    const body = { id, title };
    if (columnIndex !== undefined) {
      body.columnIndex = columnIndex;
    }
    const column = await fetch(`${BASE_URL}/api/column/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await column.json();
  } catch (error) {
    return console.error('Something Wrong when fetching updateColumn', error);
  }
};

export const fetchDeleteColumn = async (id) => {
  try {
    await fetch(`${BASE_URL}/api/column/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    return console.error('Something Wrong when fetching deleteColumn', error);
  }
};

export const fetchGetTasks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/task`);

    return await response.json();
  } catch (error) {
    return console.error('Something Wrong when fetching GetTasks', error);
  }
};

export const fetchCreateTask = async (values) => {
  try {
    console.log(values);
    const newTask = await fetch(`${BASE_URL}/api/task/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: values.content,
        columnId: values.columnId,
      }),
    });

    return await newTask.json();
  } catch (error) {
    return console.error('Something Wrong when fetching CreateTask', error);
  }
};

export const fetchDeleteTask = async (id) => {
  try {
    await fetch(`${BASE_URL}/api/task/${id}`, { method: 'DELETE' });
  } catch (error) {
    return console.error('Something Wrong when fetching DeleteTasks', error);
  }
};

export const fetchPatchTask = async (id, content) => {
  try {
    const updatedTask = await fetch(`${BASE_URL}/api/task/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    return await updatedTask.json();
  } catch (error) {
    return console.error('Something Wrong when fetching updateColumn', error);
  }
};
