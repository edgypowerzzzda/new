"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    name: "Алексей Петров",
    role: "Профессиональный гитарист",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Отличный магазин! Купил здесь свою Gibson Les Paul. Качество инструментов на высоте, а сервис просто превосходный. Рекомендую всем музыкантам!",
  },
  {
    id: 2,
    name: "Мария Иванова",
    role: "Преподаватель музыки",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Покупаю инструменты для музыкальной школы уже несколько лет. Всегда качественные товары, быстрая доставка и отличные цены. Спасибо за профессионализм!",
  },
  {
    id: 3,
    name: "Дмитрий Козлов",
    role: "Барабанщик группы 'Рок-н-ролл'",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Заказывал барабанную установку Tama. Пришла в идеальном состоянии, упакована отлично. Звучание потрясающее! Буду заказывать еще.",
  },
  {
    id: 4,
    name: "Елена Смирнова",
    role: "Пианистка",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Купила цифровое пианино Yamaha. Консультанты помогли выбрать идеальную модель. Очень довольна покупкой и обслуживанием!",
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Что говорят наши{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">клиенты</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Более 15,000 довольных музыкантов уже выбрали нас</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 relative"
            >
              <Quote className="w-12 h-12 text-red-600 mb-6" />

              <div className="flex items-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-lg lg:text-xl text-gray-700 mb-8 leading-relaxed">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="flex items-center">
                <Avatar className="w-16 h-16 mr-4">
                  <AvatarImage src={testimonials[currentIndex].avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {testimonials[currentIndex].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{testimonials[currentIndex].name}</h4>
                  <p className="text-gray-600">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? "bg-red-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
