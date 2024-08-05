import './App.css'
import { useState } from 'react'

import dessertData from '../data.json'
import iconAddToCart from './assets/images/icon-add-to-cart.svg'

interface Images {
  thumbnail: string
  mobile: string
  tablet: string
  desktop: string
}

interface Dessert {
  image: Images
  name: string
  category: string
  price: number
}

const typedDessertData: Dessert[] = dessertData

function App() {

  const [data] = useState<Dessert[] | null>(typedDessertData)
  const [cart, setCart] = useState<Dessert[] | null>(null)
  const [itemCount, setItemCount] = useState<number>(0)

  console.log(data)



  return (
    <div className='m-0 p-14 flex flex-row bg-offWhite'>
      <section>
        <h1 className='font-bold text-3xl text-rose-900 mb-8'>Desserts</h1>
        <div className='grid grid-cols-3 gap-6'>
          {data && (
            data.map((dessert, index) => (
              <div key={index}>
                <figure className='flex flex-col items-center mb-4'>
                  <img className="w-60 rounded z-0" src={dessert.image.desktop} alt={dessert.name} />
                  <button className='-mt-5 z-10 bg-white flex items-center max-w-40 h-11 btn border border-rose-400 rounded-full text-rose-900 font-semibold text-sm p-4'>
                    <img src={iconAddToCart} alt='add to cart icon' className='mr-1' />
                    Add to Cart
                  </button>
                </figure>
                <span className='text-sm text-rose-500'>{dessert.category}</span>
                <h2 className='font-semibold text-rose-900'>{dessert.name}</h2>
                <p className='font-semibold text-red'>${dessert.price.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </section>
      <section className='m-6'>
        {!cart ? (
          <h2 className='text-red font-bold text-lg'>Your Cart ({itemCount})</h2>
        ) : (
          <h1>Checkout Cart </h1>
        )}
      </section>
    </div >
  )
}

export default App
