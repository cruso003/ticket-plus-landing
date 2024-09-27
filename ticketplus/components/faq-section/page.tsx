import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export const FAQSection = () => (
  <section className="py-20 px-4 bg-gray-900">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-center text-purple-600">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className='text-white'>
          <AccordionTrigger>How does the NFC band work?</AccordionTrigger>
          <AccordionContent>
            The NFC band is linked to your Tick8 Plus account and can be used for cashless payments at events. Simply tap the band at designated payment points to make purchases quickly and securely.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className='text-white'>
          <AccordionTrigger>Is Tick8 Plus available in my country?</AccordionTrigger>
          <AccordionContent>
            Tick8 Plus is currently available in select countries. We are rapidly expanding our services. Check our website or contact our support team for the most up-to-date information on availability in your region.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className='text-white'>
          <AccordionTrigger>How can I become a beta tester?</AccordionTrigger>
          <AccordionContent>
            To become a beta tester, simply sign up on our website. We’ll notify you via email when the testing phase begins and provide instructions on how to participate.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className='text-white'>
          <AccordionTrigger>Can I purchase tickets without using the NFC band?</AccordionTrigger>
          <AccordionContent>
            Yes, you can purchase tickets directly through the Tick8 Plus app using mobile, card, or wallet payments. The NFC band is an additional feature for cashless payments during the event.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className='text-white'>
          <AccordionTrigger>What happens if I lose my NFC band?</AccordionTrigger>
          <AccordionContent>
            If you lose your NFC band, you can deactivate it via the Tick8 Plus app to prevent unauthorized use. You can also request a new band from the event organizer.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6" className='text-white'>
          <AccordionTrigger>How are payments handled with vendors at events?</AccordionTrigger>
          <AccordionContent>
            Event organizers handle all vendor settlements. After the event, organizers use data from the NFC band transactions to settle payments directly with vendors, ensuring a seamless and secure payment process.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7" className='text-white'>
          <AccordionTrigger>Can I refund or transfer my ticket?</AccordionTrigger>
          <AccordionContent>
            Refunds and ticket transfers are subject to the organizer’s policies. Please check the event details for specific guidelines or contact the organizer directly for assistance.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8" className='text-white'>
          <AccordionTrigger>What security measures are in place for payments?</AccordionTrigger>
          <AccordionContent>
            Tick8 Plus uses industry-standard encryption and secure payment gateways to ensure your personal and payment information is safe. Additionally, the NFC bands are encrypted, ensuring secure transactions at events.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9" className='text-white'>
          <AccordionTrigger>Can I use the NFC band outside of events?</AccordionTrigger>
          <AccordionContent>
            Currently, the NFC band is designed for use within Tick8 Plus-supported events. We may explore additional uses in the future as the platform evolves.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10" className='text-white'>
          <AccordionTrigger>How do I contact support?</AccordionTrigger>
          <AccordionContent>
            You can reach our support team via email or through the contact form on our website. We are here to help with any issues you may encounter.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
);
