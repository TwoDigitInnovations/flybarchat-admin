import React from "react";
import isAuth from "../../components/isAuth";
import { ShieldCheck, Lock, Eye, FileText, Mail, Calendar } from "lucide-react";

function PrivacyPolicy() {
  const sections = [
    {
      icon: <FileText className="w-6 h-6 text-cyan-400" />,
      title: "Information We Collect",
      content:
        "We may collect your name, email address, phone number, and other information you provide while using our platform.",
    },
    {
      icon: <Lock className="w-6 h-6 text-green-400" />,
      title: "How We Use Your Information",
      content:
        "Your information is used to manage appointments, process payments, improve our services, and provide customer support.",
    },
    {
      icon: <Eye className="w-6 h-6 text-purple-400" />,
      title: "Data Sharing",
      content:
        "We do not sell your personal information. Data may only be shared with trusted service providers when necessary.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: "Data Security",
      content:
        "We use industry-standard security measures to protect your information from unauthorized access or disclosure.",
    },
    {
      icon: <Calendar className="w-6 h-6 text-orange-400" />,
      title: "Policy Updates",
      content:
        "This Privacy Policy may be updated from time to time. Changes will be reflected on this page with the updated date.",
    },
    {
      icon: <Mail className="w-6 h-6 text-pink-400" />,
      title: "Contact Us",
      content:
        "If you have any questions regarding this Privacy Policy, please contact our support team.",
    },
  ];

  return (
    <>
      <img
        src="/barimage.png"
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover -z-10 "
      />

      <div className="min-h-screen bg-[#11141AD9] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <ShieldCheck className="w-10 h-10 text-cyan-400" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Your privacy matters to us. This page explains how we collect,
              use, and protect your personal information while using our
              platform.
            </p>

            <p className="text-sm text-gray-500 mt-4">
              Last Updated: May 13, 2026
            </p>
          </div>

          {/* Policy Sections */}
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-[#1A1F29] border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#11141A] flex items-center justify-center">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>

                <p className="text-gray-400 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 bg-[#1A1F29] border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-gray-400">
              By using our platform, you agree to the terms outlined in this
              Privacy Policy and consent to the collection and use of
              information as described above.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default isAuth(PrivacyPolicy);
