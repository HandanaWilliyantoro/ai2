import React from 'react'

const Maintenance = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-between">
        <div className="xl:w-1/2 flex-1 flex flex-col items-center justify-center text-center px-4 lg:px-0">
            <p className="text-4xl font-bold text-gray-700 capitalize tracking-wide mt-8">We will come back!</p>
            <p className="text-base text-gray-700 uppercase font-serif mt-8">
                We regret to inform you that Handana AI will be shutting down its website services due to high development costs. However, we have good news! We will continue to focus on creating our Android mobile app to provide you with an enhanced chat feature experience.
                <br/><br/>
                We apologize for any inconvenience caused and appreciate your understanding during this transition. For any questions or assistance, please reach out to our support team.
                <br/><br/>
                Thank you for your support and we look forward to serving you through our mobile app.
                <br/><br/>
            </p>
        </div>
        <div className="w-full py-4 border-t border-gray-300">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center text-gray-600 text-sm md:space-x-8 space-y-1 md:space-y-0">
                <span>+62 856-9224-4063</span>
                <span>handanawilliyantoro9298@gmail.com</span>
            </div>
            
        </div>
    </div>
  )
}

export default Maintenance