export default function TestimonialsSection() {
  const testimonials = [
    { 
      name: "Alex Chen", 
      role: "Math Champion", 
      text: "EduQuest made learning calculus actually fun! I went from struggling to top of my class.",
      avatar: "👨‍🎓",
      rating: 5
    },
    { 
      name: "Sarah Martinez", 
      role: "Science Pro", 
      text: "The battle system is addictive! I don't even realize I'm studying when I'm competing.",
      avatar: "👩‍🔬",
      rating: 5
    },
    { 
      name: "Mike Johnson", 
      role: "History Master", 
      text: "Collecting badges and leveling up keeps me motivated to learn every day.",
      avatar: "👨‍🏫",
      rating: 4
    }
  ];

  return (
    <section id="testimonials" className="reveal">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-shadow-pixel mb-16">
        What Trainers Say
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-black/40 backdrop-blur-sm border-4 border-yellow-500 p-6 shadow-[8px_8px_0_#000]">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">{testimonial.avatar}</div>
              <div className="flex justify-center space-x-1 mb-2">
                {"⭐".repeat(testimonial.rating)}
              </div>
              <h3 className="font-bold text-yellow-300">{testimonial.name}</h3>
              <p className="text-yellow-200 text-sm">{testimonial.role}</p>
            </div>
            <p className="text-red-200 text-center italic">"{testimonial.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}