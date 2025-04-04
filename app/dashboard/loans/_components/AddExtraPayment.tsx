'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { addExtraLoanPayment } from '@/utils/loanUtils';
import { set } from 'date-fns';

const AddExtraPayment = ({ loanId, refreshData }: { loanId: number; refreshData: () => void }) => {
  const { user } = useUser();
  const [extraAmount, setExtraAmount] = useState<number>(0);
  const [fee, setFee] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (extraAmount <= 0) {
      toast.error("Enter a valid extra payment amount");
      return;
    }

    setLoading(true);

    await addExtraLoanPayment(loanId, user?.primaryEmailAddress?.emailAddress!, extraAmount, fee, paymentDate);

    setExtraAmount(0);
    setFee(0);
    refreshData();
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setLoading(false);
    toast.success("Extra payment applied successfully");
  };

  return (
    <div className="max-full border mx-auto mt-2 p-2 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Make an Extra Loan Payment</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className='col-span-1'>
            <h3 className="text-sm font-semibold mb-1">Payment Amount</h3>
            <Input type="number" value={extraAmount} onChange={(e) => setExtraAmount(parseFloat(e.target.value) || 0)} />
          </div>
          <div className='col-span-1'>
            <h3 className="text-sm font-semibold mb-1">Processing Fee</h3>
            <Input type="number" value={fee} onChange={(e) => setFee(parseFloat(e.target.value) || 0)} />
          </div>
          <div className='col-span-1'>
            <h3 className="text-sm font-semibold mb-1">Payment Date</h3>
            <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
          </div>
        <div className='col-span-1'>
        <Button onClick={handleSubmit} disabled={loading} className="w-full mt-6">
            {loading ? "Processing..." : "Apply Payment"}
          </Button>
        </div>
        </div>
      </div>
  );
};

export default AddExtraPayment;
