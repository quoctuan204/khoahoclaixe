import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Courses from '../components/Courses'
import Registration from '../components/Registration'
import Introduce from '../components/Introduce'
import Album from '../components/Album'
import FadeIn from '../components/FadeIn'

const Home = () => {
  return (
    <div>
      <Hero />
      <FadeIn><Introduce /></FadeIn>
      <FadeIn><Features /></FadeIn>
      <FadeIn><Courses /></FadeIn>
      <FadeIn><Album /></FadeIn>
      <FadeIn><Registration /></FadeIn>
    </div>
  )
}

export default Home
