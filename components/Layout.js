import React from 'react'
import Head from 'next/head'

export default function Layout({title, children}) {
  return (
    <div className='bg-zinc-100'>
        <Head>
            <title>{title}</title>
        </Head>

        <main className='container mx-auto max-w-6xl pt-8 min-h-screen '>
            {children}
        </main>
    </div>
    
  )
}
