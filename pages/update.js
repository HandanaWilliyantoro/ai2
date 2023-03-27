import React from 'react'
import Header from '@/components/Header'

const content = [
  {
    date: '17/03/2023',
    title: 'Launch!',
    description: 'After extensive development and testing, Handana AI is now available to help users find answers to their questions quickly and easily'
  },
  {
    date: '19/03/2023',
    title: 'Image Search and Generate AI Art',
    description: 'With the image search feature, users can easily search for and find images on a wide range of topics, from animals and nature to art and design. The generative AI art feature allows users to create unique and beautiful digital art using the power of AI technology.'
  },
  {
    date: '21/03/2023',
    title: 'Authentication with Google',
    description: 'With this feature, users can securely and easily log in to their Handana AI account using their Google credentials. This provides an added layer of security, as users can avoid the need to create and remember yet another set of login credentials.'
  },
  {
    date: '22/03/2023',
    title: 'Update Feature',
    description: "Stay up-to-date with Handana AI's latest features and improvements! Our new update feature keeps you informed of all the latest advancements, ensuring that you always have access to the most cutting-edge AI technology available."
  },
  {
    date: '23/03/2023',
    title: 'New Persona on Chat Feature',
    description: "Add Mental Health Adviser, DIY Expert and Chef Persona."
  },
  {
    date: '26/03/2023',
    title: 'Hotfix UI on Dark Mode Screen',
    description: "Bringing clarity to the darkness of your screen."
  }
]

const Update = () => {
  return (
    <div className='max-w-screen-md  border-2 h-screen m-auto flex flex-col'>
      <Header />
      <div className='flex flex-col h-full p-4 py-0 overflow-y-scroll bg-white'>
        <p className='text-sm font-bold text-center ml-4 mt-6 mb-4 font-sans text-black'>Stay ahead with our latest update!</p>
        {content.map(a => (
          <div className='flex flex-row border-gray-300 items-center justify-center bg-white w-full border-2 p-4 py-3 my-2 rounded max-md:p-2'>
            <p className='font-bold bg-green-200 mr-4 font-sans text-center py-2 text-xs flex-[0.15] text-black rounded max-md:mr-4 max-md:px-2'>{a.date}</p>
            <div className='flex flex-col items-start ml-4 flex-[0.85] justify-start max-md:ml-0'>
              <h4 className='font-serif font-bold text-sm text-black mb-2'>{a.title}</h4>
              <p className='text-xs text-gray-500 font-serif'>{a.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Update