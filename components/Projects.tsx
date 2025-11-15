'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiGithub, FiExternalLink, FiX, FiImage } from 'react-icons/fi'
import Image from 'next/image'

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

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})

  const openProject = (index: number) => {
    setSelectedProject(index)
  }

  const closeProject = () => {
    setSelectedProject(null)
  }

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <>
      <section
        id="projects"
        ref={ref}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center text-sm uppercase tracking-[0.4em] text-dark-text2"
          >
            Case Studies
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold mb-3 text-center"
          >
            Proof that <span className="text-gradient">AI ships fast</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-center text-dark-text2 mb-10 text-base max-w-2xl mx-auto"
          >
            Tap into a few builds below. Each started as a napkin idea and ended as a working, demo-ready product.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-dark-surface2/80 hover:border-primary-500/50 transition-all duration-300 cursor-pointer"
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => openProject(index)}
              >
                <div className="relative w-full h-52 overflow-hidden bg-dark-surface">
                  {project.image && !imageErrors[index] ? (
                    <>
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => handleImageError(index)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-surface2 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-500/30">
                      <FiImage size={48} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-dark-text group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm uppercase tracking-wide text-dark-text2 mb-3">
                    Featured build
                  </p>
                  <p className="text-dark-text2 mb-5 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-sm">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="text-primary-400 text-sm font-semibold group-hover:text-primary-300 transition-colors">
                    Tap for outcomes →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 text-center"
          >
            <p className="text-dark-text text-lg">
              Want a similar transformation? <a href="#contact" className="text-primary-400 underline-offset-4 hover:underline">Let&apos;s design your roadmap</a> and launch faster.
            </p>
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={closeProject}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-dark-surface rounded-3xl border border-white/10 shadow-2xl max-w-5xl mx-auto overflow-hidden">
                {projects[selectedProject] && (
                  <>
                    {/* Modal Header */}
                    <div className="relative">
                      <div className="relative w-full h-64 md:h-96 overflow-hidden bg-dark-surface2">
                        {projects[selectedProject].image && !imageErrors[selectedProject] ? (
                          <>
                            <Image
                              src={projects[selectedProject].image}
                              alt={projects[selectedProject].title}
                              fill
                              className="object-cover"
                              onError={() => handleImageError(selectedProject)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-surface to-transparent" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary-500/30">
                            <FiImage size={64} />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={closeProject}
                        className="absolute top-4 right-4 bg-dark-surface/90 hover:bg-dark-surface text-dark-text2 hover:text-primary-500 rounded-full p-2 transition-colors z-10"
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 md:p-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-500">
                        {projects[selectedProject].title}
                      </h2>
                      
                      <p className="text-lg text-dark-text2 mb-6 leading-relaxed">
                        {projects[selectedProject].longDescription || projects[selectedProject].description}
                      </p>

                      {projects[selectedProject].features && (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold mb-3 text-dark-text">Key Features</h3>
                          <ul className="space-y-2">
                            {projects[selectedProject].features!.map((feature, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-dark-text2">
                                <span className="text-primary-500 mt-1">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-3 text-dark-text">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {projects[selectedProject].technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <motion.a
                          href={projects[selectedProject].githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiGithub size={20} />
                          <span>View on GitHub</span>
                        </motion.a>
                        {projects[selectedProject].demoUrl && (
                          <motion.a
                            href={projects[selectedProject].demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 bg-dark-surface2 hover:bg-dark-surface text-dark-text border border-primary-500/50 hover:border-primary-500 rounded-lg transition-colors font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiExternalLink size={20} />
                            <span>Live Demo</span>
                          </motion.a>
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
