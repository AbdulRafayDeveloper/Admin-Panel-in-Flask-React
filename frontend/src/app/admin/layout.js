import React from 'react'

function layout({ children }) {
    return (
        <div>
            <div className='bg-gray-100'>
                {children}
            </div>
        </div>
    )
}

export default layout