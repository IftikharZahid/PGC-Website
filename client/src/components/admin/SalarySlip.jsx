import React, { useRef } from 'react';
import { X, Printer, Scissors } from 'lucide-react';
import pgcLogo from '../../assets/pgc-logo.png';

const SingleSlip = ({ salary, copyTitle }) => {
    const slipId = `SAL-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const paymentDate = new Date().toLocaleDateString();
    // Default to current month/year if not explicit
    const monthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="border-[1.5px] border-gray-800 p-3 relative bg-white flex flex-col h-full w-full">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
                <img src={pgcLogo} alt="Watermark" className="w-48 opacity-50 grayscale" />
            </div>

            {/* Header */}
            <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2 mb-2">
                <img src={pgcLogo} alt="PGC Logo" className="w-8 h-8 object-contain" />
                <div className="flex-1 text-center">
                    <h1 className="text-sm font-bold text-gray-900 uppercase leading-none">Punjab Group of Colleges</h1>
                    <p className="text-[7px] text-gray-600 font-medium tracking-wide mt-0.5">Excellence in Education Since 1985</p>
                    <p className="text-[6px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">Haronabad Road 2 km, Fort Abbas • Tel: 063-9240101</p>
                </div>
                <div className="w-6 text-[7px] font-bold text-right -rotate-90 text-gray-400 whitespace-nowrap origin-bottom-right translate-y-2">{copyTitle}</div>
            </div>

            {/* Slip Info */}
            <div className="flex justify-between items-end mb-2 bg-gray-50 p-1.5 border border-gray-100 rounded">
                <div>
                    <div className="text-[7px] font-bold text-gray-500 uppercase tracking-wide">Slip ID</div>
                    <div className="text-[9px] font-mono font-bold text-gray-900">{slipId}</div>
                </div>
                <div className="text-center">
                    <div className="text-[7px] font-bold text-gray-500 uppercase tracking-wide">Month</div>
                    <div className="text-[9px] font-bold text-gray-900 uppercase">{monthYear}</div>
                </div>
                <div className="text-right">
                    <div className="text-[7px] font-bold text-gray-500 uppercase tracking-wide">Date</div>
                    <div className="text-[9px] font-mono font-bold text-gray-900">{paymentDate}</div>
                </div>
            </div>

            {/* Staff Details Grid */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 px-1">
                <div className="border-b border-gray-100 pb-0.5">
                    <span className="block text-[7px] font-bold text-gray-400 uppercase">Staff Name</span>
                    <div className="font-bold text-[10px] text-gray-900 truncate">{salary.name}</div>
                </div>
                <div className="border-b border-gray-100 pb-0.5">
                    <span className="block text-[7px] font-bold text-gray-400 uppercase">Department</span>
                    <div className="text-[9px] text-gray-900 truncate">{salary.department || 'General Staff'}</div>
                </div>
                <div className="border-b border-gray-100 pb-0.5">
                    <span className="block text-[7px] font-bold text-gray-400 uppercase">Designation</span>
                    <div className="text-[9px] text-gray-900 truncate">{salary.designation || 'Employee'}</div>
                </div>
                <div className="border-b border-gray-100 pb-0.5">
                    <span className="block text-[7px] font-bold text-gray-400 uppercase">Status</span>
                    <div className="text-[9px] font-bold text-green-700">PAID</div>
                </div>
            </div>

            {/* Salary Table */}
            <div className="mb-2 flex-1">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-800">
                            <th className="py-1 text-left font-bold text-gray-800 uppercase text-[8px] w-2/3">Description</th>
                            <th className="py-1 text-right font-bold text-gray-800 uppercase text-[8px]">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100">
                            <td className="py-1 text-gray-800 text-[9px]">
                                Basic Salary
                                <div className="text-[7px] text-gray-500 italic">Disbursement</div>
                            </td>
                            <td className="py-1 text-right font-mono font-medium text-[9px]">
                                {(salary.salary || 0).toLocaleString()}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-50">
                            <td className="py-1 text-right font-bold text-gray-900 uppercase text-[8px] pr-2">Net Pay</td>
                            <td className="py-1 text-right font-mono font-bold text-xs text-gray-900 border-b-2 border-double border-gray-900">
                                {(salary.salary || 0).toLocaleString()}/-
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Footer Signatures */}
            <div className="mt-auto pt-4 flex justify-between items-end gap-2">
                <div className="text-center flex-1">
                    <div className="border-b border-gray-400 mb-0.5"></div>
                    <p className="text-[6px] font-bold text-gray-400 uppercase tracking-wider">Receiver Signature</p>
                </div>
                <div className="text-center flex-1 relative">
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-blue-900/10 font-serif italic text-lg -rotate-12 pointer-events-none select-none whitespace-nowrap">Authorized Officer</div>
                    <div className="border-b border-gray-400 mb-0.5"></div>
                    <p className="text-[6px] font-bold text-gray-400 uppercase tracking-wider">Authorized Officer</p>
                </div>
            </div>

            {/* Bottom Note */}
            <div className="text-center mt-1 pt-1 border-t border-gray-100">
                <p className="text-[6px] text-gray-400 uppercase tracking-tight">Computer Generated Slip • Invalid without Stamp</p>
            </div>
        </div>
    );
};

const SalarySlip = ({ teacher, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    if (!teacher) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white print:fixed print:inset-0">
            {/* Print Styles for Landscape */}
            <style>
                {`
                    @media print {
                        @page { size: landscape; margin: 0.2cm; }
                        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                        #salary-slip-container { padding: 0 !important; }
                    }
                `}
            </style>

            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none relative">

                {/* Header Controls (Screen Only) */}
                <div className="absolute top-0 right-0 p-2 flex gap-2 print:hidden z-10">
                    <button onClick={handlePrint} className="p-2 bg-gray-100/80 hover:bg-primary-50 text-gray-600 hover:text-primary-600 rounded-full transition-colors border border-gray-200 shadow-sm" title="Print Salary Slip">
                        <Printer className="w-4 h-4" />
                    </button>
                    <button onClick={onClose} className="p-2 bg-gray-100/80 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-full transition-colors border border-gray-200 shadow-sm" title="Close Preview">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Slip Content Container */}
                <div className="p-6 print:p-1" id="salary-slip-container">
                    <div className="bg-white min-h-[400px] flex flex-row gap-4 items-stretch print:gap-2 print:items-start justify-center">

                        {/* Staff Copy */}
                        <div className="flex-1 max-w-[32%]">
                            <SingleSlip salary={teacher} copyTitle="STAFF COPY" />
                        </div>

                        {/* Cut Line 1 */}
                        <div className="flex flex-col items-center justify-center gap-2 opacity-30 select-none print:opacity-50 w-px self-stretch border-l border-dashed border-gray-400 relative">
                            <Scissors className="w-2.5 h-2.5 text-gray-500 absolute top-10 left-1/2 -translate-x-1/2 bg-white" />
                            <Scissors className="w-2.5 h-2.5 text-gray-500 absolute bottom-10 left-1/2 -translate-x-1/2 rotate-180 bg-white" />
                        </div>

                        {/* Bank Copy */}
                        <div className="flex-1 max-w-[32%]">
                            <SingleSlip salary={teacher} copyTitle="BANK COPY" />
                        </div>

                        {/* Cut Line 2 */}
                        <div className="flex flex-col items-center justify-center gap-2 opacity-30 select-none print:opacity-50 w-px self-stretch border-l border-dashed border-gray-400 relative">
                            <Scissors className="w-2.5 h-2.5 text-gray-500 absolute top-10 left-1/2 -translate-x-1/2 bg-white" />
                            <Scissors className="w-2.5 h-2.5 text-gray-500 absolute bottom-10 left-1/2 -translate-x-1/2 rotate-180 bg-white" />
                        </div>

                        {/* Office Copy */}
                        <div className="flex-1 max-w-[32%]">
                            <SingleSlip salary={teacher} copyTitle="OFFICE COPY" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalarySlip;
