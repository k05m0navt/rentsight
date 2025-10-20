import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// For PDF and Excel, we'd typically use a library like 'jspdf' or 'exceljs'
// These are client-side or require a more complex server-side setup (e.g., headless browser for PDF)
// For this task, we'll focus on CSV export as a primary example.

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');
  const tagIds = searchParams.getAll('tag_ids'); // Get all tag_ids

  try {
    const rentEntries = await prisma.rentEntry.findMany({
      where: {
        user_id: user.id,
        ...(tagIds.length > 0 && {
          tags: {
            some: { tag_id: { in: tagIds } },
          },
        }),
      },
      include: {
        tags: { select: { tag: { select: { name: true } } } },
      },
    });

    const expenseEntries = await prisma.expenseEntry.findMany({
      where: {
        user_id: user.id,
        ...(tagIds.length > 0 && {
          tags: {
            some: { tag_id: { in: tagIds } },
          },
        }),
      },
      include: {
        tags: { select: { tag: { select: { name: true } } } },
      },
    });

    if (format === 'csv') {
      let csv =
        'Type,Amount,Booked Days,Platform,Start Date,End Date,Category,Description,Date,Tags\n';
      rentEntries.forEach((entry) => {
        const tags = entry.tags.map((t) => t.tag.name).join('; ');
        csv += `Rent,${entry.amount},${entry.booked_days},${entry.platform},${entry.start_date},${entry.end_date},,,${tags}\n`;
      });
      expenseEntries.forEach((entry) => {
        const tags = entry.tags.map((t) => t.tag.name).join('; ');
        csv += `Expense,${entry.amount},,,,,,${entry.description || ''},${entry.date},${tags}\n`;
      });

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="analytics.csv"',
        },
      });
    } else if (format === 'pdf') {
      // Placeholder for PDF generation
      return NextResponse.json({ error: 'PDF export not yet implemented' }, { status: 501 });
    } else if (format === 'excel') {
      // Placeholder for Excel generation
      return NextResponse.json({ error: 'Excel export not yet implemented' }, { status: 501 });
    } else {
      return NextResponse.json({ error: 'Invalid export format' }, { status: 400 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
