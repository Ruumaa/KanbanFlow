import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const response = await prisma.task.findMany();
    return NextResponse.json(
      { message: 'GET task success', data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'failed GET task', error: error },
      { status: 500 }
    );
  }
};
