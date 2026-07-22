'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    CreditCard, 
    ArrowLeft, 
    DollarSign, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    User,
    Calendar,
    BookOpen
} from 'lucide-react';

import { useGetClassById } from '@/hooks/useGetClassById';
import { useGetClassInvoices } from '@/hooks/useGetClassInvoices';
import { useUpdateInvoiceStatus } from '@/hooks/useUpdateInvoiceStatus';

import LoadingState from '@/components/QueryState/LoadingState';
import ErrorState from '@/components/QueryState/ErrorState';
import HeaderAvatar from '@/components/HeaderAvatar/HeaderAvatar';
import SearchBar from '@/components/SearchBar/SearchBar';

type FilterType = 'all' | 'paid' | 'unpaid' | 'overdue';

export default function ClassInvoices() {
    const { hub_id, class_id } = useParams();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const { data: classData, isLoading: isLoadingClass } = useGetClassById(class_id as string);
    const { data: invoices = [], isLoading: isLoadingInvoices, isError, error } = useGetClassInvoices(class_id as string);
    const updateMutation = useUpdateInvoiceStatus();

    const handleToggleStatus = (invoiceId: number, currentPaidStatus: number) => {
        updateMutation.mutate({
            classId: class_id as string,
            invoiceId,
            isPaid: currentPaidStatus === 0
        });
    };

    // Calculate billing summary stats
    const stats = useMemo(() => {
        let totalBilled = 0;
        let totalCollected = 0;
        let totalOutstanding = 0;
        let overdueCount = 0;
        const now = new Date();

        invoices.forEach(inv => {
            const amount = Number(inv.amount) || 0;
            totalBilled += amount;
            if (inv.is_paid === 1) {
                totalCollected += amount;
            } else {
                totalOutstanding += amount;
                if (new Date(inv.due_date) < now) {
                    overdueCount++;
                }
            }
        });

        const rate = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;

        return {
            totalBilled: totalBilled.toLocaleString('en-US'),
            totalCollected: totalCollected.toLocaleString('en-US'),
            totalOutstanding: totalOutstanding.toLocaleString('en-US'),
            overdueCount,
            paymentRate: rate.toFixed(1)
        };
    }, [invoices]);

    // Filtering logic
    const filteredInvoices = useMemo(() => {
        const now = new Date();
        return invoices.filter(inv => {
            // Search filter
            const matchesSearch = inv.student_name.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;

            // Status filter
            if (activeFilter === 'paid') return inv.is_paid === 1;
            if (activeFilter === 'unpaid') return inv.is_paid === 0;
            if (activeFilter === 'overdue') return inv.is_paid === 0 && new Date(inv.due_date) < now;

            return true;
        });
    }, [invoices, searchTerm, activeFilter]);

    if (isLoadingClass || isLoadingInvoices) {
        return <LoadingState fullScreen message="Loading tuition invoices..." />;
    }

    if (isError) {
        return (
            <ErrorState
                fullScreen
                title="Error Loading Invoices"
                message={error?.message || "Failed to load tuition records. Please try again."}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/50 font-sans text-slate-900">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 shrink-0">
                <div className="flex items-center gap-4 mb-4">
                    <button 
                        onClick={() => router.push(`/dashboard/hub/${hub_id}/classes/${class_id}`)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            Class: {classData?.name || 'Loading...'}
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <CreditCard className="w-6 h-6 text-indigo-600" />
                            Tuition & Billing Invoices
                        </h1>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {/* Billed */}
                    <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-medium">Total Billed</p>
                            <p className="text-lg font-bold text-slate-800">${stats.totalBilled}</p>
                        </div>
                    </div>

                    {/* Collected */}
                    <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-medium">Collected</p>
                            <p className="text-lg font-bold text-slate-800">${stats.totalCollected}</p>
                        </div>
                    </div>

                    {/* Outstanding */}
                    <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-medium">Outstanding</p>
                            <p className="text-lg font-bold text-slate-800">${stats.totalOutstanding}</p>
                        </div>
                    </div>

                    {/* Payment Rate */}
                    <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-medium">Payment Rate</p>
                            <p className="text-lg font-bold text-slate-800">{stats.paymentRate}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 flex-1 overflow-hidden flex flex-col">
                {/* Search and Filters bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
                    <SearchBar
                        search_width_style="medium"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />

                    {/* Filter Tabs */}
                    <div className="flex border border-slate-200 bg-slate-100/50 p-1 rounded-lg">
                        {(['all', 'paid', 'unpaid', 'overdue'] as FilterType[]).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                                    activeFilter === filter 
                                        ? 'bg-white text-indigo-600 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                    {filteredInvoices.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
                            <CreditCard className="w-12 h-12 mb-4 text-slate-200" />
                            <p className="text-lg font-medium text-slate-600">No Invoices Found</p>
                            <p className="text-sm">Try modifying your search query or filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-auto flex-1">
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 z-20 bg-slate-50 shadow-sm border-b border-slate-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Student Info
                                        </th>
                                        <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Billing Cycle
                                        </th>
                                        <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Due Date
                                        </th>
                                        <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Payment Status
                                        </th>
                                        <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Toggle Paid
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredInvoices.map((invoice) => {
                                        const isOverdue = invoice.is_paid === 0 && new Date(invoice.due_date) < new Date();
                                        
                                        return (
                                            <tr key={invoice.invoice_id} className="hover:bg-slate-50/50 transition-colors">
                                                {/* Student Profile */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <HeaderAvatar name={invoice.student_name} />
                                                        <div>
                                                            <div className="text-sm font-semibold text-slate-900">
                                                                {invoice.student_name}
                                                            </div>
                                                            <div className="text-xs text-slate-400">
                                                                ID: {invoice.student_id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Billing Cycle / Version */}
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                        Cycle {invoice.version}
                                                    </span>
                                                </td>

                                                {/* Amount */}
                                                <td className="px-6 py-4 text-right font-mono font-semibold text-slate-700">
                                                    ${(Number(invoice.amount) || 0).toLocaleString('en-US')}
                                                </td>

                                                {/* Due Date */}
                                                <td className="px-6 py-4 text-center text-sm text-slate-500">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        {invoice.due_date}
                                                    </div>
                                                </td>

                                                {/* Status Badge */}
                                                <td className="px-6 py-4 text-center">
                                                    {invoice.is_paid === 1 ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            Paid
                                                        </span>
                                                    ) : isOverdue ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                                                            Overdue
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                            Unpaid
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Toggle Switch */}
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleToggleStatus(invoice.invoice_id, invoice.is_paid)}
                                                        disabled={updateMutation.isPending}
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                            invoice.is_paid === 1 ? 'bg-emerald-500' : 'bg-slate-200 hover:bg-slate-300'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                                invoice.is_paid === 1 ? 'translate-x-5' : 'translate-x-0'
                                                            }`}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
