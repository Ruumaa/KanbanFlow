import { generateId } from '@/lib/generateId';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    const body = await req.json();
    console.log(body);
    const response = await prisma.task.create({
      data: {
        id: generateId(),
        content: body.content,
        columnId: body.columnId,
      },
    });
    return NextResponse.json(
      { message: 'created new task', data: response },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'failed POST task', error: error },
      { status: 500 }
    );
  }
};
