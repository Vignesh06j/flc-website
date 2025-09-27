import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import React from 'react'

const Gallery = () => {
  return (
    <div className="min-h-screen bg-slate-50">
        <Navbar />
        <section id="who we are" className="pt-24 min-h-screen flex items-center justify-center">
            Gallery
        </section>
        <Footer />
    </div>
  )
}

export default Gallery