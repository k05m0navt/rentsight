import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTags(userId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.tag.findMany({
    where: { user_id: userId },
  });
}

export async function createTag(userId: string, name: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.tag.create({
    data: {
      user_id: userId,
      name,
    },
  });
}

export async function updateTag(userId: string, tagId: string, name: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error('Unauthorized');
  }

  const existingTag = await prisma.tag.findUnique({
    where: { id: tagId, user_id: userId },
  });

  if (!existingTag) {
    throw new Error('Tag not found');
  }

  return prisma.tag.update({
    where: { id: tagId },
    data: { name },
  });
}

export async function deleteTag(userId: string, tagId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error('Unauthorized');
  }

  const existingTag = await prisma.tag.findUnique({
    where: { id: tagId, user_id: userId },
  });

  if (!existingTag) {
    throw new Error('Tag not found');
  }

  return prisma.tag.delete({
    where: { id: tagId },
  });
}

