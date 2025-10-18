import { prisma } from '@/lib/prisma';

export interface TagUsageCount {
  properties: number;
  rentEntries: number;
  expenseEntries: number;
  total: number;
}

export interface DeleteTagResult {
  status: 'success' | 'requires_confirmation';
  usage?: TagUsageCount;
  message?: string;
  deletedAssociations?: TagUsageCount;
}

export async function getTags(userId: string) {
  return prisma.tag.findMany({
    where: { user_id: userId },
  });
}

export async function createTag(userId: string, name: string) {
  return prisma.tag.create({
    data: {
      user_id: userId,
      name,
    },
  });
}

export async function updateTag(userId: string, tagId: string, name: string) {
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

/**
 * Get tag with usage counts (T053)
 */
export async function getTagWithUsage(
  userId: string,
  tagId: string,
): Promise<TagUsageCount | null> {
  const tag = await prisma.tag.findUnique({
    where: {
      id: tagId,
      user_id: userId,
    },
    include: {
      rentEntries: true,
      expenseEntries: true,
    },
  });

  if (!tag) {
    return null;
  }

  const usage = {
    properties: 0, // Tags are not directly associated with properties in current schema
    rentEntries: tag.rentEntries.length,
    expenseEntries: tag.expenseEntries.length,
    total: tag.rentEntries.length + tag.expenseEntries.length,
  };

  return usage;
}

/**
 * Delete tag with cascade deletion (T054)
 * Removes tag from all associated entries before deletion
 */
export async function deleteTagWithCascade(
  userId: string,
  tagId: string,
  confirmed: boolean = false,
): Promise<DeleteTagResult> {
  // Verify tag exists and belongs to user
  const tag = await prisma.tag.findUnique({
    where: {
      id: tagId,
      user_id: userId,
    },
    include: {
      rentEntries: true,
      expenseEntries: true,
    },
  });

  if (!tag) {
    throw new Error('Tag not found');
  }

  // Calculate usage
  const usage: TagUsageCount = {
    properties: 0,
    rentEntries: tag.rentEntries.length,
    expenseEntries: tag.expenseEntries.length,
    total: tag.rentEntries.length + tag.expenseEntries.length,
  };

  // If tag is in use and not confirmed, require confirmation
  if (usage.total > 0 && !confirmed) {
    return {
      status: 'requires_confirmation',
      usage,
      message: `This tag is used by ${usage.rentEntries} rent entries and ${usage.expenseEntries} expense entries.`,
    };
  }

  // Perform cascade deletion in a transaction
  await prisma.$transaction(async (tx) => {
    // Remove tag from all rent entries
    await tx.rentEntryTag.deleteMany({
      where: {
        tag_id: tagId,
      },
    });

    // Remove tag from all expense entries
    await tx.expenseEntryTag.deleteMany({
      where: {
        tag_id: tagId,
      },
    });

    // Delete the tag itself
    await tx.tag.delete({
      where: {
        id: tagId,
      },
    });
  });

  return {
    status: 'success',
    message: `Tag deleted successfully along with ${usage.total} associations`,
    deletedAssociations: usage,
  };
}

/**
 * Legacy delete function (keep for backward compatibility)
 */
export async function deleteTag(userId: string, tagId: string) {
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
