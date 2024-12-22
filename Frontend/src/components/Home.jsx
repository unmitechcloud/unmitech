// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Cont } from '../context/Context';
// import Subscribe from './Subscribe';
// import { Cont2 } from "../context/Context2";



// const Navbar = () => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const navigate = useNavigate();
//     const {subscribeStatus} = useContext(Cont2);
//     const {id,fetchEvents,setLoading,loading} = useContext(Cont);
    
  
//     const toggleMenu = () => {
//       setIsMenuOpen(!isMenuOpen);
//     };
//     if(loading){
//       fetchEvents();
//       setLoading(false);
//     }


//     if (subscribeStatus === false) {
//       return <Subscribe id={id} />;
//     }
  
//     return (
//       <nav className="bg-white shadow-lg">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center h-16">
//             <div  href="/" className="text-2xl font-bold text-purple-600">
//               UnmiTech
//             </div>
//             <div className="hidden md:flex space-x-8">
//               <div href="/" className="text-gray-700 hover:text-purple-600 transition-colors">
//                 Home
//               </div>
//               <div onClick={()=>{navigate('/manageEvents')}}  className="text-gray-700 hover:text-purple-600 transition-colors">
//                 Dashboard
//               </div>
//               <div onClick={()=>{navigate('/addEvent')}} className="text-gray-700 hover:text-purple-600 transition-colors">
//                 Create Event
//               </div>
//               <div href="/about" className="text-gray-700 hover:text-purple-600 transition-colors">
//                 About
//               </div>
//             </div>
//             <div className="md:hidden">
//               <button
//                 className="text-gray-700 hover:text-purple-600 focus:outline-none"
//                 aria-label="Toggle menu"
//                 onClick={toggleMenu}
//               >
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//           {isMenuOpen && (
//             <div className="md:hidden space-y-4 py-4">
//               <a href="/" className="block text-gray-700 hover:text-purple-600 transition-colors">
//                 Home
//               </a>
//               <a href="/dashboard" className="block text-gray-700 hover:text-purple-600 transition-colors">
//                 Dashboard
//               </a>
//               <a href="/create-event" className="block text-gray-700 hover:text-purple-600 transition-colors">
//                 Create Event
//               </a>
//               <a href="/about" className="block text-gray-700 hover:text-purple-600 transition-colors">
//                 About
//               </a>
//             </div>
//           )}
//         </div>
//       </nav>
//     );
//   };

// const HeroSection = () => {
//   const navigate = useNavigate();
//   return (
//     <section className="text-center py-20">
//       <h1 className="text-5xl font-bold text-gray-900 mb-6">Never Miss Important Dates Again</h1>
//       <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
//         Unmitech helps you remember birthdays, anniversaries, and important events with timely notifications.
//       </p>
//       <a
//         onClick={()=>{navigate('/addEvent')}}
//         className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
//       >
//         Create Your First Event
//       </a>
//     </section>
//   );
// };

// const FeaturesSection = () => {
//   return (
//     <section className="py-16 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <FeatureCard
//             icon="🎂"
//             title="Personal Events"
//             description="Keep track of birthdays, anniversaries, and special occasions."
//           />
//           <FeatureCard
//             icon="📧"
//             title="Smart Notifications"
//             description="Get timely email reminders before your important dates."
//           />
//           <FeatureCard
//             icon="🔄"
//             title="Recurring Events"
//             description="Set up monthly or yearly recurring reminders for regular events."
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// const FeatureCard = ({ icon, title, description }) => {
//   return (
//     <div className="bg-white shadow-md p-6 rounded-lg text-center">
//       <div className="text-4xl mb-4">{icon}</div>
//       <h3 className="text-xl font-semibold mb-2">{title}</h3>
//       <p className="text-gray-600">{description}</p>
//     </div>
//   );
// };

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-gray-300 py-8">
//       <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div>
//           <h3 className="font-bold text-white mb-2">Unmitech</h3>
//           <p>Never miss your important dates again.</p>
//         </div>
//         <div>
//           <h3 className="font-bold text-white mb-2">Quick Links</h3>
//           <ul>
//             <li>
//               <a href="/about" className="hover:underline">
//                 About
//               </a>
//             </li>
//             <li>
//               <a href="/privacy" className="hover:underline">
//                 Privacy Policy
//               </a>
//             </li>
//             <li>
//               <a href="/terms" className="hover:underline">
//                 Terms of Service
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div>
//           <h3 className="font-bold text-white mb-2">Contact</h3>
//           <p>support@unmitech.com</p>
//         </div>
//       </div>
//       <div className="border-t border-gray-700 text-center mt-8 pt-4">
//         <p>© 2024 Unmitech. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// };

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8">
//         <HeroSection />
//         <FeaturesSection />
//       </main>
//       <Footer />
//     </div>
//   );
// };



 

// export default Home;

import React from "react";

const Home=()=>{
    return(
        <div>
            <h1>Home</h1>
        </div>
    )
}

export default Home;
