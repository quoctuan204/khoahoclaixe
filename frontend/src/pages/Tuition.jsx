import React from 'react'
import HeroTuition from '../components/HeroTuition'
import MainPricing from '../components/MainPricing'
import ComparisonTable from '../components/ComparisonTable'
import Policies from '../components/Policies'
import CTABanner from '../components/CTABanner'
import FadeIn from '../components/FadeIn'

const Tuition = () => {
  return (
    <div>
      <HeroTuition />
      <FadeIn><MainPricing /></FadeIn>
      <FadeIn><ComparisonTable /></FadeIn>
      <FadeIn><Policies /></FadeIn>
      <FadeIn><CTABanner /></FadeIn>
    </div>
  )
}

export default Tuition
