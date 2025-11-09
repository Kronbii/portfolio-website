'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiCode, FiCpu, FiEye, FiUsers } from 'react-icons/fi'

interface Service {
  icon: React.ReactNode
  title: string
  description: string
}

const services: Service[] = [
  {
    icon: <FiCpu size={32} />,
    title: 'AI Development',
    description: 'I design and build end-to-end AI systems ranging from embedded and edge intelligence to large-scale predictive models. My work covers real-time AI, robotics integration, and advanced classification systems—delivering full-cycle development from data collection to deployment',
  },
  {
    icon: <FiEye size={32} />,
    title: 'Computer Vision Solutions',
    description: 'I develop advanced computer vision pipelines for object detection, tracking, segmentation, image calibration, stitching, and real-time perception. Leveraging OpenCV, PyTorch, TensorFlow, TensorRT, and TFLite, I create optimized vision solutions for embedded and real-time environments',
  },
  {
    icon: <FiCode size={32} />,
    title: 'Machine Learning Consulting',
    description: 'I help organizations design, evaluate, and optimize their machine learning strategies—from feasibility analysis and data preparation to model deployment and scaling. My consulting focuses on making ML systems reliable, interpretable, and production-ready, empowering teams to adopt AI efficiently',
  },
  {
    icon: <FiUsers size={32} />,
    title: 'Robotics Solutions',
    description: 'I build custom robotics solutions with a strong focus on intelligent software, AI integration, and perception systems. My experience spans autonomous vehicles, drones, and guided robots, offering end-to-end R&D that bridges robotics control, vision, and decision-making',
  },
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="services"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
        >
          Services I <span className="text-primary-500">Offer</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-dark-surface2 rounded-lg p-8 border border-dark-surface2 hover:border-primary-500/50 transition-all duration-300 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-primary-500 mb-4 group-hover:text-primary-400 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-dark-text">
                {service.title}
              </h3>
              <p className="text-dark-text2 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

