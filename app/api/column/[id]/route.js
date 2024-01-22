import { NextResponse } from 'next/server';

export const PATCH = async (req, context) => {
  try {
    const { params } = context;
    const { title, columnIndex } = await req.json();
    const response = await prisma.column.update({
      where: {
        id: +params.id,
      },
      data: {
        title,
        columnIndex,
      },
    });

    return NextResponse.json(
      {
        message: 'Column updated',
        data: response,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'PATCH column failed', error: error },
      { status: 500 }
    );
  }
};

export const DELETE = async (req, context) => {
  try {
    const { params } = context;
    const existingColumnId = await prisma.column.findUnique({
      where: { id: +params.id },
    });

    if (!existingColumnId) {
      return NextResponse.json(
        { message: 'Column ID not found!' },
        { status: 404 }
      );
    }
    await prisma.column.delete({
      where: {
        id: +params.id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'DELETE column failed', error: error },
      { status: 500 }
    );
  }
};
