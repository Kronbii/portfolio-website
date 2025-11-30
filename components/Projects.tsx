'use client'

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiGithub, FiExternalLink, FiX, FiImage } from 'react-icons/fi'
import Image from 'next/image'
import { HoverButton } from '@/components/ui/hover-button'

interface Project {
  title: string
  description: string
  longDescription?: string
  githubUrl: string
  demoUrl?: string
  technologies: string[]
  image?: string
  features?: string[]
}

const projects: Project[] = [
  {
    title: 'Thermal Super-Resolution with IMDN',
    description:
      'A high-performance thermal super-resolution system achieving 34.2 dB PSNR at 229+ FPS using a novel IMDN-based architecture optimized for real-time thermal imaging.',
    longDescription:
      'This project introduces the first real-time thermal super-resolution framework built on the Information Multi-Distillation Network (IMDN). It delivers 34.2 dB PSNR and 229+ FPS, outperforming existing methods while remaining lightweight (0.69M parameters). The system integrates a thermal-aware loss function and a cross-domain transfer approach to adapt RGB-pretrained models to thermal data, resulting in superior detail preservation and speed. Applications span autonomous driving, industrial monitoring, thermal surveillance, and medical diagnostics. Developed with PyTorch, TensorRT, and OpenCV, this solution establishes a new state-of-the-art benchmark for real-time thermal enhancement.',
    githubUrl: 'https://github.com/Kronbii/thermal-super-resolution',
    technologies: ['Python', 'PyTorch', 'TensorRT', 'OpenCV'],
    image: '/projects/thermal-sr.png',
    features: [
      '34.2 dB PSNR at 229+ FPS real-time inference',
      'Thermal-aware multi-component loss function',
      'Cross-domain RGB-to-thermal transfer learning',
      'Lightweight IMDN architecture (0.69M parameters)',
      'Applications in robotics, security, and autonomous systems',
    ],
  },
  {
    title: 'Autonomous Race Car (WRO 2023 Winner)',
    description:
      'An open-source autonomous race vehicle built in just 20 days for the WRO Future Engineers challenge. Combines embedded control, sensor fusion, and Jetson-powered computer vision for real-time navigation and decision-making.',
    longDescription:
      'This project showcases a fully integrated autonomous vehicle developed from scratch in only 20 days for the World Robot Olympiad Future Engineers 2023 competition. The system combines a Jetson Nano for high-level computer vision and an Arduino Mega for deterministic real-time control using PID steering stabilization and sensor fusion from IMU and color sensors. Designed as a dual-MCU platform, it achieves smooth autonomous cornering, traffic sign detection, and dynamic pathing. Built with OpenCV, C++, and Python, the project demonstrates robust teamwork, rapid prototyping, and reliable embedded AI performance on a tight schedule.',
    githubUrl: 'https://github.com/Kronbii/autonomous-race-car',
    technologies: ['Python', 'C++', 'OpenCV', 'Arduino', 'Jetson Nano'],
    image: '/projects/race-car.png',
    features: [
      'End-to-end autonomous vehicle built in 20 days',
      'Jetson-based traffic sign and lane detection',
      'Arduino PID control with IMU and color sensors',
      'Dual-MCU architecture for modular expandability',
      'Designed and deployed for WRO Future Engineers 2023',
    ],
  },
  {
    title: 'Smart Learning Table for Classrooms',
    description:
      'An IoT-powered, AI-assisted smart desk that combines hardware control, computer vision, and ergonomic intelligence to enhance classroom learning and posture health.',
    longDescription:
      'The Smart Learning Table is an interactive, sensor-driven workstation designed to improve engagement, comfort, and learning outcomes in classrooms and offices. Built with ESP32 microcontrollers, motorized actuators, and OpenCV-based vision tracking, the desk automatically adjusts height and tilt, monitors user posture, and provides real-time visual feedback. It supports multiple control interfaces, including a web dashboard and Bluetooth controllers, and integrates posture analytics for ergonomic insights. Developed as a collaborative university project, it demonstrates a seamless fusion of IoT, embedded systems, and AI for human-centered design.',
    githubUrl: 'https://github.com/Kronbii/smart-interactive-desk',
    technologies: ['Python', 'OpenCV', 'ESP32', 'React', 'MQTT'],
    image: '/projects/smart-desk.png',
    features: [
      'Motorized height and tilt adjustment via actuators',
      'Posture tracking using computer vision and sensors',
      'Web dashboard and Bluetooth controller interfaces',
      'Real-time visual feedback through LEDs and displays',
      'IoT connectivity with data logging and analytics',
    ],
  },
]

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project
  index: number
  onClick: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [imageError, setImageError] = useState(false)

  // Mouse tracking for tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const xPos = (e.clientX - rect.left) / rect.width - 0.5
    const yPos = (e.clientY - rect.top) / rect.height - 0.5
    x.set(xPos)
    y.set(yPos)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group cursor-pointer perspective-1000"
    >
      <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-glow group-hover:border-gemini-500/30">
        {/* Image */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
          {project.image && !imageError ? (
            <>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#050508] via-background/20 to-transparent opacity-60" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
              <FiImage size={48} />
            </div>
          )}
          
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gemini-500/0 to-purple-500/0 group-hover:from-gemini-500/10 group-hover:to-purple-500/10 transition-colors duration-300" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-gradient transition-colors duration-300 mb-2">
            {project.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
            {project.description}
          </p>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-3 py-1 text-xs font-medium rounded-full bg-gemini-500/10 text-gemini-400 border border-gemini-500/20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* View more hint */}
          <div className="text-sm font-medium text-gemini-500 group-hover:text-gemini-400 transition-colors">
            View details →
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <>
      <section
        id="projects"
        ref={ref}
        className="py-24 sm:py-32 relative"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-gemini-500 font-medium mb-4">
              Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Real-world AI and computer vision systems, delivered with measurable impact.
            </p>
          </motion.div>

          {/* Projects grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                index={index}
                onClick={() => setSelectedProject(index)}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="glass-card inline-block px-8 py-6">
              <p className="text-lg text-slate-900 dark:text-white mb-4">
                Want a similar transformation for your business?
              </p>
              <HoverButton href="#contact" variant="gradient">
                Let&apos;s discuss your project
              </HoverButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white dark:bg-[#050508]/80 backdrop-blur-md z-50"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card max-w-5xl mx-auto overflow-hidden">
                {projects[selectedProject] && (
                  <>
                    {/* Modal Header */}
                    <div className="relative">
                      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {projects[selectedProject].image && !imageErrors[selectedProject] ? (
                          <>
                            <Image
                              src={projects[selectedProject].image!}
                              alt={projects[selectedProject].title}
                              fill
                              className="object-cover"
                              onError={() => handleImageError(selectedProject)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#050508] via-background/50 to-transparent" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                            <FiImage size={64} />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="absolute top-4 right-4 p-3 rounded-full glass hover:bg-white/10 transition-colors z-10"
                        aria-label="Close project"
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 md:p-8">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gradient">
                        {projects[selectedProject].title}
                      </h2>

                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                        {projects[selectedProject].longDescription ||
                          projects[selectedProject].description}
                      </p>

                      {projects[selectedProject].features && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                            Key Features
                          </h3>
                          <ul className="space-y-2">
                            {projects[selectedProject].features!.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-gemini-500 mt-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                          Technologies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {projects[selectedProject].technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-4 py-2 text-sm font-medium rounded-full bg-gemini-500/10 text-gemini-400 border border-gemini-500/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <HoverButton
                          href={projects[selectedProject].githubUrl}
                          variant="gradient"
                          className="flex items-center gap-2"
                        >
                          <FiGithub size={20} />
                          <span>View on GitHub</span>
                        </HoverButton>
                        {projects[selectedProject].demoUrl && (
                          <HoverButton
                            href={projects[selectedProject].demoUrl}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <FiExternalLink size={20} />
                            <span>Live Demo</span>
                          </HoverButton>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
