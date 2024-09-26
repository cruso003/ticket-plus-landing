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
          {/* Add more FAQ items */}
        </Accordion>
      </div>
    </section>
  );