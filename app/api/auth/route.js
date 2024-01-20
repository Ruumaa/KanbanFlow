import prisma from '@/lib/prisma';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    const { username, password } = await req.json();
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Username already exist' },
        { status: 409 }
      );
    }

    const hashed = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashed,
      },
      select: {
        id: true,
        username: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Register success',
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'POST user failed', error: error },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const response = await prisma.user.findMany({
      include: {
        Column: {
          include: {
            Task: true,
          },
        },
      },
    });

    const users = response.map((user) => {
      const { password, ...userData } = user;
      return userData;
    });
    return NextResponse.json(
      { message: 'GET user success', data: users },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'GET user failed', error: error },
      { status: 500 }
    );
  }
};
