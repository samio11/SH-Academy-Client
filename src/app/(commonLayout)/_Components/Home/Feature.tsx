import { BookOpen, Users, Award, Clock, Video, Globe } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Expert-Led Courses",
    description:
      "Learn from industry professionals with years of real-world experience",
  },
  {
    icon: Clock,
    title: "Learn at Your Pace",
    description:
      "Study on your schedule with lifetime access to course materials",
  },
  {
    icon: Video,
    title: "High-Quality Content",
    description:
      "Professionally produced video lessons and interactive exercises",
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Earn recognized certificates to showcase your achievements",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with fellow learners and get help when you need it",
  },
  {
    icon: Globe,
    title: "Learn Anywhere",
    description: "Access courses on any device, anytime, anywhere in the world",
  },
];

export function FeaturesSection() {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">Why Choose SH-Academy?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to succeed in your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
