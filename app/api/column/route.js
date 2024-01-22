import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const response = await prisma.column.findMany({
      orderBy: {
        columnIndex: 'asc',
      },
      // include: {
      //   Task: true,
      // },
    });

    return NextResponse.json(
      { message: 'GET column success', data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed when GET column', error: error },
      { status: 500 }
    );
  }
};
