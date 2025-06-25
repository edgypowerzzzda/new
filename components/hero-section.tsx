import Image from "next/image"

import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Музыкальные инструменты для профессионалов</h1>
            <p className="text-xl mb-8 text-red-100">
              Широкий выбор гитар, клавишных, ударных и аудиооборудования от ведущих мировых брендов
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                Каталог товаров
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                Новинки
              </Button>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Музыкальные инструменты"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Popular brands */}
      <div className="border-t border-red-500 bg-red-700/50">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-center text-lg font-semibold mb-6">Наши бренды</h2>
          <div className="flex items-center justify-center space-x-8 opacity-90">
            <div className="text-2xl font-bold">Yamaha</div>
            <div className="text-2xl font-bold">Shure</div>
            <div className="text-2xl font-bold">Casio</div>
            <div className="text-2xl font-bold">Korg</div>
            <div className="text-2xl font-bold">Fender</div>
            <div className="text-2xl font-bold">Gibson</div>
          </div>
        </div>
      </div>
    </section>
  )
}
