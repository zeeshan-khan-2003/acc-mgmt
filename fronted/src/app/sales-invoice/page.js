import { Suspense } from 'react';
import SalesInvoice from './sales-invoice';

export default function SalesInvoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SalesInvoice />
    </Suspense>
  );
}
