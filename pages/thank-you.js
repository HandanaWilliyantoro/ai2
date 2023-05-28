import React, {useState, useEffect, useCallback} from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router';

const ThankYou = observer(({channel}) => {

    const router = useRouter()

    const renderBody = useCallback(() => {
        if(channel === 'subscription'){
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="bg-grey border border-gray max-w-md p-8 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                        <p className="text-gray-700 mb-4">
                            We appreciate your support. Your subscription has been successfully
                            processed.
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
        } else if (channel === 'transaction'){
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="bg-white max-w-md p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Thank You for Your Transaction!</h2>
                        <p className="text-gray-700 mb-6">
                            Your payment has been successfully processed. We appreciate your business and hope you enjoy your purchase.
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
        }
    }, [channel]);

    return (
        <div>
            {renderBody()}
        </div>
    )
})

export default ThankYou

export const getServerSideProps = async (context) => {

    const channel = context.query.channel

    if(channel !== 'subscription' && channel !== 'transaction'){
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        }
    }

    if(!channel){
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        }
    }

    return {
        props: {
            channel: channel
        }
    }
} 