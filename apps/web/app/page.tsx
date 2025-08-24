import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Speck - Visual Test Automation Platform",
  description: "Streamline your testing workflow with visual test automation",
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  className="rounded-lg"
                  src="/images/speck.png"
                  alt="Speck Logo"
                  width={40}
                  height={40}
                />
                <span className="text-2xl font-medium text-gray-800 dark:text-white">
                  Speck
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Pricing
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Contact
              </Link>
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-32 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-100/50 dark:from-brand-900/20 dark:via-gray-900 dark:to-brand-800/20" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-40 right-16 w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full opacity-40 animate-bounce" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-full opacity-50 animate-pulse" style={{animationDelay: '2s'}} />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-brand-50 dark:bg-brand-900/30 rounded-full text-brand-600 dark:text-brand-400 text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Powered by Modern Testing
              </div>
              
              <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                Build Tests
                <span className="block text-brand-600 dark:text-brand-400">Visually</span>
              </h1>
              
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                Create, organize, and execute automated tests with our intuitive visual platform. 
                No complex scripts needed - just write tests in plain language.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  href="/signup"
                  className="px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-brand-600 to-brand-500 rounded-xl hover:from-brand-700 hover:to-brand-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Testing Free
                </Link>
                <Link
                  href="#demo"
                  className="px-8 py-4 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  Watch Demo
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">10k+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tests Created</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Teams</div>
                </div>
              </div>
            </div>
            
            {/* Right Visual */}
            <div className="relative">
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 flex-1 bg-gray-200 dark:bg-gray-600 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-400">
                      speck.dev/projects/ecommerce
                    </div>
                  </div>
                </div>
                
                {/* Mock Interface */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">E-commerce Tests</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">12 test cases</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 rounded-full text-sm font-medium">
                      Passing
                    </div>
                  </div>
                  
                  {/* Test Cases */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">Login with valid credentials</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">2.3s</div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">Add product to cart</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">1.8s</div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                      <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">Complete checkout process</div>
                      <div className="text-xs text-blue-500">Running...</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Code Snippet */}
              <div className="absolute -right-8 top-8 bg-gray-900 dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 max-w-xs hidden lg:block">
                <div className="text-xs text-gray-400 mb-2">Test Code</div>
                <div className="font-mono text-xs text-green-400">goto "https://shop.com"</div>
                <div className="font-mono text-xs text-blue-400">click "Login"</div>
                <div className="font-mono text-xs text-yellow-400">type @username into "#email"</div>
                <div className="font-mono text-xs text-purple-400">assert "Dashboard" is visible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-brand-50 dark:bg-brand-900/30 rounded-full text-brand-600 dark:text-brand-400 text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
              </svg>
              Powerful Features
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              Everything you need to test
              <span className="block text-brand-600 dark:text-brand-400">better and faster</span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
              From visual test creation to comprehensive reporting, Speck provides all the tools 
              your team needs for modern test automation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Visual Test Builder */}
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Visual Test Builder</h3>
                <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                  Write tests in plain language with our intelligent editor. Get syntax highlighting, 
                  auto-completion, and real-time validation as you build your test scenarios.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Intelligent auto-completion</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Real-time syntax validation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Built-in testing helpers</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="ml-2 text-gray-400 text-sm">test-editor.speck</span>
                  </div>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="text-gray-500">1</div>
                    <div className="text-gray-500">2</div>
                    <div className="text-gray-500">3</div>
                    <div className="text-gray-500">4</div>
                    <div className="text-gray-500">5</div>
                    <div className="text-gray-500">6</div>
                  </div>
                  <div className="absolute ml-8 -mt-6 space-y-2 font-mono text-sm">
                    <div><span className="text-purple-400">goto</span> <span className="text-green-400">"https://mystore.com"</span></div>
                    <div><span className="text-blue-400">click</span> <span className="text-yellow-400">"Login"</span></div>
                    <div><span className="text-purple-400">type</span> <span className="text-orange-400">@username</span> <span className="text-blue-400">into</span> <span className="text-yellow-400">"#email"</span></div>
                    <div><span className="text-purple-400">type</span> <span className="text-orange-400">@password</span> <span className="text-blue-400">into</span> <span className="text-yellow-400">"#password"</span></div>
                    <div><span className="text-blue-400">click</span> <span className="text-yellow-400">"Submit"</span></div>
                    <div><span className="text-red-400">assert</span> <span className="text-yellow-400">"Welcome"</span> <span className="text-blue-400">is visible</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Suite Organization */}
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Project: E-commerce App</h4>
                    <div className="px-2 py-1 bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 rounded text-xs">
                      All Passing
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">Authentication Tests</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">8 test cases</div>
                      </div>
                      <div className="text-success-500">✓</div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">Shopping Cart Tests</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">12 test cases</div>
                      </div>
                      <div className="text-success-500">✓</div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">Checkout Flow Tests</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">6 test cases</div>
                      </div>
                      <div className="text-success-500">✓</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Smart Test Organization</h3>
                <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                  Group related tests into suites with shared variables and functions. 
                  Manage dependencies and run tests in the optimal order.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Shared variables & functions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Hierarchical test structure</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Parallel execution support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Real-time Execution */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-brand-100 dark:bg-brand-900 rounded-lg">
                <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Real-time Execution</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Execute your test suites instantly with real-time feedback, detailed logs, and comprehensive reporting.
              </p>
            </div>

            {/* Team Collaboration */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-brand-100 dark:bg-brand-900 rounded-lg">
                <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Team Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Collaborate seamlessly with your team through project sharing, role-based access, and team invitations.
              </p>
            </div>

            {/* Variable & Function Management */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-brand-100 dark:bg-brand-900 rounded-lg">
                <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Variable & Function Management</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Define reusable variables and functions at project and test suite levels for efficient test maintenance.
              </p>
            </div>

            {/* Detailed Reporting */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-brand-100 dark:bg-brand-900 rounded-lg">
                <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Detailed Reporting</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive test results with step-by-step execution logs, screenshots, and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Speck</h3>
              <p className="text-gray-400">
                Visual test automation platform for modern development workflows.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-gray-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#about" className="text-gray-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Speck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}