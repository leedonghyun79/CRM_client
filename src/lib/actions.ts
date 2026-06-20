'use server';

import prisma from './prisma';
import { revalidatePath } from 'next/cache';

/**
 * 고객 관련 액션
 */

// 고객 생성
export async function createCustomer(data: { name: string; email?: string; company?: string; phone?: string }) {
  try {
    const customer = await prisma.customer.create({
      data: {
        ...data,
        status: 'pending', // 대기 상태가 기본값
      },
    });
    revalidatePath('/customers');
    return { success: true, data: customer };
  } catch (error: any) {
    console.error('Failed to create customer:', error);
    return { success: false, error: '고객 등록에 실패했습니다.' };
  }
}

// 고객 수정
export async function updateCustomer(id: string, data: { name: string; email?: string; company?: string; phone?: string; status?: string }) {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data,
    });
    revalidatePath('/customers');
    return { success: true, data: customer };
  } catch (error) {
    console.error('Failed to update customer:', error);
    return { success: false, error: '고객 정보 수정에 실패했습니다.' };
  }
}

// 고객 삭제
export async function deleteCustomer(id: string) {
  try {
    await prisma.customer.delete({
      where: { id },
    });
    revalidatePath('/customers');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete customer:', error);
    return { success: false, error: '고객 삭제에 실패했습니다.' };
  }
}

// 고객 목록 가져오기
export async function getCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return customers;
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return [];
  }
}

/**
 * 문의 관련 액션
 */

// 문의 목록 가져오기
export async function getInquiries() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return inquiries;
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    return [];
  }
}

/**
 * 통계 관련 액션
 */

export async function getDashboardStats() {
  try {
    const [customerCount, inquiryCount, totalRevenue] = await Promise.all([
      prisma.customer.count(),
      prisma.inquiry.count({ where: { status: 'pending' } }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: 'completed' }
      })
    ]);

    const recentStat = await prisma.dailyStat.findFirst({
      orderBy: { date: 'desc' }
    });

    return {
      totalCustomers: customerCount,
      pendingInquiries: inquiryCount,
      totalRevenue: totalRevenue._sum.amount?.toString() || '0',
      todayVisitors: recentStat?.visitors || 0
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return null;
  }
}

export async function getCustomerStats() {
  const [total, pending, processing, closed] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.count({ where: { status: 'pending' } }),
    prisma.customer.count({ where: { status: 'processing' } }),
    prisma.customer.count({ where: { status: 'closed' } }),
  ]);
  return { total, pending, processing, closed };
}

export async function getInquiryStats() {
  const [total, pending, answered] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: 'pending' } }),
    prisma.inquiry.count({ where: { status: 'answered' } }),
  ]);
  return { total, pending, answered };
}

export async function getSalesStats() {
  const [revenue, completedCount, pendingCount] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { status: 'completed' }
    }),
    prisma.transaction.count({ where: { status: 'completed' } }),
    prisma.transaction.count({ where: { status: 'pending' } }),
  ]);

  const monthlySales = await prisma.transaction.findMany({
    where: { status: 'completed' },
    take: 6,
    orderBy: { date: 'asc' }
  });

  return {
    totalRevenue: revenue._sum.amount?.toString() || '0',
    completedCount,
    pendingCount,
    monthlySales: monthlySales.map(s => ({
      name: new Date(s.date).getMonth() + 1 + '월',
      amount: Number(s.amount)
    }))
  };
}

// 부가 유틸리티
export async function getTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      include: { customer: true },
    });
    return transactions.map(tx => ({
      ...tx,
      amount: tx.amount.toString(),
    }));
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return [];
  }
}
