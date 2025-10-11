// components/LandingPage/FAQSection.jsx
import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Is EduQuest really free?",
      answer: "Yes! Our core features are completely free. We offer premium upgrades for advanced analytics and exclusive content."
    },
    {
      question: "What subjects are available?",
      answer: "We cover Math, Science, History, Languages, Computer Science, and more! New subjects are added regularly."
    },
    {
      question: "Can I play with friends?",
      answer: "Absolutely! You can challenge friends, form study teams, and compete on leaderboards together."
    },
    {
      question: "Is it suitable for all ages?",
      answer: "Yes! EduQuest is designed for learners of all ages, from elementary school to adult education."
    }
  ];

  return (
    <section id="faq" className="reveal">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-shadow-pixel mb-16">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-black/40 backdrop-blur-sm border-4 border-black shadow-[6px_6px_0_#000]">
            <button
              className="w-full p-4 text-left flex justify-between items-center hover:bg-red-900/30 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-bold text-red-300">{faq.question}</span>
              <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="p-4 border-t border-red-900">
                <p className="text-red-200">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}