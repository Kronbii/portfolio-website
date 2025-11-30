'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Cpu, Eye, Rocket } from 'lucide-react'

const highlights = [
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'AI Engineering',
    description: 'Deep learning, model optimization, and production-ready ML systems.',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Computer Vision',
    description: 'Real-time perception, object detection, and visual understanding.',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Product Delivery',
    description: 'End-to-end development with Google PM-certified methodology.',
  },
]

const techStack = [
  'Python',
  'PyTorch',
  'TensorFlow',
  'TensorRT',
  'OpenCV',
  'ONNX',
  'C++',
  'Next.js',
  'Three.js',
  'Docker',
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 sm:py-32 relative"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gemini-500 font-medium mb-4">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Building AI that <span className="text-gradient">makes sense</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Mechatronics engineer turned AI/CV specialist. I stay hands-on across strategy, 
            firmware, and ML — so you work with one partner instead of five.
          </p>
        </motion.div>

        {/* Highlight cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-6 h-full transition-all duration-300 hover:shadow-glow">
                <div className="w-12 h-12 rounded-2xl bg-gemini-gradient flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium mb-6">
            Tech Stack
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="px-4 py-2 rounded-full glass text-sm font-medium text-slate-900 dark:text-white hover:bg-gemini-500/10 hover:border-gemini-500/30 transition-colors cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
