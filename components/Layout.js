import React from 'react'
import Link from 'next/link';
import Head from 'next/head';
import Footer from "@/components/Footer"

export default function Layout({title, children}) {

  return (
    <div className='bg-zinc-100 flex-col flex justify-between min-h-screen'>
        <Head>
          <title>{title}</title>
          <link rel="icon" href="/images/pokeball.png" />
          <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="..."
          crossorigin="anonymous"
        />
        </Head>

        <div className="bg-zinc-100 px-4 py-2 fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto max-w-6xl flex items-center">
          <Link legacyBehavior href="/">
            <a className="flex items-center">
              <img src="/images/pokeball.png" alt="Pokeball" className="w-8 h-8 mr-2 hover:-translate-y-1 transition-transform" />
              <h1 className="text-4xl font-bold">Pokédex</h1>
            </a>
          </Link>
        </div>
      </div>

        <main className='container mx-auto max-w-6xl pt-24'>
            {children}
        </main>

        <Footer />
    </div>
    
  )
}
