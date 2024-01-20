import { generateId } from '@/lib/generateId';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    const body = await req.json();
    const response = await prisma.column.create({
      data: {
        id: generateId(),
        title: body.title,
        userId: body.userId,
      },
    });
    return NextResponse.json(
      { message: 'Created new column', data: response },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed when POST column', error: error },
      { status: 500 }
    );
  }
};
