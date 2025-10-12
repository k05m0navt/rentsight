import { prisma } from '@/lib/prisma';
import { PropertyCreateInput, PropertyUpdateInput, PropertyWithStats } from '@/types/property';

export class PropertyService {
  /**
   * List properties for a user with pagination
   */
  static async listProperties(
    userId: string,
    options: {
      cursor?: string;
      limit?: number;
      search?: string;
    } = {},
  ) {
    const { cursor, limit = 50, search } = options;

    const where = {
      user_id: userId,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    };

    const properties = await prisma.property.findMany({
      where,
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      include: {
        _count: {
          select: {
            rentEntries: true,
            expenseEntries: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const hasMore = properties.length > limit;
    const items = hasMore ? properties.slice(0, -1) : properties;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return { items, nextCursor };
  }

  /**
   * Create a new property
   */
  static async createProperty(userId: string, data: PropertyCreateInput) {
    return prisma.property.create({
      data: {
        user_id: userId,
        name: data.name,
        address: data.address,
        property_type: data.property_type,
        start_date: data.start_date ? new Date(data.start_date) : null,
        notes: data.notes,
      },
      include: {
        _count: {
          select: {
            rentEntries: true,
            expenseEntries: true,
          },
        },
      },
    });
  }

  /**
   * Get a single property by ID
   */
  static async getProperty(propertyId: string, userId: string) {
    return prisma.property.findFirst({
      where: {
        id: propertyId,
        user_id: userId,
      },
      include: {
        _count: {
          select: {
            rentEntries: true,
            expenseEntries: true,
          },
        },
      },
    });
  }

  /**
   * Update a property
   */
  static async updateProperty(propertyId: string, userId: string, data: PropertyUpdateInput) {
    // Verify ownership
    const existing = await this.getProperty(propertyId, userId);
    if (!existing) {
      throw new Error('Property not found or unauthorized');
    }

    return prisma.property.update({
      where: { id: propertyId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.property_type !== undefined && { property_type: data.property_type }),
        ...(data.start_date !== undefined && {
          start_date: data.start_date ? new Date(data.start_date) : null,
        }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        _count: {
          select: {
            rentEntries: true,
            expenseEntries: true,
          },
        },
      },
    });
  }

  /**
   * Delete a property
   */
  static async deleteProperty(propertyId: string, userId: string) {
    // Verify ownership
    const existing = await this.getProperty(propertyId, userId);
    if (!existing) {
      throw new Error('Property not found or unauthorized');
    }

    return prisma.property.delete({
      where: { id: propertyId },
    });
  }

  /**
   * Get property statistics
   */
  static async getPropertyStats(propertyId: string, userId: string) {
    const property = await this.getProperty(propertyId, userId);
    if (!property) {
      throw new Error('Property not found');
    }

    const rentIncome = await prisma.rentEntry.aggregate({
      where: { property_id: propertyId },
      _sum: { amount: true },
      _count: true,
    });

    const expenses = await prisma.expenseEntry.aggregate({
      where: { property_id: propertyId },
      _sum: { amount: true },
      _count: true,
    });

    return {
      rentEntriesCount: rentIncome._count,
      expenseEntriesCount: expenses._count,
      totalIncome: rentIncome._sum.amount || 0,
      totalExpenses: expenses._sum.amount || 0,
      netIncome: (rentIncome._sum.amount || 0) - (expenses._sum.amount || 0),
    };
  }
}

