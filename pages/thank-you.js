import React, {useState, useEffect, useCallback} from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router';

const ThankYou = observer(() => {

    const router = useRouter()

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white max-w-md p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-black">Thank You!</h2>
                <p className="text-gray-700 mb-6">
                    Your payment has been successfully processed. We appreciate your payment and hope you enjoy your purchase.
                </p>
                <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                    // Handle button click
                    router.push('/')
                }}
                >
                Back to Home
                </button>
            </div>
        </div>
    )
})

export default ThankYou;