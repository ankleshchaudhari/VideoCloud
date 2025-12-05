"use client";

import { ArrowLeft, Zap, Globe, Share2, Clock } from "lucide-react";
import Link from "next/link";

export default function InstantSharingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="glass p-8 md:p-12 rounded-3xl border border-gray-200 dark:border-gray-700/50 shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                            <Share2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">How Instant Sharing Works</h1>
                    </div>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        In today's fast-paced world, waiting isn't an option. Our infrastructure is built to distribute your content globally in milliseconds, not minutes.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <Zap className="w-8 h-8 text-yellow-500 mb-4" />
                            <h3 className="font-semibold mb-2">Real-time Processing</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Uploads are processed on-the-fly, making them available almost immediately.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <Globe className="w-8 h-8 text-blue-500 mb-4" />
                            <h3 className="font-semibold mb-2">Global CDN</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Content is cached in edge locations worldwide for low-latency access.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <Clock className="w-8 h-8 text-green-500 mb-4" />
                            <h3 className="font-semibold mb-2">Zero Buffering</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Optimized delivery ensures playback starts instantly without loading spinners.</p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">Ready to go viral?</h3>
                            <p className="mb-6 opacity-90">Share your link once, reach millions instantly.</p>
                            <Link href="/upload" className="inline-block bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                                Start Uploading
                            </Link>
                        </div>
                        {/* Abstract decoration */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
