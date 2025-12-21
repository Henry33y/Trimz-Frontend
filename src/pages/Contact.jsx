/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React from 'react';
import { Mail, MessageSquare, Send, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section className="min-h-screen bg-gray-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* ============================================ */}
        {/* HEADER SECTION */}
        {/* ============================================ */}
        <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-headingColor mb-4">Contact Us</h2>
          <p className="text-lg text-textColor leading-relaxed max-w-2xl mx-auto">
            For booking support or Stylist inquiries, we’re here to assist!
            Reach out for help and enjoy top-notch grooming on campus.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ============================================ */}
          {/* CONTACT INFO CARDS - Desktop Sidebar */}
          {/* ============================================ */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
              <div className="w-12 h-12 bg-primaryColor/10 rounded-xl flex items-center justify-center text-primaryColor shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Email Us</p>
                <p className="text-sm font-semibold text-headingColor truncate">support@trimz.com</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
              <div className="w-12 h-12 bg-irisBlueColor/10 rounded-xl flex items-center justify-center text-irisBlueColor shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Call Us</p>
                <p className="text-sm font-semibold text-headingColor">+1 (555) 000-0000</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Location</p>
                <p className="text-sm font-semibold text-headingColor">Main Campus, Bldg 4</p>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* CONTACT FORM */}
          {/* ============================================ */}
          <div className="lg:col-span-2 bg-white p-8 lg:p-12 rounded-[2rem] shadow-sm border border-gray-100">
            <form action="#" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Field */}
                <div className="md:col-span-1">
                  <label htmlFor="email" className="block text-sm font-bold text-headingColor mb-2 ml-1">
                    Your Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      placeholder="email@gmail.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div className="md:col-span-1">
                  <label htmlFor="subject" className="block text-sm font-bold text-headingColor mb-2 ml-1">
                    Subject
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="subject"
                      placeholder="How can we help?"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-bold text-headingColor mb-2 ml-1">
                  Your Message
                </label>
                <textarea
                  rows="6"
                  id="message"
                  placeholder="Leave a comment or inquiry here..."
                  className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all resize-none placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-start">
                <button
                  type="submit"
                  className="w-full sm:w-fit flex items-center justify-center gap-3 px-10 py-4 bg-primaryColor text-white font-bold rounded-xl hover:bg-primaryColor/90 hover:shadow-xl hover:shadow-primaryColor/20 active:scale-[0.98] transition-all"
                >
                  <span>Send Message</span>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;