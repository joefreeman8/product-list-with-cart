import './App.css'
import { useEffect, useState } from 'react'

import dessertData from '../data.json'
import iconAddToCart from './assets/images/icon-add-to-cart.svg'
import emptyCart from './assets/images/illustration-empty-cart.svg'
import decrementItem from './assets/images/icon-decrement-quantity.svg'
import incrementItem from './assets/images/icon-increment-quantity.svg'
import carbonNeutralIcon from './assets/images/icon-carbon-neutral.svg'
import removeItemIcon from './assets/images/icon-remove-item.svg'
import orderConfirmed from './assets/images/icon-order-confirmed.svg'

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
  quantity: number
  id: number
}

const typedDessertData: Dessert[] = dessertData.map(dessert => ({
  ...dessert,
  quantity: 0,
}))

function App() {
  const [data] = useState<Dessert[] | null>(typedDessertData)
  const [cart, setCart] = useState<Dessert[]>([])
  const [itemCount, setItemCount] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  useEffect(() => {
    const newItemCount = cart.reduce((total, item) => total + item.quantity, 0)
    setItemCount(newItemCount)

    const newTotalPrice = cart.reduceRight((total, item) => total + item.price * item.quantity, 0)
    setTotalPrice(newTotalPrice)
  }, [cart])

  function handleAddToCart(dessert: Dessert) {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === dessert.name)
      if (existingItem) {
        return prevCart.map(item =>
          item.name === dessert.name ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevCart, { ...dessert, quantity: 1 }]
      }
    })
  }

  function handleIncreaseQuantity(dessert: Dessert) {
    setCart(prevCart =>
      prevCart.map(item =>
        item.name === dessert.name ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  function handleDecreaseQuantity(dessert: Dessert) {
    setCart(prevCart =>
      prevCart.map(item =>
        item.name === dessert.name ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
      ).filter(item => item.quantity > 0)
    )
  }

  function isItemInCart(dessertName: string) {
    return cart.some(item => item.name === dessertName)
  }

  function removeItem(item: Dessert) {
    setCart(prevCart => prevCart.filter(dessert => {
      return dessert.name !== item.name
    }))

  }

  return (
    <>
      <div className='m-0 flex flex-row bg-offWhite'>
        <section className='lg:w-2/3 mt-20 ml-20'>
          <h1 className='font-bold text-3xl text-rose-900 mb-8'>Desserts</h1>
          <div className='lg:grid lg:grid-cols-3 lg:gap-6'>
            {data && (
              data.map((dessert) => (
                <div key={dessert.id}>
                  {isItemInCart(dessert.name) ? (
                    <figure className='flex lg:flex-col lg:items-center lg:mb-2'>
                      <img className="rounded z-0 border border-2 border-red rounded-lg" src={dessert.image.desktop} alt={dessert.name} />
                      <div className='-mt-5 z-10 bg-red flex items-center w-40 h-11 btn border border-red rounded-full text-white font-semibold text-sm p-4 justify-between'>
                        <button onClick={() => handleDecreaseQuantity(dessert)} className='p-1 border rounded-full'>
                          <img src={decrementItem} alt='decrement button' className='w-2 h-2' />
                        </button>
                        {cart.find(item => item.name === dessert.name)?.quantity || 0}
                        <button onClick={() => handleIncreaseQuantity(dessert)} className='p-1 border rounded-full'>
                          <img src={incrementItem} alt='increment button' className='h-2' />
                        </button>
                      </div>
                    </figure>
                  ) : (
                    <figure className='flex lg:flex-col lg:items-center lg:mb-2'>
                      <img className="rounded z-0" src={dessert.image.desktop} alt={dessert.name} />
                      <button
                        className='-mt-5 z-10 bg-white flex items-center max-w-40 h-11 btn border border-rose-400 rounded-full text-rose-900 font-semibold text-sm p-4'
                        onClick={() => handleAddToCart(dessert)}
                      >
                        <img src={iconAddToCart} alt='add to cart icon' className='mr-1' />
                        Add to Cart
                      </button>
                    </figure>
                  )}
                  <span className='text-sm text-rose-500'>{dessert.category}</span>
                  <h2 className='font-semibold text-rose-900'>{dessert.name}</h2>
                  <p className='font-semibold text-red'>${dessert.price.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className='ml-8 mt-20 mr-20 lg:w-1/3 bg-white h-fit'>
          {cart.length === 0 ? (
            <div className='flex flex-col p-6'>
              <h2 className='text-red font-bold text-lg'>Your Cart ({itemCount})</h2>
              <div className='flex flex-col'>
                <figure className='flex justify-center my-4'>
                  <img src={emptyCart} alt="empty cart image" className='w-32 h-32' />
                </figure>
                <p className='text-sm font-semibold text-rose-500 text-center mb-4'>Your added items will appear here</p>
              </div>
            </div>
          ) : (
            <div className='flex flex-col p-6'>
              <h2 className='text-red font-bold text-lg'>Your Cart ({itemCount})</h2>
              {cart.map((item) => (
                <>
                  <div key={item.id} className='flex flex-row '>
                    <div className='flex flex-col p-2 w-full'>
                      <h3 className='text-sm font-semibold text-rose-900'>{item.name}</h3>
                      <div className='flex flex-row justify-between items-center w-3/6'>
                        <p className='text-sm text-red font-semibold'>{item.quantity}x</p>
                        <p className='text-sm text-rose-400'>@${item.price.toFixed(2)}</p>
                        <p className='text-rose-500'> ${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <button className='flex justify-center items-center btn border border-rose-400 rounded-full'>
                        <img onClick={() => removeItem(item)} src={removeItemIcon} alt='remove item button' className='p-1' />
                      </button>
                    </div>
                    <hr />
                  </div>
                </>
              ))}
              <div className='flex flex-row justify-between my-5'>
                <p className='text-sm text-rose-900'>Order Total</p>
                <h3 className='font-bold text-xl text-rose-900'>${totalPrice.toFixed(2)}</h3>
              </div>
              <div className='bg-rose-50 text-rose-900 flex flex-row justify-center items-center p-4 rounded-lg'>
                <img src={carbonNeutralIcon} alt="carbon neutral notice" />
                <p className='ml-2 text-sm'>This is a <span className='font-semibold'>carbon-neutral</span> delivery</p>
              </div>
              <button onClick={openModal} className='mt-5 btn rounded-full bg-red text-rose-50 h-10 text-sm'>Confirm Order</button>
            </div>
          )}
        </section>
      </div >
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-8 bg-white w-full max-w-md rounded-lg shadow-lg">
            <div>
              <img src={orderConfirmed} alt="Order Confirmed Icon" className='mb-6' />
              <h2 className='font-bold text-3xl text-rose-900 mb-3'>Order Confirmed</h2>
              <p className='text-rose-500'>We hope you enjoy your food!</p>
            </div>
            <div className=''>
              test
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
