import { NextResponse } from 'next/server';

export const PATCH = async (req, context) => {
  try {
    const { params } = await context;
    const { content, columnId } = await req.json();
    const response = await prisma.task.update({
      where: {
        id: +params.id,
      },
      data: {
        content,
        columnId,
      },
    });

    return NextResponse.json(
      {
        message: 'Task updated',
        data: response,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'PATCH task failed', error: error },
      { status: 500 }
    );
  }
};

export const DELETE = async (req, context) => {
  try {
    const { params } = await context;
    const existingTask = await prisma.task.findUnique({
      where: {
        id: +params.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { message: 'Task ID not found!' },
        { status: 409 }
      );
    }

    await prisma.task.delete({
      where: {
        id: +params.id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'DELETE task failed', error: error },
      { status: 500 }
    );
  }
};
