import React from 'react'
import LatestProducts from '../LatestProducts/LatestProducts'

const latestProductsPromise=fetch('http://localhost:3000/latest-products').then(res=>res.json())
const Home = () => {
  return (
    <div>
      <h2>This is Home</h2>
      <LatestProducts latestProductsPromise={latestProductsPromise}></LatestProducts>
    </div>
  )
}

export default Home