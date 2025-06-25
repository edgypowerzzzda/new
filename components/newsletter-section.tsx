"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubscribed(true)
    setEmail("")

    toast({
      title: "Подписка оформлена!",
      description: "Спасибо за подписку на нашу рассылку. Вы будете получать лучшие предложения первыми!",
    })

    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm">
            <Mail className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Будьте в курсе новинок</h2>
          <p className="text-xl text-red-100 mb-12 max-w-2xl mx-auto">
            Подпишитесь на нашу рассылку и получайте информацию о новых поступлениях, скидках и эксклюзивных
            предложениях первыми!
          </p>

          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Введите ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-red-200 backdrop-blur-sm h-12"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || isSubscribed}
              className="bg-white text-red-600 hover:bg-red-50 h-12 px-8 font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span>Подписка...</span>
                </div>
              ) : isSubscribed ? (
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Подписан!</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Подписаться</span>
                </div>
              )}
            </Button>
          </motion.form>

          <p className="text-red-200 text-sm mt-4">
            Мы уважаем вашу конфиденциальность и не передаем данные третьим лицам
          </p>
        </motion.div>
      </div>
    </section>
  )
}
