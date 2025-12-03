import { Search, CreditCard, BookOpen, Award } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Courses",
    description:
      "Explore our extensive catalog and find the perfect course for your goals",
    step: "01",
  },
  {
    icon: CreditCard,
    title: "Enroll & Pay",
    description:
      "Secure enrollment with flexible payment options and instant access",
    step: "02",
  },
  {
    icon: BookOpen,
    title: "Start Learning",
    description:
      "Access high-quality video lessons, resources, and hands-on projects",
    step: "03",
  },
  {
    icon: Award,
    title: "Get Certified",
    description:
      "Complete the course and receive a verified certificate of completion",
    step: "04",
  },
];

export function HowItWorks() {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your learning journey in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-blue-200">
                  <div className="absolute right-0 top-1/2 transform translate-y-[-50%] w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-blue-200"></div>
                </div>
              )}

              {/* Step Number */}
              <div className="relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-black to-gray-600 rounded-full mb-6 shadow-lg">
                <div className="absolute top-2 right-2 bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  {step.step}
                </div>
                <step.icon className="h-12 w-12 text-white" />
              </div>

              <h3 className="text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
