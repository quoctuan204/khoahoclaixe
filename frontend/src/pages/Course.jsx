import React from 'react'
import HeroCourse from '../components/HeroCourse'
import Pricing from '../components/Pricing'
import LearningPath from '../components/LearningPath'
import FadeIn from '../components/FadeIn'

const Course = () => {
  return (
    <div>
        <HeroCourse />
        <FadeIn><Pricing /></FadeIn>
        <FadeIn><LearningPath /></FadeIn>
    </div>
  )
}

export default Course
