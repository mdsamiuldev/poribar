export interface Expense {
  _id?: string;
  title: string;        // খরচের বিষয় (যেমন: ক্যাটারিং)
  amount: number;       // খরচের পরিমাণ (টাকা)
  category: string;     // ক্যাটাগরি (খাবার, সাজসজ্জা, যাতায়াত ইত্যাদি)
  paidBy: string;       // কে টাকা পরিশোধ করেছেন
  date: string;         // তারিখ
  createdAt?: Date;
}