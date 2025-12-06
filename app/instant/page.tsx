"use client";

import { ArrowLeft, ShieldCheck, Lock, Eye, Server } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};

export default function SecurePlatformPage() {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-4xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Link
                        href="/"
                        className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:underline mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </motion.div>

                <motion.div
                    className="glass p-8 md:p-12 rounded-3xl border !border-gray-300 dark:!border-gray-700/50 shadow-[0_0_20px_rgba(0,0,0,0.1)]"
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <motion.div
                            className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-bold">Why Our Platform is Secure</h1>
                    </div>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        Security isn't an afterthought; it's the foundation of our platform. We employ enterprise-grade encryption and strict access controls to keep your content safe.
                    </p>

                    <div className="space-y-6">
                        <motion.div
                            className="flex gap-4 items-start p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            variants={itemVariants}
                            whileHover={{ x: 5 }}
                        >
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">End-to-End Encryption</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Your data is encrypted in transit and at rest using industry-standard AES-256 protocols.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex gap-4 items-start p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            variants={itemVariants}
                            whileHover={{ x: 5 }}
                        >
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
                                <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Private by Default</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">You control who sees your content. Granular privacy settings allow for public, private, or password-protected sharing.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex gap-4 items-start p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            variants={itemVariants}
                            whileHover={{ x: 5 }}
                        >
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0">
                                <Server className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Secure Infrastructure</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Hosted on compliant servers with 24/7 monitoring and automated threat detection.</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
