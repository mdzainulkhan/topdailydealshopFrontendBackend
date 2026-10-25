import { SITE } from '@/lib/config';

export const metadata = { title: 'Affiliate disclosure' };

export default function Disclosure() {
  return (
    <div className="container prose">
      <h1>Affiliate disclosure</h1>
      <p>{SITE.name} is a participant in the Amazon Associates Programme, an affiliate advertising programme designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in.</p>
      <p>As an Amazon Associate we earn from qualifying purchases. When you click a link on this site and buy something, we may receive a small commission at no extra cost to you.</p>
      <p>Product prices, images and availability come from Amazon and are subject to change. The price on Amazon at the time you buy is the price you pay. We do not sell products or process payments.</p>
    </div>
  );
}
