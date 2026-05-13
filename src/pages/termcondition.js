import React from "react";
import isAuth from "../../components/isAuth";
import {
  FileCheck,
  Scale,
  Shield,
  AlertTriangle,
  CreditCard,
  Gavel,
  Mail,
} from "lucide-react";

function TermCondition() {
  const sections = [
    {
      icon: <FileCheck className="w-6 h-6 text-cyan-400" />,
      title: "Acceptance of Terms",
      content:
        "By accessing and using our platform, you agree to comply with these Terms and Conditions and all applicable laws and regulations.",
    },
    {
      icon: <Scale className="w-6 h-6 text-green-400" />,
      title: "User Responsibilities",
      content:
        "Users are responsible for providing accurate information and maintaining the confidentiality of their account credentials.",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "Account Security",
      content:
        "We implement security measures to protect user accounts, but users must also take reasonable precautions to safeguard access.",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-purple-400" />,
      title: "Payments and Billing",
      content:
        "All payments are processed securely. Refunds and cancellations are subject to our applicable business policies.",
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-orange-400" />,
      title: "Prohibited Activities",
      content:
        "Users must not misuse the platform, attempt unauthorized access, or engage in activities that disrupt services.",
    },
    {
      icon: <Gavel className="w-6 h-6 text-red-400" />,
      title: "Termination",
      content:
        "We reserve the right to suspend or terminate accounts that violate these Terms and Conditions without prior notice.",
    },
    {
      icon: <Mail className="w-6 h-6 text-pink-400" />,
      title: "Contact Information",
      content:
        "If you have any questions regarding these Terms and Conditions, please contact our support team.",
    },
  ];

  return (
    <>
      <img
        src="/barimage.png"
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover -z-10 "
      />
      <div className="min-h-screen bg-[#11141AD9] text-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <FileCheck className="w-10 h-10 text-cyan-400" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms & Conditions
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Please read these terms carefully before using our platform. By
              continuing to use our services, you agree to be bound by these
              terms.
            </p>

            <p className="text-sm text-gray-500 mt-4">
              Last Updated: May 13, 2026
            </p>
          </div>

          {/* Terms Sections */}
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
              By using our platform, you acknowledge that you have read,
              understood, and agreed to these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default isAuth(TermCondition);
